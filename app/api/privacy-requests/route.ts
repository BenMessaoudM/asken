import { z } from "zod";
import { getDb } from "@/db";
import { dataRequests, notificationOutbox } from "@/db/schema";
import { allowRequest, requestFingerprint } from "@/lib/rate-limit";

export const dynamic="force-dynamic";
const schema=z.object({type:z.enum(["access","correction","deletion","restriction","objection","portability","photo_consent"]),name:z.string().trim().min(2).max(120),email:z.string().trim().email().max(200),details:z.string().trim().min(5).max(3000),website:z.string().max(0).optional()});
export async function POST(request:Request){const rate=allowRequest(`privacy:${requestFingerprint(request)}`,5,60*60*1000);if(!rate.allowed)return Response.json({error:"Too many requests. Please try again later."},{status:429});const parsed=schema.safeParse(await request.json());if(!parsed.success)return Response.json({error:parsed.error.issues[0]?.message},{status:400});const reference=`GDPR-${new Date().getUTCFullYear()}-${crypto.randomUUID().slice(0,6).toUpperCase()}`,db=getDb();await db.insert(dataRequests).values({...parsed.data,id:crypto.randomUUID(),reference});await db.insert(notificationOutbox).values({id:crypto.randomUUID(),template:"privacy_request_received",recipient:parsed.data.email,locale:"sv",payload:JSON.stringify({reference,type:parsed.data.type})});await db.insert(notificationOutbox).values({id:crypto.randomUUID(),template:"internal_privacy_request",recipient:"info@asken.fi",locale:"sv",payload:JSON.stringify({reference,type:parsed.data.type})});return Response.json({reference},{status:201});}
