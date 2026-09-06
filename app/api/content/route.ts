import { and, asc, desc, eq, lte, or } from "drizzle-orm";
import { getDb } from "@/db";
import { contentItems } from "@/db/schema";
export const dynamic="force-dynamic";
export async function GET(){
  try{
    const rows=await getDb().select().from(contentItems).where(or(eq(contentItems.status,"published"),and(eq(contentItems.status,"scheduled"),lte(contentItems.publishAt,new Date().toISOString())))).orderBy(desc(contentItems.featured),asc(contentItems.sortOrder),desc(contentItems.updatedAt)).limit(40);
    return Response.json({items:rows});
  }catch{return Response.json({items:[],notice:"Content is being prepared."})}
}
