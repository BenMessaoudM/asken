import { and, asc, eq, gt, lt } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { bookingSettings, themeSchedules } from "@/db/schema";
import { requireAdminRole } from "@/lib/admin";
import { writeAudit } from "@/lib/audit";
import { DEFAULT_BOOKING_POLICY } from "@/lib/booking";

export const dynamic = "force-dynamic";

const policySchema = z.object({
  externalFirstHours:z.number().int().min(1).max(24), externalFirstHourlyCents:z.number().int().min(0), externalAfterHourlyCents:z.number().int().min(0), externalKitchenCents:z.number().int().min(0), saunaPerDateCents:z.number().int().min(0), associationWeekendCents:z.number().int().min(0), associationPackage3Cents:z.number().int().min(0), associationPackage5Cents:z.number().int().min(0), associationPackage10Cents:z.number().int().min(0), internalFreeBookings:z.number().int().min(0).max(20), maxBookingHours:z.number().int().min(1).max(24), maxAdvanceMonths:z.number().int().min(1).max(36), maxDatesPerRequest:z.number().int().min(1).max(10), hallCapacity:z.number().int().min(1).max(500), kitchenCapacity:z.number().int().min(1).max(100), saunaCapacity:z.number().int().min(1).max(100), cleaningFeeCents:z.number().int().min(0),
});
const themeSchema=z.object({id:z.string().optional(),name:z.string().min(1).max(100),theme:z.enum(["default","gulis","christmas","new_year","vappu","midsummer","halloween","pride","independence","swedish_day"]),startsAt:z.string().min(1),endsAt:z.string().min(1),active:z.boolean().default(true)});

export async function GET(){const auth=await requireAdminRole(["super_admin","admin"]);if(!auth)return Response.json({error:"Forbidden"},{status:403});const [policyRows,themes]=await Promise.all([getDb().select().from(bookingSettings).limit(1),getDb().select().from(themeSchedules).orderBy(asc(themeSchedules.startsAt))]);return Response.json({policy:policyRows[0]||DEFAULT_BOOKING_POLICY,themes});}

export async function PUT(request:Request){const auth=await requireAdminRole(["super_admin","admin"]);if(!auth)return Response.json({error:"Forbidden"},{status:403});const policy=policySchema.parse(await request.json());const values={id:"default",...policy,updatedBy:auth.user.email,updatedAt:new Date().toISOString()};const [row]=await getDb().insert(bookingSettings).values(values).onConflictDoUpdate({target:bookingSettings.id,set:values}).returning();await writeAudit(auth.user.email,"update","booking_settings","default");return Response.json({policy:row});}

export async function POST(request:Request){const auth=await requireAdminRole(["super_admin","admin"]);if(!auth)return Response.json({error:"Forbidden"},{status:403});const item=themeSchema.parse(await request.json());if(new Date(item.endsAt)<=new Date(item.startsAt))return Response.json({error:"End must be after start"},{status:400});const id=item.id||crypto.randomUUID();const overlap=await getDb().select({id:themeSchedules.id}).from(themeSchedules).where(and(eq(themeSchedules.active,true),lt(themeSchedules.startsAt,item.endsAt),gt(themeSchedules.endsAt,item.startsAt))).limit(1);if(overlap.length&&overlap[0]!.id!==id)return Response.json({error:"An active theme already covers part of this period."},{status:409});const values={...item,id,updatedBy:auth.user.email,updatedAt:new Date().toISOString()};const [row]=await getDb().insert(themeSchedules).values(values).onConflictDoUpdate({target:themeSchedules.id,set:values}).returning();await writeAudit(auth.user.email,"upsert","theme_schedule",id,{theme:item.theme});return Response.json({item:row},{status:201});}

export async function DELETE(request:Request){const auth=await requireAdminRole(["super_admin","admin"]);if(!auth)return Response.json({error:"Forbidden"},{status:403});const {id}=z.object({id:z.string()}).parse(await request.json());await getDb().delete(themeSchedules).where(eq(themeSchedules.id,id));await writeAudit(auth.user.email,"delete","theme_schedule",id);return Response.json({ok:true});}
