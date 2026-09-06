"use client";
import {useMemo,useState} from "react";
import {MessageCircle,Send,X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import AskungenMark from "@/components/askungen-mark";

const englishPaths=["/en","/about","/history","/board-and-staff","/membership","/student-card","/benefits","/contact","/support","/tutoring","/exchange-students","/harassment-support","/recruitment","/governance","/council","/seniors-council","/committees","/student-representatives","/volunteers","/documents","/news","/events","/partnerships","/cor-rules","/data-protection","/cookies","/terms","/accessibility","/collaborations","/cor","/book-cor","/privacy","/search"];
type Message={from:"duck"|"user";text:string;href?:string;label?:string};
const knowledge={
 sv:[
  {keys:["medlem","studentkort","kide","förmån"],text:"Medlemskap och studentkort köps via ASK:s officiella Kide.app-sida. På medlemssidan hittar du steg och hjälp.",href:"/medlemskap",label:"Öppna medlemskap"},
  {keys:["boka","bokning","cor","bastu","kök","sal","pris"],text:"På Cor-husets sida kan du se liveinformation, regler, priser och skicka en bokningsförfrågan.",href:"/cor-huset",label:"Öppna Cor-huset"},
  {keys:["evenemang","event","biljett"],text:"Alla publicerade evenemang finns i evenemangsarkivet. Biljettlänken visas när ASK har lagt in den.",href:"/evenemang",label:"Se evenemang"},
  {keys:["stöd","hjälp","rättighet","problem","trakass","diskrimin"],text:"ASK kan hjälpa dig hitta rätt stöd och process. Vid omedelbar fara ska du ringa 112.",href:"/stod",label:"Öppna stöd"},
  {keys:["fullmäktige","påverka","representant","demokrati","organisation"],text:"På organisationssidorna hittar du Fullmäktige, representanter och offentliga dokument.",href:"/organisation",label:"Så fungerar ASK"},
  {keys:["förening","partner","sponsor","samarbete"],text:"ASK:s studentföreningar, bekräftade partner och eventuella godkända sponsorer finns i samarbetskatalogen.",href:"/samarbeten",label:"Visa samarbeten"},
  {keys:["integritet","gdpr","data","kakor","cookie"],text:"Dataskyddssidan beskriver behandling, lagring och dina rättigheter. Du kan också skicka en dataskyddsbegäran där.",href:"/dataskydd",label:"Läs om dataskydd"},
 ],
 en:[
  {keys:["member","student card","kide","benefit"],text:"Membership and the student card are purchased through ASK’s official Kide.app page. The membership page has the steps and support.",href:"/membership",label:"Open membership"},
  {keys:["book","booking","cor","sauna","kitchen","hall","price"],text:"The Cor House page has live information, rules, prices and the booking request form.",href:"/cor",label:"Open Cor House"},
  {keys:["event","ticket"],text:"All published events are in the events archive. A ticket link appears when ASK has added one.",href:"/events",label:"View events"},
  {keys:["support","help","right","problem","harass","discrimin"],text:"ASK can help identify the right support and process. In immediate danger, call 112.",href:"/support",label:"Open support"},
  {keys:["council","impact","representative","democracy","governance"],text:"The governance pages explain the Council, representatives and public documents.",href:"/governance",label:"How ASK works"},
  {keys:["association","partner","sponsor","collaborat"],text:"ASK’s student associations, confirmed partners and any approved sponsors are listed in the collaboration directory.",href:"/collaborations",label:"View collaborations"},
  {keys:["privacy","gdpr","data","cookie"],text:"The data protection page explains processing, retention and your rights. You can also submit a data request there.",href:"/data-protection",label:"Read data protection"},
 ],
};

export default function Askungen(){const[open,setOpen]=useState(false),[input,setInput]=useState(""),[messages,setMessages]=useState<Message[]>([]);const lang=useMemo<"sv"|"en">(()=>typeof location!=="undefined"&&englishPaths.some(path=>location.pathname===path||location.pathname.startsWith(`${path}/`))?"en":"sv",[]);const intro=lang==="sv"?"Hej! Jag är ASKungen. Jag hjälper dig hitta rätt på ASK:s webbplats. Frågan behandlas bara i din webbläsare och sparas inte av chatten.":"Hi! I’m ASKungen. I help you find the right place on ASK’s website. Your question is processed only in your browser and is not stored by this chat.";function ask(text:string){const normalized=text.toLowerCase();const hit=knowledge[lang].find(item=>item.keys.some(key=>normalized.includes(key)));const fallback=lang==="sv"?{text:"Jag hittade inget säkert svar i min kunskapsbas. Kontakta ASK så hjälper en person dig vidare.",href:"/kontakt",label:"Kontakta ASK"}:{text:"I could not find a reliable answer in my knowledge base. Contact ASK and a person will help you.",href:"/contact",label:"Contact ASK"};setMessages(current=>[...current,{from:"user",text},{from:"duck",...(hit||fallback)}]);setInput("")};return <div className="askungen-widget">{open&&<section role="dialog" aria-label="ASKungen" aria-modal="false"><header><AskungenMark compact/><div><b>ASKungen</b><small>{lang==="sv"?"Webbguide":"Website guide"}</small></div><button onClick={()=>setOpen(false)} aria-label={lang==="sv"?"Stäng":"Close"}><X/></button></header><div className="askungen-messages"><article className="duck">{intro}</article>{messages.map((m,i)=><article key={i} className={m.from}>{m.text}{m.href&&<a href={m.href}>{m.label} →</a>}</article>)}</div><div className="quick-questions">{(lang==="sv"?["Hur blir jag medlem?","Hur bokar jag Cor?","Jag behöver stöd"]:["How do I join?","How do I book Cor?","I need support"]).map(q=><button key={q} onClick={()=>ask(q)}>{q}</button>)}</div><form onSubmit={e=>{e.preventDefault();if(input.trim())ask(input.trim())}}><Input value={input} onChange={e=>setInput(e.target.value)} placeholder={lang==="sv"?"Skriv en fråga…":"Type a question…"}/><Button size="icon" aria-label={lang==="sv"?"Skicka":"Send"}><Send/></Button></form></section>}<button className="askungen-launch" onClick={()=>setOpen(!open)} aria-expanded={open}><AskungenMark compact/><b>{open?"×":"ASKungen"}</b><MessageCircle/></button></div>}
