"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import type { PublicLanguage } from "@/lib/public-pages";

const nav={
  sv:[
    {label:"Om ASK",items:[["Om oss","/om-ask"],["Historia","/historia"],["Styrelse & personal","/styrelse-och-personal"],["Kontakt","/kontakt"]]},
    {label:"För studerande",items:[["Medlemskap","/medlemskap"],["Studentkort","/studentkort"],["Förmåner","/formaner"],["Stöd","/stod"],["Tutorer","/tutorer"],["Utbytesstuderande","/utbytesstuderande"],["Stöd vid trakasserier","/trakasserier"]]},
    {label:"Påverka",items:[["Organisation","/organisation"],["Fullmäktige","/fullmaktige"],["Studeranderepresentanter","/studeranderepresentanter"],["Utskott & kommittéer","/utskott-och-kommitteer"],["Funktionärer","/funktionarer"],["Dokument","/dokument"]]},
    {label:"Aktuellt",items:[["Nyheter","/nyheter"],["Evenemang","/evenemang"],["Rekrytering","/rekrytering"]]},
    {label:"Cor-huset",items:[["Live & boka","/cor-huset"],["Lokaler & vägbeskrivning","/cor-lokaler"],["Regler & priser","/cor-regler"]]},
    {label:"Samarbeten",items:[["Föreningar & partner","/samarbeten"],["Partnerskap","/partnerskap"]]},
  ],
  en:[
    {label:"About",items:[["About ASK","/about"],["History","/history"],["Board & staff","/board-and-staff"],["Contact","/contact"]]},
    {label:"For students",items:[["Membership","/membership"],["Student card","/student-card"],["Benefits","/benefits"],["Support","/support"],["Tutoring","/tutoring"],["Exchange students","/exchange-students"],["Harassment support","/harassment-support"]]},
    {label:"Have an impact",items:[["Governance","/governance"],["The Council","/council"],["Student representatives","/student-representatives"],["Committees","/committees"],["Volunteers","/volunteers"],["Documents","/documents"]]},
    {label:"Latest",items:[["News","/news"],["Events","/events"],["Recruitment","/recruitment"]]},
    {label:"Cor House",items:[["Live & book","/cor"],["Spaces & directions","/cor-spaces"],["Rules & prices","/cor-rules"]]},
    {label:"Collaborate",items:[["Associations & partners","/collaborations"],["Partnerships","/partnerships"]]},
  ],
};

export default function PublicShell({lang,alternate,children}:{lang:PublicLanguage;alternate:string;children:ReactNode}){
  const[open,setOpen]=useState(false);
  const c=lang==="sv"?{union:"Arcada studerandekår",help:"Behöver du hjälp?",join:"Bli medlem",search:"Sök",privacy:"Dataskydd",cookies:"Kakor",terms:"Villkor",accessibility:"Tillgänglighet",contact:"Kontakt",admin:"Backoffice"}:{union:"Arcada Student Union",help:"Need help?",join:"Join ASK",search:"Search",privacy:"Data protection",cookies:"Cookies",terms:"Terms",accessibility:"Accessibility",contact:"Contact",admin:"Back office"};
  return <div className="site-shell"><a className="skip-link" href="#main-content">{lang==="sv"?"Hoppa till innehållet":"Skip to content"}</a><div className="site-top"><span>{c.union}</span><a href={lang==="sv"?"/stod":"/support"}>{c.help}</a></div><header className="site-header"><a className="site-brand" href={lang==="sv"?"/":"/en"}><img src="/ask-symbol-purple.png" alt="ASK"/><span>{c.union}</span></a><nav className={open?"is-open":""} aria-label={lang==="sv"?"Huvudnavigation":"Main navigation"}>{nav[lang].map(group=><div className="nav-group" key={group.label}><button type="button">{group.label}<ChevronDown/></button><div>{group.items.map(([label,href])=><a href={href} key={href} onClick={()=>setOpen(false)}>{label}</a>)}</div></div>)}</nav><div className="site-actions"><a className="search-link" href={lang==="sv"?"/sok":"/search"} aria-label={c.search}><Search/></a><a className="language-link" href={alternate} hrefLang={lang==="sv"?"en":"sv"}>{lang==="sv"?"EN":"SV"}</a><a className="pill compact" href="https://kide.app/community/b112ffe9-2deb-4894-a4b8-ed1b70ef1a00" target="_blank" rel="noreferrer">{c.join}</a><button className="site-menu" onClick={()=>setOpen(!open)} aria-expanded={open} aria-label="Menu">{open?<X/>:<Menu/>}</button></div></header><main id="main-content">{children}</main><footer className="site-footer"><div><img src="/ask-logo-white.png" alt="ASK – Arcada Student Union"/><p>Majstadsgatan 11<br/>00560 Helsinki</p><a href="mailto:info@asken.fi">info@asken.fi</a><a href="tel:+358404890367">+358 40 489 0367</a></div><div><h2>{lang==="sv"?"Snabblänkar":"Quick links"}</h2><a href={lang==="sv"?"/medlemskap":"/membership"}>{c.join}</a><a href={lang==="sv"?"/evenemang":"/events"}>{lang==="sv"?"Evenemang":"Events"}</a><a href={lang==="sv"?"/cor-huset":"/cor"}>Cor</a><a href={lang==="sv"?"/kontakt":"/contact"}>{c.contact}</a></div><div><h2>{lang==="sv"?"Juridiskt":"Legal"}</h2><a href={lang==="sv"?"/dataskydd":"/data-protection"}>{c.privacy}</a><a href={lang==="sv"?"/kakor":"/cookies"}>{c.cookies}</a><a href={lang==="sv"?"/villkor":"/terms"}>{c.terms}</a><a href={lang==="sv"?"/tillganglighet":"/accessibility"}>{c.accessibility}</a></div><div><h2>ASK</h2><a href="/admin">{c.admin}</a><a href={lang==="sv"?"/samarbeten":"/collaborations"}>{lang==="sv"?"Samarbeten":"Collaborations"}</a><a href={lang==="sv"?"/dokument":"/documents"}>{lang==="sv"?"Dokument":"Documents"}</a></div><small>© {new Date().getFullYear()} ASK · Arcada Student Union</small></footer></div>;
}
