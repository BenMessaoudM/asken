import { asc, desc } from "drizzle-orm";
import { getDb } from "@/db";
import { collaborations } from "@/db/schema";
import { defaultCollaborations } from "@/lib/default-collaborations";
import { associationBrand, ASK_PURPLE, effectiveAssociationColor } from "@/lib/association-brand";
export const dynamic="force-dynamic";
type PublicCollaboration={id:string;slug:string;name:string;type:string;shortDescriptionSv:string;shortDescriptionEn:string;descriptionSv:string;descriptionEn:string;websiteUrl:string;logoUrl:string;brandColor:string;featured:boolean;active:boolean;visible:boolean;approvalStatus:string};
export async function GET(){
  try{
    const rows=await getDb().select({id:collaborations.id,slug:collaborations.slug,name:collaborations.name,type:collaborations.type,shortDescriptionSv:collaborations.shortDescriptionSv,shortDescriptionEn:collaborations.shortDescriptionEn,descriptionSv:collaborations.descriptionSv,descriptionEn:collaborations.descriptionEn,websiteUrl:collaborations.websiteUrl,logoUrl:collaborations.logoUrl,brandColor:collaborations.brandColor,featured:collaborations.featured,active:collaborations.active,visible:collaborations.visible,approvalStatus:collaborations.approvalStatus}).from(collaborations).orderBy(desc(collaborations.featured),asc(collaborations.name));
    const bySlug=new Map<string,PublicCollaboration>(defaultCollaborations.map(item=>[item.slug,{...item,brandColor:associationBrand(item.slug)?.color||ASK_PURPLE} as PublicCollaboration]));
    rows.forEach(item=>bySlug.set(item.slug,{...item,brandColor:effectiveAssociationColor(item.slug,item.brandColor)}));
    const items=[...bySlug.values()].filter(item=>item.active&&item.visible&&(item.type!=="sponsor"||item.approvalStatus==="approved")).sort((a,b)=>Number(b.featured)-Number(a.featured)||a.name.localeCompare(b.name));
    return Response.json({items},{headers:{"cache-control":"public, max-age=120"}});
  }catch{return Response.json({items:defaultCollaborations.map(item=>({...item,brandColor:associationBrand(item.slug)?.color||ASK_PURPLE}))})}
}
