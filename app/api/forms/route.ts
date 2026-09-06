import { z } from "zod";
import { getDb } from "@/db";
import { formSubmissions, notificationOutbox } from "@/db/schema";
import { allowRequest, requestFingerprint } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
const schema=z.object({type:z.enum(["contact","support","harassment","tutoring","recruitment","partnership","event"]),name:z.string().trim().min(2).max(120),email:z.string().trim().email().max(200),organization:z.string().trim().max(160).default(""),message:z.string().trim().min(10).max(5000),consentToContact:z.literal(true),website:z.string().max(0).optional()});

export async function POST(request:Request){
  const rate=await allowRequest(`form:${requestFingerprint(request)}`,8,15*60*1000);if(!rate.allowed)return Response.json({error:"Too many requests. Please try again later."},{status:429,headers:{"Retry-After":String(rate.retryAfter)}});
  const parsed=schema.safeParse(await request.json());if(!parsed.success)return Response.json({error:parsed.error.issues[0]?.message},{status:400});
  const now=new Date(),retention=new Date(now);retention.setUTCFullYear(retention.getUTCFullYear()+1);const reference=`ASK-${now.getUTCFullYear()}-${crypto.randomUUID().slice(0,6).toUpperCase()}`;
  await getDb().insert(formSubmissions).values({...parsed.data,id:crypto.randomUUID(),reference,retentionUntil:retention.toISOString(),privacyNoticeVersion:"2026-09-05"});
  await getDb().insert(notificationOutbox).values({id:crypto.randomUUID(),template:"form_received",recipient:parsed.data.email,locale:"sv",payload:JSON.stringify({reference,type:parsed.data.type})});
  await getDb().insert(notificationOutbox).values({id:crypto.randomUUID(),template:"internal_new_case",recipient:"info@asken.fi",locale:"sv",payload:JSON.stringify({reference,type:parsed.data.type})});
  return Response.json({reference},{status:201});
}
