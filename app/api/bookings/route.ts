import { and, eq, gt, gte, isNull, lt, ne } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { bookingActivity, bookingBlocks, bookingOccurrences, bookingRequests, notificationOutbox } from "@/db/schema";
import { COR_RESOURCES, academicYearStart, bookingRetentionDate, estimateBooking, hashBookingToken, helsinkiLocalToIso, maxAdvanceDate, sharesResource, validateOccurrence } from "@/lib/booking";
import { getBookingPolicy } from "@/lib/booking-policy";
import { getCorCalendarEvents } from "@/lib/cor-calendar-store";
import { allowRequest, requestFingerprint } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const occurrenceSchema = z.object({
  startsAt: z.string().min(1),
  endsAt: z.string().min(1),
  resources: z.array(z.enum(COR_RESOURCES)).min(1),
});

const schema = z.object({
  bookerType: z.enum(["internal_ask", "arcada_association", "external", "external_member", "alumni"]),
  organizationName: z.string().max(160).default(""),
  contactName: z.string().trim().min(2).max(120),
  contactEmail: z.string().trim().email().max(200),
  contactPhone: z.string().trim().max(50).default(""),
  billingName: z.string().trim().min(2).max(160),
  billingStreet: z.string().trim().min(2).max(200),
  billingPostalCode: z.string().trim().min(2).max(30),
  billingCity: z.string().trim().min(2).max(100),
  billingCountry: z.string().trim().min(2).max(100).default("Finland"),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  resources: z.array(z.enum(COR_RESOURCES)).optional(),
  occurrences: z.array(occurrenceSchema).min(1).max(10).optional(),
  purposeSv: z.string().max(1500).default(""),
  purposeEn: z.string().max(1500).default(""),
  contractLanguage: z.enum(["sv", "en", "fi"]),
  memberNumber: z.string().trim().max(80).default(""),
  packageSize: z.union([z.literal(3), z.literal(5), z.literal(10)]).nullable().optional(),
  privacyAcknowledged: z.boolean().refine(Boolean),
  website: z.string().max(0).optional(),
});

function safeResources(value: string) {
  try { return JSON.parse(value) as string[]; } catch { return []; }
}

