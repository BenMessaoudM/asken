"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock, House, MapPin, Minus, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { helsinkiLocalToIso } from "@/lib/booking";
type Live = {
  id: string;
  type: string;
  titleSv: string;
  titleEn: string;
  descriptionSv: string;
  descriptionEn: string;
  startsAt: string | null;
  endsAt: string | null;
  space: string;
  collaborationName?: string;
  collaborationSlug?: string;
  brandColor?: string;
  tentative?: boolean;
  allDay?: boolean;
};
type Occurrence = {
  startsAt: string;
  endsAt: string;
  resources: string[];
};
type Busy = {
  startsAt: string;
  endsAt: string;
  resources: string[];
  reasonSv?: string;
  reasonEn?: string;
  associationSlug?: string;
  brandColor?: string;
  tentative?: boolean;
  allDay?: boolean;
};
type Policy = {
  externalFirstHours: number;
  externalFirstHourlyCents: number;
  externalAfterHourlyCents: number;
  externalKitchenCents: number;
  saunaPerDateCents: number;
  associationWeekendCents: number;
  associationPackage3Cents: number;
  associationPackage5Cents: number;
  associationPackage10Cents: number;
  internalFreeBookings: number;
  maxBookingHours: number;
  maxAdvanceMonths: number;
  maxDatesPerRequest: number;
  hallCapacity: number;
  kitchenCapacity: number;
  saunaCapacity: number;
  cleaningFeeCents: number;
};
const defaultPolicy: Policy = {
  externalFirstHours: 4,
  externalFirstHourlyCents: 5000,
  externalAfterHourlyCents: 3000,
  externalKitchenCents: 5000,
  saunaPerDateCents: 3000,
  associationWeekendCents: 7500,
  associationPackage3Cents: 21000,
  associationPackage5Cents: 32500,
  associationPackage10Cents: 60000,
  internalFreeBookings: 1,
  maxBookingHours: 18,
  maxAdvanceMonths: 18,
  maxDatesPerRequest: 10,
  hallCapacity: 80,
  kitchenCapacity: 8,
  saunaCapacity: 20,
  cleaningFeeCents: 15000
};
const copy = {
  sv: {
    back: "Till ASK",
    live: "Live från Cor",
    title: "Cor-huset",
    intro: "ASK:s studenthus för möten, fester, bastukvällar och gemenskap.",
    today: "Cor-kalender",
    empty: "Inga kommande bokningar eller offentliga programpunkter.",
    book: "Boka Cor",
    bookIntro: "Kontrollera upptagna tider och skicka en förfrågan. ASK bekräftar tillgänglighet, slutpris och eventuellt avtal.",
    contact: "Kontaktuppgifter",
    billing: "Faktureringsadress",
    details: "Datum och utrymmen",
    name: "Namn",
    org: "Organisation",
    email: "E-post",
    phone: "Telefon",
    billName: "Fakturamottagare",
    street: "Gatuadress",
    postal: "Postnummer",
    city: "Ort",
    country: "Land",
    type: "Typ av bokare",
    start: "Start",
    end: "Slut",
    purpose: "Ändamål",
    contract: "Avtalsspråk",
    privacy: "Jag har läst ASK:s integritetsmeddelande för Cor-bokningar.",
    privacyLink: "Läs integritetsmeddelandet",
    sensitive: "Skriv inte hälsouppgifter eller andra känsliga personuppgifter i ändamålsfältet.",
    send: "Skicka förfrågan",
    sent: "Förfrågan mottagen",
    estimate: "Preliminär prisuppskattning",
    track: "Följ din bokning",
    rules: "Kapacitet: sal 80, kök 8, kabinett och bastu 20. Varje datum bokas separat; kontinuerliga dygnsbokningar godkänns inte.",
    availability: "Upptagna tider – kommande 60 dagar",
    availableEmpty: "Inga upptagna tider är publicerade i perioden.",
    addDate: "Lägg till datum",
    remove: "Ta bort",
    member: "Medlems- eller studentnummer",
    package: "Föreningspaket",
    single: "Enskilda datum",
    packageHelp: "Paket kräver exakt 3, 5 eller 10 datum i samma förfrågan."
  },
  en: {
    back: "Back to ASK",
    live: "Live at Cor",
    title: "Cor House",
    intro: "ASK’s student house for meetings, parties, sauna evenings and community.",
    today: "Cor calendar",
    empty: "No upcoming bookings or public programme.",
    book: "Book Cor",
    bookIntro: "Check busy times and submit a request. ASK confirms availability, the final price and any required agreement.",
    contact: "Contact details",
    billing: "Billing address",
    details: "Dates and spaces",
    name: "Name",
    org: "Organisation",
    email: "Email",
    phone: "Phone",
    billName: "Invoice recipient",
    street: "Street address",
    postal: "Postal code",
    city: "City",
    country: "Country",
    type: "Booker type",
    start: "Start",
    end: "End",
    purpose: "Purpose",
    contract: "Agreement language",
    privacy: "I have read ASK’s privacy notice for Cor bookings.",
    privacyLink: "Read the privacy notice",
    sensitive: "Do not include health information or other sensitive personal data in the purpose field.",
    send: "Send request",
    sent: "Request received",
    estimate: "Preliminary price estimate",
    track: "Track your booking",
    rules: "Capacity: hall 80, kitchen 8, cabinet and sauna 20. Every date is booked separately; continuous 24-hour bookings are not accepted.",
    availability: "Busy times – next 60 days",
    availableEmpty: "No busy times are published in this period.",
    addDate: "Add date",
    remove: "Remove",
    member: "Membership or student number",
    package: "Association package",
    single: "Individual dates",
    packageHelp: "A package requires exactly 3, 5 or 10 dates in the same request."
  }
};
const emptyOccurrence = (): Occurrence => ({
  startsAt: "",
  endsAt: "",
  resources: ["hall"]
});
const initial = {
  bookerType: "external",
  organizationName: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  billingName: "",
  billingStreet: "",
  billingPostalCode: "",
  billingCity: "",
  billingCountry: "Finland",
  occurrences: [emptyOccurrence()],
  purposeSv: "",
  purposeEn: "",
  contractLanguage: "sv",
  memberNumber: "",
  packageSize: null as number | null,
  privacyAcknowledged: false,
  website: ""
};
export default function CorPlatform({
  lang
}: {
  lang: "sv" | "en";
}) {
  const t = copy[lang],
    [live, setLive] = useState<Live[]>([]),
    [busyTimes, setBusyTimes] = useState<Busy[]>([]),
    [policy, setPolicy] = useState<Policy>(defaultPolicy),
    [form, setForm] = useState({
      ...initial,
      contractLanguage: lang
    }),
    [result, setResult] = useState<{
      reference: string;
      statusUrl: string;
      estimatedPriceCents: number;
    } | null>(null),
    [error, setError] = useState(""),
    [sending, setSending] = useState(false);
  useEffect(() => {
    fetch("/api/public/live-cor").then(r => r.json()).then(d => setLive(d.items || [])).catch(() => {});
    fetch("/api/public/booking-settings").then(r => r.json()).then(d => d.policy && setPolicy(d.policy)).catch(() => {});
    const from = new Date(),
      to = new Date();
    to.setDate(to.getDate() + 60);
    fetch(`/api/bookings/availability?from=${encodeURIComponent(from.toISOString())}&to=${encodeURIComponent(to.toISOString())}`).then(r => r.json()).then(d => setBusyTimes(d.busy || [])).catch(() => {});
  }, []);
  const estimate = useMemo(() => {
    if (form.occurrences.some(o => !o.startsAt || !o.endsAt)) return null;
    if (form.bookerType === "arcada_association" && form.packageSize) {
      const base: {
        [key: number]: number;
      } = {
        3: policy.associationPackage3Cents,
        5: policy.associationPackage5Cents,
        10: policy.associationPackage10Cents
      };
      return ((base[form.packageSize] || 0) + form.occurrences.filter(o => o.resources.includes("cabinet_sauna")).length * policy.saunaPerDateCents) / 100;
    }
    return form.occurrences.reduce((total, o) => {
      const start = helsinkiLocalToIso(o.startsAt), end = helsinkiLocalToIso(o.endsAt);
      const hours = Math.max(policy.externalFirstHours, Math.ceil((+new Date(end || o.endsAt) - +new Date(start || o.startsAt)) / 36e5));
      let price = ["external", "external_member", "alumni"].includes(form.bookerType) ? Math.min(policy.externalFirstHours, hours) * policy.externalFirstHourlyCents + Math.max(0, hours - policy.externalFirstHours) * policy.externalAfterHourlyCents : 0;
      if (form.bookerType === "arcada_association" && [5, 6, 0].includes(new Date(`${o.startsAt.slice(0, 10)}T12:00:00Z`).getUTCDay())) price = policy.associationWeekendCents;
      if (o.resources.includes("kitchen") && form.bookerType !== "arcada_association") price += policy.externalKitchenCents;
      if (o.resources.includes("cabinet_sauna")) price += policy.saunaPerDateCents;
      return total + price;
    }, 0) / 100;
  }, [form, policy]);
  const set = (key: string, value: unknown) => setForm(current => ({
    ...current,
    [key]: value
  }));
  const updateOccurrence = (index: number, key: keyof Occurrence, value: unknown) => setForm(current => ({
    ...current,
    occurrences: current.occurrences.map((item, i) => i === index ? {
      ...item,
      [key]: value
    } : item)
  }));
  const toggle = (index: number, resource: string) => {
    const current = form.occurrences[index]!,
      resources = current.resources.includes(resource) ? current.resources.filter(x => x !== resource) : [...current.resources, resource];
    updateOccurrence(index, "resources", resources);
  };
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSending(true);
    setError("");
    const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...form, occurrences:form.occurrences.map((occurrence) => ({ ...occurrence, startsAt:helsinkiLocalToIso(occurrence.startsAt) || occurrence.startsAt, endsAt:helsinkiLocalToIso(occurrence.endsAt) || occurrence.endsAt })) })
      }),
      data = await response.json();
    setSending(false);
    if (!response.ok) return setError(data.error || "Could not submit");
    setResult(data);
  }
  const brandStyle = (color?:string) => ({ "--association-color": color || "#A32F8E" } as CSSProperties);
  return <main className="cor-page"><header><a href={lang === "sv" ? "/" : "/en"}><ArrowLeft />{t.back}</a><img src="/ask-logo-white.png" alt="ASK" /><div className="cor-head-links"><a href={lang === "sv" ? "/cor-regler" : "/cor-rules"}>{lang === "sv" ? "Regler & priser" : "Rules & prices"}</a><a href={lang === "sv" ? "/cor" : "/cor-huset"}>{lang === "sv" ? "EN" : "SV"}</a></div></header><section className="cor-hero"><div><span>{t.live}</span><h1>{t.title}</h1><p>{t.intro}</p></div><House /></section><section className="live-board"><div className="section-title"><span><span className="live-dot" />LIVE</span><h2>{t.today}</h2></div><div className="live-grid">{live.length ? live.map(item => <article className="cor-calendar-card" style={brandStyle(item.brandColor)} key={item.id}><span><i className="association-dot" />{item.collaborationName || (lang === "sv" ? "Bokning" : "Booking")}{item.tentative ? ` · ${lang === "sv" ? "preliminär" : "preliminary"}` : ""}</span><h3>{lang === "sv" ? item.titleSv : item.titleEn || item.titleSv}</h3><p>{lang === "sv" ? item.descriptionSv : item.descriptionEn || item.descriptionSv}</p><small><MapPin />{item.space || "Cor"}</small>{item.startsAt && <small><Clock />{new Date(item.startsAt).toLocaleString("fi-FI", {
              dateStyle: "short",
              timeStyle: "short",
              hour12: false,
              timeZone: "Europe/Helsinki"
            })}</small>}{item.collaborationName && <b>{lang === "sv" ? "I samarbete med" : "In collaboration with"} {item.collaborationName}</b>}</article>) : <div className="live-empty">{t.empty}</div>}</div></section><section className="availability-board"><div className="section-title"><span><CalendarDays />{t.availability}</span></div><div className="busy-list">{busyTimes.length ? busyTimes.slice(0, 60).map((item, i) => <article className="busy-card" style={brandStyle(item.brandColor)} key={`${item.startsAt}-${i}`}><b>{new Date(item.startsAt).toLocaleDateString("fi-FI", { timeZone:"Europe/Helsinki" })}</b><span>{item.allDay ? (lang === "sv" ? "Heldag" : "All day") : <>{new Date(item.startsAt).toLocaleTimeString("fi-FI", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
              timeZone: "Europe/Helsinki"
            })}–{new Date(item.endsAt).toLocaleTimeString("fi-FI", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
              timeZone: "Europe/Helsinki"
            })}</>}</span><small>{item.resources.map(r => r === "hall" ? lang === "sv" ? "Sal" : "Hall" : r === "kitchen" ? lang === "sv" ? "Kök" : "Kitchen" : lang === "sv" ? "Kabinett/bastu" : "Cabinet/sauna").join(", ")}</small>{(lang === "sv" ? item.reasonSv : item.reasonEn) && <em>{lang === "sv" ? item.reasonSv : item.reasonEn}</em>}</article>) : <p>{t.availableEmpty}</p>}</div></section><section className="booking-wrap"><aside><span>ASK · COR</span><h2>{t.book}</h2><p>{t.bookIntro}</p><div className="capacity"><span><Users /><b>{policy.hallCapacity}</b>{lang === "sv" ? "Sal" : "Hall"}</span><span><Users /><b>{policy.saunaCapacity}</b>{lang === "sv" ? "Bastu" : "Sauna"}</span><span><Users /><b>{policy.kitchenCapacity}</b>{lang === "sv" ? "Kök" : "Kitchen"}</span></div><small>{lang === "sv" ? `Max ${policy.maxBookingHours} timmar per datum och ${policy.maxDatesPerRequest} datum per förfrågan.` : `Maximum ${policy.maxBookingHours} hours per date and ${policy.maxDatesPerRequest} dates per request.`}</small></aside>{result ? <div className="booking-success"><CheckCircle2 /><h2>{t.sent}</h2><b>{result.reference}</b><p>{t.estimate}: {(result.estimatedPriceCents / 100).toFixed(2)} €</p><a className="pill" href={result.statusUrl}>{t.track}</a></div> : <form onSubmit={submit}><fieldset><legend>{t.contact}</legend><div><Label>{t.name}</Label><Input required value={form.contactName} onChange={e => set("contactName", e.target.value)} /></div><div><Label>{t.org}</Label><Input required={["external", "arcada_association"].includes(form.bookerType)} value={form.organizationName} onChange={e => set("organizationName", e.target.value)} /></div><div><Label>{t.email}</Label><Input type="email" required value={form.contactEmail} onChange={e => set("contactEmail", e.target.value)} /></div><div><Label>{t.phone}</Label><Input value={form.contactPhone} onChange={e => set("contactPhone", e.target.value)} /></div><div><Label>{t.type}</Label><Select value={form.bookerType} onValueChange={v => set("bookerType", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="internal_ask">Internal ASK</SelectItem><SelectItem value="arcada_association">Arcada association</SelectItem><SelectItem value="external">External</SelectItem><SelectItem value="external_member">External ASK member</SelectItem><SelectItem value="alumni">Alumni</SelectItem></SelectContent></Select></div><div><Label>{t.member}</Label><Input value={form.memberNumber} onChange={e => set("memberNumber", e.target.value)} /></div>{form.bookerType === "arcada_association" && <div className="full"><Label>{t.package}</Label><Select value={form.packageSize ? String(form.packageSize) : "single"} onValueChange={v => set("packageSize", v === "single" ? null : Number(v))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="single">{t.single}</SelectItem><SelectItem value="3">3 · {(policy.associationPackage3Cents / 100).toFixed(0)} €</SelectItem><SelectItem value="5">5 · {(policy.associationPackage5Cents / 100).toFixed(0)} €</SelectItem><SelectItem value="10">10 · {(policy.associationPackage10Cents / 100).toFixed(0)} €</SelectItem></SelectContent></Select><small>{t.packageHelp}</small></div>}</fieldset><fieldset><legend>{t.billing}</legend><div><Label>{t.billName}</Label><Input required value={form.billingName} onChange={e => set("billingName", e.target.value)} /></div><div><Label>{t.street}</Label><Input required value={form.billingStreet} onChange={e => set("billingStreet", e.target.value)} /></div><div><Label>{t.postal}</Label><Input required value={form.billingPostalCode} onChange={e => set("billingPostalCode", e.target.value)} /></div><div><Label>{t.city}</Label><Input required value={form.billingCity} onChange={e => set("billingCity", e.target.value)} /></div><div className="full"><Label>{t.country}</Label><Input required value={form.billingCountry} onChange={e => set("billingCountry", e.target.value)} /></div></fieldset><fieldset><legend>{t.details}</legend>{form.occurrences.map((occ, index) => <section className="date-entry full" key={index}><header><b>{lang === "sv" ? "Datum" : "Date"} {index + 1}</b>{index > 0 && <button type="button" onClick={() => set("occurrences", form.occurrences.filter((_, i) => i !== index))}><Minus />{t.remove}</button>}</header><div className="date-fields"><div><Label>{t.start}</Label><Input required type="datetime-local" value={occ.startsAt} onChange={e => updateOccurrence(index, "startsAt", e.target.value)} /></div><div><Label>{t.end}</Label><Input required type="datetime-local" value={occ.endsAt} onChange={e => updateOccurrence(index, "endsAt", e.target.value)} /></div></div><div className="resource-list">{[["hall", lang === "sv" ? "Sal" : "Hall"], ["kitchen", lang === "sv" ? "Kök" : "Kitchen"], ["cabinet_sauna", lang === "sv" ? "Kabinett och bastu" : "Cabinet and sauna"]].map(([value, label]) => <label key={value}><Checkbox checked={occ.resources.includes(value)} onCheckedChange={() => toggle(index, value)} />{label}</label>)}</div></section>)}<div className="full"><Button type="button" variant="outline" disabled={form.occurrences.length >= policy.maxDatesPerRequest} onClick={() => set("occurrences", [...form.occurrences, emptyOccurrence()])}><Plus />{t.addDate}</Button></div><div className="full"><Label>{t.purpose}</Label><Textarea value={lang === "sv" ? form.purposeSv : form.purposeEn} onChange={e => set(lang === "sv" ? "purposeSv" : "purposeEn", e.target.value)} /><small className="sensitive-note">{t.sensitive}</small></div><div className="full"><Label>{t.contract}</Label><Select value={form.contractLanguage} onValueChange={v => set("contractLanguage", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="sv">Svenska</SelectItem><SelectItem value="en">English</SelectItem><SelectItem value="fi">Suomi</SelectItem></SelectContent></Select></div></fieldset><div className="form-honeypot"><Input tabIndex={-1} value={form.website} onChange={e => set("website", e.target.value)} /></div><div className="privacy-check"><label className="privacy"><Checkbox required checked={form.privacyAcknowledged} onCheckedChange={value => set("privacyAcknowledged", value === true)} />{t.privacy}</label><a href={lang === "sv" ? "/integritet" : "/privacy"} target="_blank">{t.privacyLink}</a></div>{estimate !== null && <div className="estimate">{t.estimate}: <b>{estimate.toFixed(2)} €</b></div>}{error && <p className="form-error" role="alert">{error}</p>}<Button size="lg" type="submit" disabled={sending}>{sending ? "…" : t.send}</Button></form>}</section></main>;
}
