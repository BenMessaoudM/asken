import { and, asc, eq, gt, lt, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { corCalendarEvents } from "@/db/schema";
import { INITIAL_COR_CALENDAR } from "@/lib/cor-calendar";

export type PublicCorCalendarEvent = {
  id: string;
  sourceUid: string;
  titleSv: string;
  titleEn: string;
  associationSlug: string | null;
  brandColor: string;
  startsAt: string;
  endsAt: string;
  resources: string[];
  category: "association" | "ask" | "private";
  tentative: boolean;
  allDay: boolean;
  visiblePublicly: boolean;
  active: boolean;
};

function safeResources(value: string) {
  try { return JSON.parse(value) as string[]; } catch { return []; }
}

function fallback(from: string, to: string) {
  return INITIAL_COR_CALENDAR.filter((item) => item.active && item.startsAt < to && item.endsAt > from).map((item) => ({ ...item, id: `seed:${item.sourceUid}` }));
}

export async function getCorCalendarEvents(from: string, to: string): Promise<PublicCorCalendarEvent[]> {
  try {
    const db = getDb();
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(corCalendarEvents);
    if (!Number(count || 0)) return fallback(from, to);
    const rows = await db.select().from(corCalendarEvents).where(and(eq(corCalendarEvents.active, true), lt(corCalendarEvents.startsAt, to), gt(corCalendarEvents.endsAt, from))).orderBy(asc(corCalendarEvents.startsAt));
    return rows.map((item) => ({ ...item, resources: safeResources(item.resources) }));
  } catch {
    return fallback(from, to);
  }
}
