import { and, desc, eq, gte, lte } from "drizzle-orm";
import { getDb } from "@/db";
import { themeSchedules } from "@/db/schema";

export const dynamic = "force-dynamic";

function automaticTheme(date:Date){const month=date.getUTCMonth()+1,day=date.getUTCDate();if((month===8&&day>=20)||month===9)return "gulis";if(month===12&&day===6)return "independence";if(month===11&&day===6)return "swedish_day";if(month===12&&day>=1&&day<=26)return "christmas";if((month===12&&day>=27)||(month===1&&day<=2))return "new_year";if((month===4&&day>=28)||(month===5&&day<=2))return "vappu";if(month===6&&day>=19&&day<=26)return "midsummer";if(month===10&&day>=25)return "halloween";return "default"}

export async function GET(){const now=new Date(),iso=now.toISOString();try{const [scheduled]=await getDb().select().from(themeSchedules).where(and(eq(themeSchedules.active,true),lte(themeSchedules.startsAt,iso),gte(themeSchedules.endsAt,iso))).orderBy(desc(themeSchedules.startsAt)).limit(1);return Response.json({theme:scheduled?.theme||automaticTheme(now),source:scheduled?"schedule":"automatic"},{headers:{"Cache-Control":"public, max-age=300"}})}catch{return Response.json({theme:automaticTheme(now),source:"automatic"},{headers:{"Cache-Control":"public, max-age=60"}})}}
