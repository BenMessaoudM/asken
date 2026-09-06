import type {MetadataRoute} from "next";
export default function robots():MetadataRoute.Robots{return{rules:{userAgent:"*",allow:"/",disallow:["/admin/","/api/admin/","/bokning/"]},sitemap:"https://ask-student-union.musse97.chatgpt.site/sitemap.xml"}}
