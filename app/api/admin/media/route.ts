import {env} from "cloudflare:workers";
import {requireAdminRole} from "@/lib/admin";
import {writeAudit} from "@/lib/audit";
import {getDb} from "@/db";
import {bookingEvidence,contentItems,publicDocuments} from "@/db/schema";
import {eq} from "drizzle-orm";

export const dynamic="force-dynamic";
const allowed=new Set(["image/jpeg","image/png","image/webp","image/gif","application/pdf"]);
const extensions:Record<string,string>={"image/jpeg":"jpg","image/png":"png","image/webp":"webp","image/gif":"gif","application/pdf":"pdf"};
function bucket(){return(env as unknown as{UPLOADS:R2Bucket}).UPLOADS}
const auth=()=>requireAdminRole(["super_admin","admin","editor"]);

export async function GET(){
  const user=await auth();if(!user)return Response.json({error:"Forbidden"},{status:403});
  const list=await bucket().list({limit:200});
  return Response.json({items:list.objects.map(item=>({key:item.key,size:item.size,uploaded:item.uploaded,url:`/api/media/${encodeURIComponent(item.key)}`}))});
}
export async function POST(request:Request){
  const user=await auth();if(!user)return Response.json({error:"Forbidden"},{status:403});
  const data=await request.formData(),file=data.get("file");
  if(!(file instanceof File))return Response.json({error:"Missing file"},{status:400});
  if(!allowed.has(file.type))return Response.json({error:"Only JPG, PNG, WebP, GIF and PDF files are allowed."},{status:415});
  if(file.size>12*1024*1024)return Response.json({error:"The file must be no larger than 12 MB."},{status:413});
  const safeBase=file.name.replace(/\.[^.]+$/,"").toLowerCase().replace(/[^a-z0-9-]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"file";
  const key=`${new Date().toISOString().slice(0,10)}/${crypto.randomUUID()}-${safeBase}.${extensions[file.type]}`;
  await bucket().put(key,file.stream(),{httpMetadata:{contentType:file.type,cacheControl:"public, max-age=31536000, immutable"},customMetadata:{originalName:file.name,uploadedBy:user.user.email}});
  await writeAudit(user.user.email,"upload","media",key,{size:file.size,type:file.type});
  return Response.json({key,url:`/api/media/${encodeURIComponent(key)}`,name:file.name},{status:201});
}
export async function DELETE(request:Request){
  const user=await auth();if(!user)return Response.json({error:"Forbidden"},{status:403});
  const{key}=await request.json() as{key?:string};if(!key||key.includes(".."))return Response.json({error:"Invalid key"},{status:400});
  const url=`/api/media/${encodeURIComponent(key)}`,db=getDb();const[content,document,evidence]=await Promise.all([db.select({id:contentItems.id}).from(contentItems).where(eq(contentItems.imageUrl,url)).limit(1),db.select({id:publicDocuments.id}).from(publicDocuments).where(eq(publicDocuments.fileUrl,url)).limit(1),db.select({id:bookingEvidence.id}).from(bookingEvidence).where(eq(bookingEvidence.fileUrl,url)).limit(1)]);if(content.length||document.length||evidence.length)return Response.json({error:"This file is still used by published or operational content."},{status:409});
  await bucket().delete(key);await writeAudit(user.user.email,"delete","media",key);return Response.json({ok:true});
}