export async function POST(request: Request) {
  const rate = await allowRequest(`booking:${requestFingerprint(request)}`, 6, 15 * 60 * 1000);
  if (!rate.allowed) {
    return Response.json({ error: "Too many requests. Please try again later." }, { status: 429, headers: { "retry-after": String(rate.retryAfter) } });
  }

  try {
    const payload = schema.parse(await request.json());
    const policy = await getBookingPolicy();
    if (["arcada_association", "external"].includes(payload.bookerType) && !payload.organizationName.trim()) {
      return Response.json({ error: "Organisation is required for this booking type." }, { status: 400 });
    }
    const rawOccurrences = payload.occurrences?.length
      ? payload.occurrences
      : payload.startsAt && payload.endsAt && payload.resources
        ? [{ startsAt: payload.startsAt, endsAt: payload.endsAt, resources: payload.resources }]
        : [];
    if (!rawOccurrences.length) return Response.json({ error: "Add at least one booking date." }, { status: 400 });
    if (rawOccurrences.length > policy.maxDatesPerRequest) return Response.json({ error: `Add no more than ${policy.maxDatesPerRequest} booking dates.` }, { status: 400 });

    const normalizedOccurrences = rawOccurrences.map((item) => ({ ...item, startsAt:helsinkiLocalToIso(item.startsAt), endsAt:helsinkiLocalToIso(item.endsAt) }));
    if (normalizedOccurrences.some((item) => !item.startsAt || !item.endsAt)) return Response.json({ error:"Choose valid Helsinki start and end times." }, { status:400 });
    const occurrences = normalizedOccurrences.map((item) => ({ ...item, startsAt:item.startsAt!, endsAt:item.endsAt!, resources:[...new Set(item.resources)] }));
    for (const occurrence of occurrences) {
      const validationError = validateOccurrence(occurrence, policy);
      if (validationError) return Response.json({ error: validationError }, { status: 400 });
      const start = new Date(occurrence.startsAt);
      if (start.getTime() < Date.now() - 5 * 60 * 1000) return Response.json({ error: "Booking dates must be in the future." }, { status: 400 });
      if (start > maxAdvanceDate(new Date(), policy.maxAdvanceMonths)) return Response.json({ error: `Bookings can be requested at most ${policy.maxAdvanceMonths} months ahead.` }, { status: 400 });
    }
    if (payload.bookerType === "arcada_association" && payload.packageSize && occurrences.length !== payload.packageSize) {
      return Response.json({ error: `The selected package requires exactly ${payload.packageSize} booking dates.` }, { status: 400 });
    }

    const db = getDb();
    for (const occurrence of occurrences) {
      const [reserved, legacy, blocked, calendar] = await Promise.all([
        db.select({ resources: bookingOccurrences.resources }).from(bookingOccurrences).where(and(eq(bookingOccurrences.status, "active"), lt(bookingOccurrences.startsAt, occurrence.endsAt), gt(bookingOccurrences.endsAt, occurrence.startsAt))).limit(100),
        db.select({ resources: bookingRequests.resources }).from(bookingRequests).where(and(ne(bookingRequests.status, "cancelled"), isNull(bookingRequests.deletedAt), lt(bookingRequests.startsAt, occurrence.endsAt), gt(bookingRequests.endsAt, occurrence.startsAt))).limit(100),
        db.select({ resources: bookingBlocks.resources }).from(bookingBlocks).where(and(eq(bookingBlocks.active, true), lt(bookingBlocks.startsAt, occurrence.endsAt), gt(bookingBlocks.endsAt, occurrence.startsAt))).limit(100),
        getCorCalendarEvents(occurrence.startsAt, occurrence.endsAt),
      ]);
      const hasDatabaseConflict = [...reserved, ...legacy, ...blocked].some((row) => sharesResource(safeResources(row.resources), occurrence.resources));
      const hasCalendarConflict = calendar.some((row) => sharesResource(row.resources, occurrence.resources));
      if (hasDatabaseConflict || hasCalendarConflict) {
        return Response.json({ error: "One or more selected spaces are unavailable during this time." }, { status: 409 });
      }
    }

    let internalBenefitApplied = false;
    if (payload.bookerType === "internal_ask") {
      const existing = await db.select({ id: bookingRequests.id }).from(bookingRequests).where(and(eq(bookingRequests.bookerType, "internal_ask"), ne(bookingRequests.status, "cancelled"), isNull(bookingRequests.deletedAt), gte(bookingRequests.startsAt, academicYearStart(new Date(occurrences[0]!.startsAt))))).limit(100);
      internalBenefitApplied = existing.length < policy.internalFreeBookings;
    }

    const estimateType = payload.bookerType === "internal_ask" && !internalBenefitApplied ? "external_member" : payload.bookerType;
    const price = estimateBooking(estimateType, occurrences, payload.packageSize, policy);
    const first = occurrences[0]!;
    const year = new Date(first.startsAt).getUTCFullYear();
    const reference = `COR-${year}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
    const token = crypto.randomUUID();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.insert(bookingRequests).values({
      id, reference, statusToken: await hashBookingToken(token), bookerType: payload.bookerType, organizationName: payload.organizationName,
      contactName: payload.contactName, contactEmail: payload.contactEmail, contactPhone: payload.contactPhone,
      billingName: payload.billingName, billingStreet: payload.billingStreet, billingPostalCode: payload.billingPostalCode,
      billingCity: payload.billingCity, billingCountry: payload.billingCountry, startsAt: first.startsAt, endsAt: first.endsAt,
      resources: JSON.stringify(first.resources), purposeSv: payload.purposeSv, purposeEn: payload.purposeEn,
      estimatedPriceCents: price, contractLanguage: payload.contractLanguage, memberNumber: payload.memberNumber,
      packageSize: payload.packageSize || null, invoiceStatus: price === 0 ? "not_required" : "draft",
      contractStatus: payload.bookerType === "arcada_association" ? "not_required" : "draft",
      internalNotes: payload.bookerType === "internal_ask" ? (internalBenefitApplied ? "Annual internal free booking applied." : "Annual free booking already used; member pricing estimate applied.") : "",
      privacyAcceptedAt: now, privacyNoticeVersion: "2026-09-06", retentionUntil: bookingRetentionDate(new Date(now)),
    });
    for (const occurrence of occurrences) {
      await db.insert(bookingOccurrences).values({ id: crypto.randomUUID(), bookingId: id, startsAt: occurrence.startsAt, endsAt: occurrence.endsAt, resources: JSON.stringify(occurrence.resources) });
    }
    await db.insert(bookingActivity).values({ bookingId: id, action: "request_created", actor: payload.contactEmail, metadata: JSON.stringify({ dates: occurrences.length, estimatedPriceCents: price }) });
    const statusPath = payload.contractLanguage === "en" ? "booking" : "bokning";
    await db.insert(notificationOutbox).values({id:crypto.randomUUID(),template:"booking_received",recipient:payload.contactEmail,locale:payload.contractLanguage,payload:JSON.stringify({reference,estimatedPriceCents:price,statusPath,token})});
    return Response.json({ reference, token, estimatedPriceCents: price, statusUrl: `/${statusPath}/${reference}?token=${token}` }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof z.ZodError ? error.issues[0]?.message : "Could not create booking request" }, { status: 400 });
  }
}
