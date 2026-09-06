import { and, asc, eq, gte, isNull, ne, or } from "drizzle-orm";
import { getDb } from "@/db";
import { bookingOccurrences, bookingRequests, collaborations, liveCorItems } from "@/db/schema";
import { associationBrand, ASK_PURPLE, effectiveAssociationColor } from "@/lib/association-brand";
import { getCorCalendarEvents } from "@/lib/cor-calendar-store";

export const dynamic = "force-dynamic";

function parseResources(value: string) {
  try { return JSON.parse(value) as string[]; } catch { return []; }
}

function spaceLabel(resources: string[]) {
  return resources.map((resource) => resource === "hall" ? "Salen / Hall" : resource === "kitchen" ? "Köket / Kitchen" : "Kabinettet & bastun / Cabinet & sauna").join(" · ") || "Cor";
}

export async function GET() {
  const now = new Date().toISOString();
  const until = new Date();
  until.setUTCDate(until.getUTCDate() + 120);
  try {
    const db = getDb();
    const [manualRows, bookingRows, calendarRows] = await Promise.all([
      db.select({
        id:liveCorItems.id,type:liveCorItems.type,titleSv:liveCorItems.titleSv,titleEn:liveCorItems.titleEn,
        descriptionSv:liveCorItems.descriptionSv,descriptionEn:liveCorItems.descriptionEn,startsAt:liveCorItems.startsAt,
        endsAt:liveCorItems.endsAt,space:liveCorItems.space,collaborationName:collaborations.name,
        collaborationSlug:collaborations.slug,brandColor:collaborations.brandColor,
      }).from(liveCorItems).leftJoin(collaborations,eq(liveCorItems.collaborationId,collaborations.id))
        .where(and(eq(liveCorItems.active,true),eq(liveCorItems.visiblePublicly,true),or(isNull(liveCorItems.endsAt),gte(liveCorItems.endsAt,now)))).orderBy(asc(liveCorItems.startsAt)),
      db.select({
        id:bookingOccurrences.id,startsAt:bookingOccurrences.startsAt,endsAt:bookingOccurrences.endsAt,resources:bookingOccurrences.resources,
        bookerType:bookingRequests.bookerType,organizationName:bookingRequests.organizationName,associationVerified:bookingRequests.associationVerified,
      }).from(bookingOccurrences).innerJoin(bookingRequests,eq(bookingOccurrences.bookingId,bookingRequests.id))
        .where(and(eq(bookingOccurrences.status,"active"),ne(bookingRequests.status,"cancelled"),isNull(bookingRequests.deletedAt),gte(bookingOccurrences.endsAt,now))).orderBy(asc(bookingOccurrences.startsAt)).limit(200),
      getCorCalendarEvents(now, until.toISOString()),
    ]);

    const manual = manualRows.map((item) => ({ ...item, brandColor:effectiveAssociationColor(item.collaborationSlug,item.brandColor), source:"manual" }));
    const websiteBookings = bookingRows.map((item) => {
      const publicAssociation = item.bookerType === "arcada_association" && item.associationVerified ? associationBrand(item.organizationName) : null;
      const isAsk = item.bookerType === "internal_ask";
      const titleSv = publicAssociation ? `${publicAssociation.name} på Cor` : isAsk ? "ASK-bokning" : "Privat bokning";
      const titleEn = publicAssociation ? `${publicAssociation.name} at Cor` : isAsk ? "ASK booking" : "Private booking";
      return { id:`booking:${item.id}`,type:"booking",titleSv,titleEn,descriptionSv:"Bekräftad bokning",descriptionEn:"Confirmed booking",startsAt:item.startsAt,endsAt:item.endsAt,space:spaceLabel(parseResources(item.resources)),collaborationName:publicAssociation?.name,collaborationSlug:publicAssociation?.slug,brandColor:publicAssociation?.color || (isAsk ? ASK_PURPLE : "#6B6470"),source:"booking" };
    });
    const imported = calendarRows.filter((item) => item.visiblePublicly).map((item) => ({
      id:`calendar:${item.id}`,type:"booking",titleSv:item.titleSv,titleEn:item.titleEn,
      descriptionSv:item.tentative?"Preliminär bokning":"Bekräftad bokning",descriptionEn:item.tentative?"Preliminary booking":"Confirmed booking",
      startsAt:item.startsAt,endsAt:item.endsAt,space:spaceLabel(item.resources),collaborationName:associationBrand(item.associationSlug)?.name,
      collaborationSlug:item.associationSlug,brandColor:item.brandColor,source:"calendar",tentative:item.tentative,allDay:item.allDay,
    }));
    const items = [...manual, ...websiteBookings, ...imported].sort((a,b) => (a.startsAt || "").localeCompare(b.startsAt || "")).slice(0,100);
    return Response.json({ items }, { headers:{"cache-control":"public, max-age=30"} });
  } catch {
    const imported = (await getCorCalendarEvents(now, until.toISOString())).filter((item) => item.visiblePublicly).map((item) => ({
      id:`calendar:${item.id}`,type:"booking",titleSv:item.titleSv,titleEn:item.titleEn,
      descriptionSv:item.tentative?"Preliminär bokning":"Bekräftad bokning",descriptionEn:item.tentative?"Preliminary booking":"Confirmed booking",
      startsAt:item.startsAt,endsAt:item.endsAt,space:spaceLabel(item.resources),collaborationName:associationBrand(item.associationSlug)?.name,
      collaborationSlug:item.associationSlug,brandColor:item.brandColor,source:"calendar",tentative:item.tentative,allDay:item.allDay,
    }));
    return Response.json({ items:imported }, { headers:{"cache-control":"public, max-age=30"} });
  }
}
