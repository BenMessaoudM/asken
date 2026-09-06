import { asc, and, eq, or, isNull, gte } from "drizzle-orm";
import { getDb } from "@/db";
import { collaborations, liveCorItems } from "@/db/schema";
export const dynamic="force-dynamic";
export async function GET(){try{const rows=await getDb().select({id:liveCorItems.id,type:liveCorItems.type,titleSv:liveCorItems.titleSv,titleEn:liveCorItems.titleEn,descriptionSv:liveCorItems.descriptionSv,descriptionEn:liveCorItems.descriptionEn,startsAt:liveCorItems.startsAt,endsAt:liveCorItems.endsAt,space:liveCorItems.space,collaborationName:collaborations.name,collaborationSlug:collaborations.slug}).from(liveCorItems).leftJoin(collaborations,eq(liveCorItems.collaborationId,collaborations.id)).where(and(eq(liveCorItems.active,true),eq(liveCorItems.visiblePublicly,true),or(isNull(liveCorItems.endsAt),gte(liveCorItems.endsAt,new Date().toISOString())))).orderBy(asc(liveCorItems.startsAt));return Response.json({items:rows})}catch{return Response.json({items:[]})}}
