import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { admins } from "@/db/schema";
import { getChatGPTUser } from "@/app/chatgpt-auth";

export async function requireAdmin(){
  const user=await getChatGPTUser();
  if(!user) return null;
  const db=getDb();
  const existing=await db.select().from(admins).where(eq(admins.email,user.email)).limit(1);
  if(existing[0]?.active) return {user,admin:existing[0]};
  const count=await db.select({value:sql<number>`count(*)`}).from(admins);
  if(Number(count[0]?.value||0)===0){
    const created=await db.insert(admins).values({email:user.email,displayName:user.displayName,role:"super_admin"}).returning();
    return {user,admin:created[0]};
  }
  return null;
}

export async function requireAdminRole(roles:(typeof admins.$inferSelect.role)[]){
  const auth=await requireAdmin();
  return auth&&roles.includes(auth.admin.role)?auth:null;
}
