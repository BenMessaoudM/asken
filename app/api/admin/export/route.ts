import {getDb} from "@/db";
import {bookingRequests,collaborations,contentItems,dataRequests,formSubmissions,publicDocuments} from "@/db/schema";
import {requireAdminRole} from "@/lib/admin";
import {writeAudit} from "@/lib/audit";

export const dynamic="force-dynamic";

function csv(rows:Record<string,unknown>[]){
  if(!rows.length)return"";
  const keys=Object.keys(rows[0]!);
  const cell=(value:unknown)=>`"${String(value??"").replaceAll('"','""')}"`;
  return[keys.map(cell).join(","),...rows.map(row=>keys.map(key=>cell(row[key])).join(","))].join("\n");
}

export async function GET(request:Request){
  const auth=await requireAdminRole(["super_admin","admin"]);
  if(!auth)return Response.json({error:"Forbidden"},{status:403});
  const type=new URL(request.url).searchParams.get("type")||"bookings",db=getDb();
  let rows:Record<string,unknown>[]=[];
  if(type==="bookings")rows=await db.select({reference:bookingRequests.reference,status:bookingRequests.status,bookerType:bookingRequests.bookerType,organizationName:bookingRequests.organizationName,contactName:bookingRequests.contactName,contactEmail:bookingRequests.contactEmail,contactPhone:bookingRequests.contactPhone,startsAt:bookingRequests.startsAt,endsAt:bookingRequests.endsAt,resources:bookingRequests.resources,estimatedPriceCents:bookingRequests.estimatedPriceCents,finalPriceCents:bookingRequests.finalPriceCents,depositCents:bookingRequests.depositCents,amountPaidCents:bookingRequests.amountPaidCents,invoiceStatus:bookingRequests.invoiceStatus,contractStatus:bookingRequests.contractStatus,cleaningStatus:bookingRequests.cleaningStatus,cleaningFeeCents:bookingRequests.cleaningFeeCents,damageChargeCents:bookingRequests.damageChargeCents,createdAt:bookingRequests.createdAt}).from(bookingRequests);
  else if(type==="content")rows=await db.select().from(contentItems);
  else if(type==="collaborations")rows=await db.select().from(collaborations);
  else if(type==="documents")rows=await db.select().from(publicDocuments);
  else if(type==="cases")rows=[...await db.select().from(formSubmissions),...await db.select().from(dataRequests)];
  else return Response.json({error:"Unknown export type"},{status:400});
  await writeAudit(auth.user.email,"export",type,"all",{count:rows.length});
  return new Response(`\uFEFF${csv(rows)}`,{headers:{"content-type":"text/csv; charset=utf-8","content-disposition":`attachment; filename=ask-${type}-${new Date().toISOString().slice(0,10)}.csv`,"cache-control":"private, no-store"}});
}
