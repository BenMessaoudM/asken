import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicInfoPage from "@/components/public-info-page";
import { publicPages } from "@/lib/public-pages";

export const dynamic="force-dynamic";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const{slug}=await params;const page=publicPages[slug];if(!page)return{};return{title:`${page.title} | ASK`,description:page.lead,alternates:{canonical:`/${slug}`,languages:{[page.lang]:`/${slug}`,[page.lang==="sv"?"en":"sv"]:page.alternate}}}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const page=publicPages[slug];if(!page)notFound();return <PublicInfoPage page={page} slug={slug}/>}
