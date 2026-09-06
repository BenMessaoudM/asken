import {and,asc,eq,isNotNull,lte,or} from "drizzle-orm";
import {getDb} from "@/db";
import {contentItems} from "@/db/schema";
import {SITE_URL} from "@/lib/site";
export const dynamic="force-dynamic";
const escape=(value:string)=>value.replaceAll("\\","\\\\").replaceAll("\n","\\n").replaceAll(",","\\,").replaceAll(";","\\;");
const date=(value:string)=>new Date(value).toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z");
export async function GET(){let events:typeof contentItems.$inferSelect[]=[];try{const now=new Date().toISOString();events=await getDb().select().from(contentItems).where(and(eq(contentItems.type,"event"),eq(contentItems.reviewStatus,"approved"),or(eq(contentItems.status,"published"),and(eq(contentItems.status,"scheduled"),lte(contentItems.publishAt,now))),isNotNull(contentItems.startsAt))).orderBy(asc(contentItems.startsAt)).limit(250)}catch{}const lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//ASK//Events//SV","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:ASK Events",...events.flatMap(event=>["BEGIN:VEVENT",`UID:${event.id}@asken.fi`,`DTSTAMP:${date(event.updatedAt)}`,`DTSTART:${date(event.startsAt!)}`,...(event.endsAt?[`DTEND:${date(event.endsAt)}`]:[]),`SUMMARY:${escape(event.titleSv)}`,`DESCRIPTION:${escape(event.summarySv)}`,`LOCATION:${escape(event.location)}`,`URL:${SITE_URL}/evenemang/${event.slug}`,"END:VEVENT"]),"END:VCALENDAR"];return new Response(lines.join("\r\n"),{headers:{"content-type":"text/calendar; charset=utf-8","content-disposition":"inline; filename=ask-events.ics","cache-control":"public, max-age=300"}})}
