import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { contentItems, contentRevisions, eventCollaborations } from "@/db/schema";
import { requireAdminRole } from "@/lib/admin";
import { writeAudit } from "@/lib/audit";
import { helsinkiLocalToIso } from "@/lib/booking";
export const dynamic="force-dynamic";
const itemSchema=z.object({
  id:z.string().optional(),type:z.enum(["news","event","page","person","navigation","cor","setting"]),
  slug:z.string().min(1).regex(/^[a-z0-9-]+$/),status:z.enum(["draft","published","scheduled"]),
  reviewStatus:z.enum(["editing","ready","approved"]).default("editing"),
  publishAt:z.string().nullable().optional(),
  titleSv:z.string().min(1),titleEn:z.string().default(""),summarySv:z.string().default(""),summaryEn:z.string().default(""),
  bodySv:z.string().default(""),bodyEn:z.string().default(""),startsAt:z.string().nullable().optional(),endsAt:z.string().nullable().optional(),
  location:z.string().default(""),ctaUrl:z.string().default(""),imageUrl:z.string().default(""),featured:z.boolean().default(false),sortOrder:z.number().int().default(0)
});
export async function GET(req:Request){
  const auth=await requireAdminRole(["super_admin","admin","editor"]);if(!auth)return Response.json({error:"Forbidden"},{status:403});
  try{const contentId=new URL(req.url).searchParams.get("contentId");if(contentId)return Response.json({revisions:await getDb().select({id:contentRevisions.id,version:contentRevisions.version,actorEmail:contentRevisions.actorEmail,createdAt:contentRevisions.createdAt}).from(contentRevisions).where(eq(contentRevisions.contentId,contentId)).orderBy(desc(contentRevisions.version)).limit(50)});return Response.json({items:await getDb().select().from(contentItems).orderBy(desc(contentItems.updatedAt)),admin:auth.admin})}
  catch(e){return Response.json({error:e instanceof Error?e.message:"Database unavailable"},{status:500})}
}
export async function POST(req:Request){
  const auth=await requireAdminRole(["super_admin","admin","editor"]);if(!auth)return Response.json({error:"Forbidden"},{status:403});
  const parsed=itemSchema.safeParse(await req.json());if(!parsed.success)return Response.json({error:parsed.error.issues[0]?.message},{status:400});
  if(parsed.data.status!=="draft"&&!['super_admin','admin'].includes(auth.admin.role))return Response.json({error:"An administrator must approve publishing."},{status:403});
  if(parsed.data.status!=="draft"&&parsed.data.reviewStatus!=="approved")return Response.json({error:"Mark the item approved before publishing or scheduling."},{status:400});
  try{const v={...parsed.data,publishAt:helsinkiLocalToIso(parsed.data.publishAt),startsAt:helsinkiLocalToIso(parsed.data.startsAt),endsAt:helsinkiLocalToIso(parsed.data.endsAt)};if(v.status==="scheduled"&&!v.publishAt)return Response.json({error:"Choose a valid publication time."},{status:400});if(v.type==="event"&&v.startsAt&&v.endsAt&&v.endsAt<=v.startsAt)return Response.json({error:"Event end must be after its start."},{status:400});const id=crypto.randomUUID();const row=await getDb().insert(contentItems).values({...v,id,createdBy:auth.user.email}).returning();await getDb().insert(contentRevisions).values({contentId:id,version:1,snapshot:JSON.stringify(row[0]),actorEmail:auth.user.email});await writeAudit(auth.user.email,"create","content",id,{type:v.type,status:v.status});return Response.json({item:row[0]},{status:201})}
  catch(e){return Response.json({error:e instanceof Error?e.message:"Save failed"},{status:500})}
}
export async function PATCH(req:Request){
  const auth=await requireAdminRole(["super_admin","admin","editor"]);if(!auth)return Response.json({error:"Forbidden"},{status:403});
  const parsed=itemSchema.safeParse(await req.json());if(!parsed.success||!parsed.data.id)return Response.json({error:"Invalid content item"},{status:400});
  if(parsed.data.status!=="draft"&&!['super_admin','admin'].includes(auth.admin.role))return Response.json({error:"An administrator must approve publishing."},{status:403});
  if(parsed.data.status!=="draft"&&parsed.data.reviewStatus!=="approved")return Response.json({error:"Mark the item approved before publishing or scheduling."},{status:400});
  try{const v={...parsed.data,publishAt:helsinkiLocalToIso(parsed.data.publishAt),startsAt:helsinkiLocalToIso(parsed.data.startsAt),endsAt:helsinkiLocalToIso(parsed.data.endsAt)};if(v.status==="scheduled"&&!v.publishAt)return Response.json({error:"Choose a valid publication time."},{status:400});if(v.type==="event"&&v.startsAt&&v.endsAt&&v.endsAt<=v.startsAt)return Response.json({error:"Event end must be after its start."},{status:400});const id=v.id!;const row=await getDb().update(contentItems).set({...v,updatedAt:new Date().toISOString()}).where(eq(contentItems.id,id)).returning();const [{version}]=await getDb().select({version:sql<number>`coalesce(max(${contentRevisions.version}), 0) + 1`}).from(contentRevisions).where(eq(contentRevisions.contentId,id));await getDb().insert(contentRevisions).values({contentId:id,version:Number(version),snapshot:JSON.stringify(row[0]),actorEmail:auth.user.email});await writeAudit(auth.user.email,"update","content",id,{status:v.status,reviewStatus:v.reviewStatus});return Response.json({item:row[0]})}
  catch(e){return Response.json({error:e instanceof Error?e.message:"Update failed"},{status:500})}
}
export async function PUT(req:Request){
  const auth=await requireAdminRole(["super_admin","admin","editor"]);if(!auth)return Response.json({error:"Forbidden"},{status:403});
  const parsed=z.object({contentId:z.string().min(1),version:z.number().int().positive()}).safeParse(await req.json());if(!parsed.success)return Response.json({error:"Invalid revision"},{status:400});
  try{const db=getDb();const[revision]=await db.select().from(contentRevisions).where(and(eq(contentRevisions.contentId,parsed.data.contentId),eq(contentRevisions.version,parsed.data.version))).limit(1);if(!revision)return Response.json({error:"Revision not found"},{status:404});const snapshot=itemSchema.safeParse({...JSON.parse(revision.snapshot),id:parsed.data.contentId,status:"draft",reviewStatus:"editing"});if(!snapshot.success)return Response.json({error:"The saved revision is no longer compatible."},{status:409});const v=snapshot.data;const[row]=await db.update(contentItems).set({...v,publishAt:v.publishAt||null,startsAt:v.startsAt||null,endsAt:v.endsAt||null,updatedAt:new Date().toISOString()}).where(eq(contentItems.id,parsed.data.contentId)).returning();if(!row)return Response.json({error:"Content item not found"},{status:404});const[{version}]=await db.select({version:sql<number>`coalesce(max(${contentRevisions.version}), 0) + 1`}).from(contentRevisions).where(eq(contentRevisions.contentId,parsed.data.contentId));await db.insert(contentRevisions).values({contentId:parsed.data.contentId,version:Number(version),snapshot:JSON.stringify(row),actorEmail:auth.user.email});await writeAudit(auth.user.email,"restore_revision","content",parsed.data.contentId,{restoredVersion:parsed.data.version,newVersion:Number(version)});return Response.json({item:row})}
  catch(e){return Response.json({error:e instanceof Error?e.message:"Restore failed"},{status:500})}
}
export async function DELETE(req:Request){
  const auth=await requireAdminRole(["super_admin","admin","editor"]);if(!auth)return Response.json({error:"Forbidden"},{status:403});
  const{id}=await req.json() as{id?:string};if(!id)return Response.json({error:"Missing id"},{status:400});
  await getDb().delete(eventCollaborations).where(eq(eventCollaborations.eventId,id));await getDb().delete(contentRevisions).where(eq(contentRevisions.contentId,id));await getDb().delete(contentItems).where(eq(contentItems.id,id));await writeAudit(auth.user.email,"delete","content",id);return Response.json({ok:true});
}
