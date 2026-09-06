import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { publicDocuments } from "@/db/schema";
export const dynamic="force-dynamic";
export async function GET(){try{const items=await getDb().select({id:publicDocuments.id,slug:publicDocuments.slug,category:publicDocuments.category,titleSv:publicDocuments.titleSv,titleEn:publicDocuments.titleEn,descriptionSv:publicDocuments.descriptionSv,descriptionEn:publicDocuments.descriptionEn,fileUrl:publicDocuments.fileUrl,meetingDate:publicDocuments.meetingDate,language:publicDocuments.language,updatedAt:publicDocuments.updatedAt}).from(publicDocuments).where(eq(publicDocuments.status,"published")).orderBy(desc(publicDocuments.meetingDate),desc(publicDocuments.updatedAt));return Response.json({items},{headers:{"cache-control":"public, max-age=120"}})}catch{return Response.json({items:[]})}}
