import {env} from "cloudflare:workers";
export const dynamic="force-dynamic";
function bucket(){return(env as unknown as{UPLOADS:R2Bucket}).UPLOADS}
export async function GET(request:Request,{params}:{params:Promise<{key:string[]}>}){const{key}=await params,name=key.join("/");if(!name||name.includes(".."))return new Response("Not found",{status:404});const object=await bucket().get(name);if(!object)return new Response("Not found",{status:404});const headers=new Headers();object.writeHttpMetadata(headers);headers.set("etag",object.httpEtag);headers.set("x-content-type-options","nosniff");headers.set("content-security-policy","default-src 'none'; style-src 'unsafe-inline'; sandbox");return new Response(object.body,{headers})}
