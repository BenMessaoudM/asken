import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { contentItems, contentRevisions } from "@/db/schema";
import { requireAdminRole } from "@/lib/admin";
import { writeAudit } from "@/lib/audit";
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
export async function GET(){
  const auth=await requireAdminRole(["super_admin","admin","editor"]);if(!auth)return Response.json({error:"Forbidden"},{status:403});
  try{return Response.json({items:await getDb().select().from(contentItems).orderBy(desc(contentItems.updatedAt)),admin:auth.admin})}
  catch(e){return Response.json({error:e instanceof Error?e.message:"Database unavailable"},{status:500})}
}
export async function POST(req:Request){
  const auth=await requireAdminRole(["super_admin","admin","editor"]);if(!auth)return Response.json({error:"Forbidden"},{status:403});
  const parsed=itemSchema.safeParse(await req.json());if(!parsed.success)return Response.json({error:parsed.error.issues[0]?.message},{status:400});
  if(parsed.data.status!=="draft"&&!['super_admin','admin'].includes(auth.admin.role))return Response.json({error:"An administrator must approve publishing."},{status:403});
  if(parsed.data.status!=="draft"&&parsed.data.reviewStatus!=="approved")return Response.json({error:"Mark the item approved before publishing or scheduling."},{status:400});
  try{const v=parsed.data;const id=crypto.randomUUID();const row=await getDb().insert(contentItems).values({...v,id,publishAt:v.publishAt||null,startsAt:v.startsAt||null,endsAt:v.endsAt||null,createdBy:auth.user.email}).returning();await getDb().insert(contentRevisions).values({contentId:id,version:1,snapshot:JSON.stringify(row[0]),actorEmail:auth.user.email});await writeAudit(auth.user.email,"create","content",id,{type:v.type,status:v.status});return Response.json({item:row[0]},{status:201})}
  catch(e){return Response.json({error:e instanceof Error?e.message:"Save failed"},{status:500})}
}
export async function PATCH(req:Request){
  const auth=await requireAdminRole(["super_admin","admin","editor"]);if(!auth)return Response.json({error:"Forbidden"},{status:403});
  const parsed=itemSchema.safeParse(await req.json());if(!parsed.success||!parsed.data.id)return Response.json({error:"Invalid content item"},{status:400});
  if(parsed.data.status!=="draft"&&!['super_admin','admin'].includes(auth.admin.role))return Response.json({error:"An administrator must approve publishing."},{status:403});
  if(parsed.data.status!=="draft"&&parsed.data.reviewStatus!=="approved")return Response.json({error:"Mark the item approved before publishing or scheduling."},{status:400});
  try{const v=parsed.data;const id=v.id!;const row=await getDb().update(contentItems).set({...v,publishAt:v.publishAt||null,startsAt:v.startsAt||null,endsAt:v.endsAt||null,updatedAt:new Date().toISOString()}).where(eq(contentItems.id,id)).returning();const [{version}]=await getDb().select({version:sql<number>`coalesce(max(${contentRevisions.version}), 0) + 1`}).from(contentRevisions).where(eq(contentRevisions.contentId,id));await getDb().insert(contentRevisions).values({contentId:id,version:Number(version),snapshot:JSON.stringify(row[0]),actorEmail:auth.user.email});await writeAudit(auth.user.email,"update","content",id,{status:v.status,reviewStatus:v.reviewStatus});return Response.json({item:row[0]})}
  catch(e){return Response.json({error:e instanceof Error?e.message:"Update failed"},{status:500})}
}
export async function DELETE(req:Request){
  const auth=await requireAdminRole(["super_admin","admin","editor"]);if(!auth)return Response.json({error:"Forbidden"},{status:403});
  const{id}=await req.json() as{id?:string};if(!id)return Response.json({error:"Missing id"},{status:400});
  await getDb().delete(contentItems).where(eq(contentItems.id,id));await writeAudit(auth.user.email,"delete","content",id);return Response.json({ok:true});
}
