declare module "cloudflare:workers" {
  export const env: any;
}

interface Fetcher { fetch(request: Request): Promise<Response> }
interface D1Database {}
interface R2Object { key:string;size:number;uploaded:Date;httpEtag:string }
interface R2ObjectBody extends R2Object { body:ReadableStream;writeHttpMetadata(headers:Headers):void }
interface R2Objects { objects:R2Object[] }
interface R2Bucket {
  list(options?:{limit?:number;prefix?:string}):Promise<R2Objects>;
  get(key:string):Promise<R2ObjectBody|null>;
  put(key:string,value:ReadableStream|ArrayBuffer|string,options?:Record<string,unknown>):Promise<R2Object>;
  delete(key:string):Promise<void>;
}
