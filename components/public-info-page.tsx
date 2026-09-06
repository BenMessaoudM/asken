import { ArrowRight } from "lucide-react";
import type { PublicPageDefinition } from "@/lib/public-pages";
import PublicShell from "@/components/public-shell";
import { PublicExtras } from "@/components/public-extras";
import CurrentCorRules from "@/components/current-cor-rules";

export default function PublicInfoPage({page,slug}:{page:PublicPageDefinition;slug:string}){
  const showCorRules=["cor-regler","cor-rules"].includes(slug);
  return (
    <PublicShell lang={page.lang} alternate={page.alternate}>
      <article className="info-page">
        <header className="info-hero"><span>{page.eyebrow}</span><h1>{page.title}</h1><p>{page.lead}</p></header>
        {showCorRules&&<CurrentCorRules lang={page.lang}/>}
        <div className="info-body">
          {page.sections.map((section,index)=><section key={`${section.title}-${index}`}><span className="section-number">{String(index+1).padStart(2,"0")}</span><div><h2>{section.title}</h2>{section.body?.map((paragraph,i)=><p key={i}>{paragraph}</p>)}{section.bullets&&<ul>{section.bullets.map(item=><li key={item}>{item}</li>)}</ul>}{section.links&&<div className="section-links">{section.links.map(link=><a href={link.href} key={link.href}>{link.label}<ArrowRight/></a>)}</div>}</div></section>)}
        </div>
        <PublicExtras lang={page.lang} kind={page.kind} formType={page.formType} councilOnly={["fullmaktige","council"].includes(slug)}/>
      </article>
    </PublicShell>
  );
}
