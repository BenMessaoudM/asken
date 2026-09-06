import { getDb } from "@/db";
import { auditLogs } from "@/db/schema";

export async function writeAudit(actorEmail:string,action:string,entityType:string,entityId:string,details:Record<string,unknown>={}){
  await getDb().insert(auditLogs).values({actorEmail,action,entityType,entityId,details:JSON.stringify(details)});
}
