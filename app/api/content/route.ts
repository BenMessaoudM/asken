import { and, asc, desc, eq, lte, or } from "drizzle-orm";
import { getDb } from "@/db";
import { collaborations, contentItems, eventCollaborations } from "@/db/schema";
import { effectiveAssociationColor } from "@/lib/association-brand";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();
    const now = new Date().toISOString();
    const [rows, links] = await Promise.all([
      db.select().from(contentItems).where(and(eq(contentItems.reviewStatus,"approved"),or(eq(contentItems.status,"published"),and(eq(contentItems.status,"scheduled"),lte(contentItems.publishAt,now))))).orderBy(desc(contentItems.featured),asc(contentItems.sortOrder),desc(contentItems.updatedAt)).limit(80),
      db.select({eventId:eventCollaborations.eventId,role:eventCollaborations.role,sortOrder:eventCollaborations.sortOrder,slug:collaborations.slug,name:collaborations.name,type:collaborations.type,brandColor:collaborations.brandColor,logoUrl:collaborations.logoUrl,approvalStatus:collaborations.approvalStatus,active:collaborations.active,visible:collaborations.visible}).from(eventCollaborations).innerJoin(collaborations,eq(eventCollaborations.collaborationId,collaborations.id)).where(eq(eventCollaborations.visiblePublicly,true)).orderBy(asc(eventCollaborations.sortOrder)),
    ]);
    const publicLinks = links.filter((link) => link.active && link.visible && (link.type !== "sponsor" || link.approvalStatus === "approved")).map((link)=>({...link,brandColor:effectiveAssociationColor(link.slug,link.brandColor)}));
    return Response.json({ items:rows.map((item) => ({ ...item, associations:publicLinks.filter((link) => link.eventId === item.id) })) }, { headers:{"cache-control":"public, max-age=60"} });
  } catch {
    return Response.json({ items:[], notice:"Content is being prepared." });
  }
}
