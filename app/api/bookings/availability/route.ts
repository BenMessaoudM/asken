import { and, eq, gt, isNull, lt, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { bookingBlocks, bookingOccurrences, bookingRequests } from "@/db/schema";
import { getCorCalendarEvents } from "@/lib/cor-calendar-store";

export const dynamic = "force-dynamic";

function resources(value: string) {
  try { return JSON.parse(value) as string[]; } catch { return []; }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const from = new Date(url.searchParams.get("from") || new Date().toISOString());
  const defaultTo = new Date(from); defaultTo.setUTCDate(defaultTo.getUTCDate() + 60);
  const to = new Date(url.searchParams.get("to") || defaultTo.toISOString());
  if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime()) || to <= from || to.getTime() - from.getTime() > 120 * 86400000) {
    return Response.json({ error: "Choose an availability period of up to 120 days." }, { status: 400 });
  }
  try {
    const db = getDb();
    const [occurrences, legacy, blocks, calendar] = await Promise.all([
      db.select({ startsAt: bookingOccurrences.startsAt, endsAt: bookingOccurrences.endsAt, resources: bookingOccurrences.resources }).from(bookingOccurrences).where(and(eq(bookingOccurrences.status, "active"), lt(bookingOccurrences.startsAt, to.toISOString()), gt(bookingOccurrences.endsAt, from.toISOString()))).limit(500),
      db.select({ startsAt: bookingRequests.startsAt, endsAt: bookingRequests.endsAt, resources: bookingRequests.resources }).from(bookingRequests).where(and(ne(bookingRequests.status, "cancelled"), isNull(bookingRequests.deletedAt), lt(bookingRequests.startsAt, to.toISOString()), gt(bookingRequests.endsAt, from.toISOString()))).limit(500),
      db.select({ startsAt: bookingBlocks.startsAt, endsAt: bookingBlocks.endsAt, resources: bookingBlocks.resources, reasonSv: bookingBlocks.reasonSv, reasonEn: bookingBlocks.reasonEn }).from(bookingBlocks).where(and(eq(bookingBlocks.active, true), lt(bookingBlocks.startsAt, to.toISOString()), gt(bookingBlocks.endsAt, from.toISOString()))).limit(500),
      getCorCalendarEvents(from.toISOString(), to.toISOString()),
    ]);
    const seen = new Set<string>();
    const databaseBusy = [...occurrences, ...legacy, ...blocks].map((item) => ({ ...item, resources: resources(item.resources) }));
    const calendarBusy = calendar.map((item) => ({ startsAt:item.startsAt, endsAt:item.endsAt, resources:item.resources, reasonSv:item.titleSv, reasonEn:item.titleEn, associationSlug:item.associationSlug, brandColor:item.brandColor, tentative:item.tentative, allDay:item.allDay, source:"calendar" }));
    const busy = [...databaseBusy, ...calendarBusy].filter((item) => {
      const key = `${item.startsAt}|${item.endsAt}|${item.resources.join(",")}`;
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
    return Response.json({ from: from.toISOString(), to: to.toISOString(), busy }, { headers: { "cache-control": "public, max-age=30" } });
  } catch {
    const calendar = await getCorCalendarEvents(from.toISOString(), to.toISOString());
    return Response.json({
      from: from.toISOString(),
      to: to.toISOString(),
      busy: calendar.map((item) => ({ startsAt:item.startsAt, endsAt:item.endsAt, resources:item.resources, reasonSv:item.titleSv, reasonEn:item.titleEn, associationSlug:item.associationSlug, brandColor:item.brandColor, tentative:item.tentative, allDay:item.allDay, source:"calendar" })),
      notice: "Live booking data is temporarily unavailable; imported Cor calendar times are shown.",
    }, { headers: { "cache-control": "public, max-age=30" } });
  }
}
