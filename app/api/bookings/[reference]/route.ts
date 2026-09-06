import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { bookingActivity, bookingEvidence, bookingOccurrences, bookingRequests, notificationOutbox } from "@/db/schema";
import { allowRequest, requestFingerprint } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

async function findBooking(reference: string, token: string) {
  const [row] = await getDb().select().from(bookingRequests).where(and(eq(bookingRequests.reference, reference), eq(bookingRequests.statusToken, token))).limit(1);
  return row;
}

export async function GET(request: Request, { params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const token = new URL(request.url).searchParams.get("token") || "";
  const rate = allowRequest(`booking-status:${requestFingerprint(request)}`, 30, 15 * 60 * 1000);
  if (!rate.allowed) return Response.json({ error: "Too many requests." }, { status: 429 });
  const row = await findBooking(reference, token);
  if (!row || row.deletedAt) return Response.json({ error: "Not found" }, { status: 404 });
  const [occurrences, activity, evidence] = await Promise.all([
    getDb().select().from(bookingOccurrences).where(eq(bookingOccurrences.bookingId, row.id)).orderBy(asc(bookingOccurrences.startsAt)),
    getDb().select({ action: bookingActivity.action, notes: bookingActivity.notes, createdAt: bookingActivity.createdAt }).from(bookingActivity).where(eq(bookingActivity.bookingId, row.id)).orderBy(asc(bookingActivity.createdAt)),
    getDb().select({id:bookingEvidence.id,type:bookingEvidence.type,fileUrl:bookingEvidence.fileUrl,note:bookingEvidence.note,createdAt:bookingEvidence.createdAt}).from(bookingEvidence).where(and(eq(bookingEvidence.bookingId,row.id),eq(bookingEvidence.shareWithBooker,true))).orderBy(asc(bookingEvidence.createdAt)),
  ]);
  const { statusToken, internalNotes, deletedAt, deletedBy, ...safe } = row;
  void statusToken;void internalNotes;void deletedAt;void deletedBy;
  return Response.json({
    booking: {
      ...safe,
      resources: JSON.parse(row.resources),
      doorCode: row.status === "signed" && row.contractStatus === "signed" ? row.doorCode : "",
      occurrences: occurrences.map((item) => ({ ...item, resources: JSON.parse(item.resources) })),
      activity,
      evidence,
    },
  }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
}

const cancelSchema = z.object({ reason: z.string().trim().min(2).max(500) });

export async function POST(request: Request, { params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const token = new URL(request.url).searchParams.get("token") || "";
  const rate = allowRequest(`booking-cancel:${requestFingerprint(request)}`, 6, 60 * 60 * 1000);
  if (!rate.allowed) return Response.json({ error: "Too many requests." }, { status: 429 });
  const parsed = cancelSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const booking = await findBooking(reference, token);
  if (!booking || booking.deletedAt) return Response.json({ error: "Not found" }, { status: 404 });
  if (booking.status === "cancelled") return Response.json({ ok: true, status: "cancelled" });
  if (booking.status === "signed") return Response.json({ error: "A signed booking must be cancelled by ASK. Contact info@asken.fi." }, { status: 409 });
  const now = new Date().toISOString();
  await getDb().update(bookingRequests).set({ status: "cancelled", cancellationReason: parsed.data.reason, cancelledAt: now, updatedAt: now }).where(eq(bookingRequests.id, booking.id));
  await getDb().update(bookingOccurrences).set({ status: "cancelled" }).where(eq(bookingOccurrences.bookingId, booking.id));
  await getDb().insert(bookingActivity).values({ bookingId: booking.id, action: "cancelled_by_booker", actor: booking.contactEmail, notes: parsed.data.reason });
  await getDb().insert(notificationOutbox).values({id:crypto.randomUUID(),template:"booking_cancelled",recipient:booking.contactEmail,locale:booking.contractLanguage,payload:JSON.stringify({reference:booking.reference,reason:parsed.data.reason})});
  return Response.json({ ok: true, status: "cancelled" });
}
