import type {MetadataRoute} from "next";
import {and,eq,lte,or} from "drizzle-orm";
import {getDb} from "@/db";
import {contentItems} from "@/db/schema";
import {publicPages} from "@/lib/public-pages";
import {SITE_URL} from "@/lib/site";

const base=SITE_URL;

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
  const now=new Date();
  const staticPaths=["","en","cor-huset","cor","boka-cor","book-cor","integritet","privacy","samarbeten","collaborations","sok","search",...Object.keys(publicPages)];
  let dynamic:MetadataRoute.Sitemap=[];
  try{
    const items=await getDb().select({type:contentItems.type,slug:contentItems.slug,updatedAt:contentItems.updatedAt}).from(contentItems).where(and(eq(contentItems.reviewStatus,"approved"),or(eq(contentItems.status,"published"),and(eq(contentItems.status,"scheduled"),lte(contentItems.publishAt,now.toISOString())))));
    dynamic=items.filter(x=>x.type==="news"||x.type==="event").flatMap(x=>{
      const parents=x.type==="news"?["nyheter","news"]:["evenemang","events"];
      return parents.map(parent=>({url:`${base}/${parent}/${x.slug}`,lastModified:new Date(x.updatedAt),changeFrequency:"weekly" as const,priority:.6}));
    });
  }catch{}
  const fixed:MetadataRoute.Sitemap=[...new Set(staticPaths)].map(path=>({url:`${base}/${path}`,lastModified:now,changeFrequency:path?"monthly":"daily",priority:path?.length?0.7:1}));
  return [...fixed,...dynamic];
}
