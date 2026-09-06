"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Blocks, BookOpenCheck, Building2, CalendarClock, ClipboardList, FileArchive, Globe2, History, House, Inbox, Link2, Plus, RefreshCw, Save, ShieldCheck, Trash2, Upload, Users } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isoToHelsinkiLocalInput } from "@/lib/booking";
type Collab = {
  id: string;
  slug: string;
  name: string;
  type: string;
  shortDescriptionSv: string;
  shortDescriptionEn: string;
  descriptionSv: string;
  descriptionEn: string;
  websiteUrl: string;
  logoUrl: string;
  brandColor: string;
  contactName: string;
  contactEmail: string;
  agreementStartsAt: string | null;
  agreementEndsAt: string | null;
  approvalStatus: string;
  internalNotes: string;
  active: boolean;
  visible: boolean;
  featured: boolean;
};
type Occurrence = {
  id: string;
  startsAt: string;
  endsAt: string;
  resources: string[];
  status: string;
};
type Booking = {
  id: string;
  reference: string;
  status: string;
  bookerType: string;
  organizationName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  startsAt: string;
  endsAt: string;
  resources: string;
  occurrences: Occurrence[];
  estimatedPriceCents: number | null;
  finalPriceCents: number | null;
  depositCents: number;
  amountPaidCents: number;
  invoiceStatus: string;
  contractLanguage: string;
  contractStatus: string;
  memberVerified: boolean;
  associationVerified: boolean;
  cleaningStatus: string;
  cleaningFeeCents: number;
  damageChargeCents: number;
  doorCode: string;
  internalNotes: string;
  deletedAt: string | null;
};
type Live = {
  id: string;
  type: string;
  titleSv: string;
  titleEn: string;
  descriptionSv: string;
  descriptionEn: string;
  collaborationId: string | null;
  startsAt: string | null;
  endsAt: string | null;
  space: string;
  active: boolean;
  visiblePublicly: boolean;
};
type Event = {
  id: string;
  titleSv: string;
  titleEn: string;
};
type Block = {
  id: string;
  startsAt: string;
  endsAt: string;
  resources: string[];
  reasonSv: string;
  reasonEn: string;
  active: boolean;
};
type Document = {
  id: string;
  slug: string;
  category: string;
  titleSv: string;
  titleEn: string;
  descriptionSv: string;
  descriptionEn: string;
  fileUrl: string;
  meetingDate: string | null;
  language: string;
  status: string;
};
type Case = {
  id: string;
  reference: string;
  type: string;
  name: string;
  email: string;
  message?: string;
  details?: string;
  status: string;
  createdAt: string;
};
type Audit = {
  id: number;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
};
type Admin = {
  id: number;
  email: string;
  displayName: string;
  role: string;
  active: boolean;
};
type Media = {
  key: string;
  url: string;
  size: number;
  uploaded: string;
};
type CorCalendarEvent = {
  id: string;
  titleSv: string;
  titleEn: string;
  associationSlug: string | null;
  brandColor: string;
  startsAt: string;
  endsAt: string;
  resources: string[];
  tentative: boolean;
  active: boolean;
};
type Data = {
  collaborations: Collab[];
  liveCor: Live[];
  corCalendar: CorCalendarEvent[];
  bookings: Booking[];
  events: Event[];
  eventCollaborations: {
    id: number;
    eventId: string;
    collaborationId: string;
    role: string;
    visiblePublicly: boolean;
  }[];
  bookingBlocks: Block[];
  documents: Document[];
  dataRequests: Case[];
  formSubmissions: Case[];
  auditLogs: Audit[];
  admins: Admin[];
  currentAdmin?: Admin;
};
type CollabForm = Omit<Collab, "id"> & {
  id?: string;
};
type LiveForm = Omit<Live, "id"> & {
  id?: string;
};
type BlockForm = Omit<Block, "id"> & {
  id?: string;
};
type DocumentForm = Omit<Document, "id"> & {
  id?: string;
};
type AdminForm = Omit<Admin, "id"> & {
  id?: number;
};
const emptyData: Data = {
  collaborations: [],
  liveCor: [],
  corCalendar: [],
  bookings: [],
  events: [],
  eventCollaborations: [],
  bookingBlocks: [],
  documents: [],
  dataRequests: [],
  formSubmissions: [],
  auditLogs: [],
  admins: []
};
const blankC: CollabForm = {
  slug: "",
  name: "",
  type: "partner",
  shortDescriptionSv: "",
  shortDescriptionEn: "",
  descriptionSv: "",
  descriptionEn: "",
  websiteUrl: "",
  logoUrl: "",
  brandColor: "#A32F8E",
  contactName: "",
  contactEmail: "",
  agreementStartsAt: null,
  agreementEndsAt: null,
  approvalStatus: "draft",
  internalNotes: "",
  active: true,
  visible: true,
  featured: false
};
const blankL: LiveForm = {
  type: "status",
  titleSv: "",
  titleEn: "",
  descriptionSv: "",
  descriptionEn: "",
  collaborationId: null,
  startsAt: null,
  endsAt: null,
  space: "Cor",
  active: true,
  visiblePublicly: false
};
const blankB: BlockForm = {
  startsAt: "",
  endsAt: "",
  resources: ["hall"],
  reasonSv: "",
  reasonEn: "",
  active: true
};
const blankD: DocumentForm = {
  slug: "",
  category: "other",
  titleSv: "",
  titleEn: "",
  descriptionSv: "",
  descriptionEn: "",
  fileUrl: "",
  meetingDate: null,
  language: "sv",
  status: "draft"
};
const blankA: AdminForm = {
  email: "",
  displayName: "",
  role: "editor",
  active: true
};
const tx = {
  sv: {
    title: "Plattform",
    content: "Innehåll",
    site: "Visa webbplats",
    bookings: "Bokningar",
    blocks: "Spärrtider",
    collabs: "Samarbeten",
    docs: "Dokument",
    inbox: "Ärenden",
    live: "Live på Cor",
    audit: "Aktivitetslogg",
    admins: "Administratörer",
    media: "Media",
    save: "Spara",
    new: "Ny",
    no: "Inga poster ännu",
    upload: "Ladda upp",
    import: "Importera ASK:s grundkatalog"
  },
  en: {
    title: "Platform",
    content: "Content",
    site: "View website",
    bookings: "Bookings",
    blocks: "Blocked times",
    collabs: "Collaborations",
    docs: "Documents",
    inbox: "Inbox",
    live: "Live at Cor",
    audit: "Activity log",
    admins: "Administrators",
    media: "Media",
    save: "Save",
    new: "New",
    no: "No items yet",
    upload: "Upload",
    import: "Import ASK defaults"
  }
};
const cents = (value: number | null | undefined) => ((value || 0) / 100).toFixed(2),
  toCents = (value: string) => Math.round((Number(value) || 0) * 100);
export default function PlatformDashboard({
  user
}: {
  user: {
    displayName: string;
    email: string;
  };
}) {
  const [lang, setLang] = useState<"sv" | "en">("sv"),
    [data, setData] = useState<Data>(emptyData),
    [media, setMedia] = useState<Media[]>([]),
    [collab, setCollab] = useState<CollabForm>(blankC),
    [live, setLive] = useState<LiveForm>(blankL),
    [booking, setBooking] = useState<Booking | null>(null),
    [block, setBlock] = useState<BlockForm>(blankB),
    [document, setDocument] = useState<DocumentForm>(blankD),
    [admin, setAdmin] = useState<AdminForm>(blankA),
    [eventId, setEventId] = useState(""),
    [collaborationId, setCollaborationId] = useState("");
  const t = tx[lang];
  async function load() {
    const [r, m] = await Promise.all([fetch("/api/admin/platform"), fetch("/api/admin/media")]);
    const d = await r.json();
    if (r.ok) setData(d);else toast.error(d.error || "Error");
    if (m.ok) setMedia((await m.json()).items || []);
  }
  useEffect(() => {
    load();
  }, []);
  async function send(entity: string, value: unknown, method = "POST") {
    const r = await fetch("/api/admin/platform", {
        method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          entity,
          data: value
        })
      }),
      d = await r.json();
    if (!r.ok) {
      toast.error(d.error || "Error");
      return false;
    }
    toast.success(t.save);
    await load();
    return true;
  }
  async function remove(entity: string, id: string) {
    if (!confirm(lang === "sv" ? "Ta bort posten?" : "Remove item?")) return;
    const response=await fetch("/api/admin/platform", {
      method: "DELETE",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        entity,
        id
      })
    });
    const result=await response.json();
    if(!response.ok)return toast.error(result.error||"Delete failed");
    toast.success(lang === "sv" ? "Posten togs bort." : "Item removed.");
    await load();
  }
  async function upload(file: File, target: "document" | "collab" | "media" = "media") {
    const fd = new FormData();
    fd.set("file", file);
    const r = await fetch("/api/admin/media", {
        method: "POST",
        body: fd
      }),
      d = await r.json();
    if (!r.ok) return toast.error(d.error || "Upload failed");
    if (target === "document") setDocument({
      ...document,
      fileUrl: d.url
    });
    if (target === "collab") setCollab({
      ...collab,
      logoUrl: d.url
    });
    toast.success(t.upload);
    await load();
  }
  async function importCalendar(file: File) {
    if (!file.name.toLowerCase().endsWith(".ics")) return toast.error(lang === "sv" ? "Välj en .ics-fil." : "Choose an .ics file.");
    const icalText = await file.text();
    await send("calendar_import", { icalText });
  }
  async function removeMedia(key: string) {
    if (!confirm(lang === "sv" ? "Radera filen permanent?" : "Delete this file permanently?")) return;
    const response = await fetch("/api/admin/media", { method:"DELETE", headers:{"content-type":"application/json"}, body:JSON.stringify({key}) });
    const result=await response.json();
    if (!response.ok) return toast.error(result.error||(lang === "sv" ? "Filen kunde inte raderas." : "The file could not be deleted."));
    toast.success(lang === "sv" ? "Filen raderades." : "File deleted.");
    await load();
  }
  const activeBookings = useMemo(() => data.bookings.filter(x => !x.deletedAt).sort((a, b) => Number(b.bookerType === "arcada_association") - Number(a.bookerType === "arcada_association") || b.startsAt.localeCompare(a.startsAt)), [data.bookings]);
  const inbox = [...data.formSubmissions, ...data.dataRequests].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return <div className="admin-shell"><aside className="admin-sidebar"><a href="/" className="admin-brand"><img src="/ask-logo-white.png" alt="ASK" /></a><nav><a href="/admin"><ArrowLeft />{t.content}</a><a className="active"><Building2 />{t.title}</a><a href="/cor-huset" target="_blank"><House />Cor</a></nav><div className="admin-user"><span>{user.displayName[0]}</span><div><b>{user.displayName}</b><small>{user.email}</small></div></div></aside><main className="admin-main platform-admin"><header><div><span>ASK Backoffice</span><h1>{t.title}</h1></div><div><Button variant="outline" onClick={() => setLang(lang === "sv" ? "en" : "sv")}>{lang === "sv" ? "EN" : "SV"}</Button><a href="/" target="_blank"><Globe2 />{t.site}</a><Button variant="outline" onClick={load}><RefreshCw /></Button></div></header><section className="ops-stats"><article><span>{t.bookings}</span><b>{activeBookings.length}</b><small>{activeBookings.filter(x => x.status === "pending").length} pending</small></article><article><span>{t.inbox}</span><b>{inbox.length}</b><small>{inbox.filter(x => ["new", "received"].includes(x.status)).length} new</small></article><article><span>{t.docs}</span><b>{data.documents.length}</b><small>{data.documents.filter(x => x.status === "published").length} public</small></article><article><span>{t.collabs}</span><b>{data.collaborations.length}</b><small>{data.collaborations.filter(x => x.type === "sponsor" && x.approvalStatus === "approved").length} sponsors</small></article></section><Tabs defaultValue="bookings"><TabsList className="platform-tabs"><TabsTrigger value="bookings"><ClipboardList />{t.bookings}</TabsTrigger><TabsTrigger value="blocks"><Blocks />{t.blocks}</TabsTrigger><TabsTrigger value="collabs"><Building2 />{t.collabs}</TabsTrigger><TabsTrigger value="docs"><FileArchive />{t.docs}</TabsTrigger><TabsTrigger value="inbox"><Inbox />{t.inbox}</TabsTrigger><TabsTrigger value="live"><CalendarClock />{t.live}</TabsTrigger><TabsTrigger value="media"><Upload />{t.media}</TabsTrigger><TabsTrigger value="audit"><History />{t.audit}</TabsTrigger>{data.currentAdmin?.role === "super_admin" && <TabsTrigger value="admins"><Users />{t.admins}</TabsTrigger>}</TabsList>

 <TabsContent value="bookings"><div className="platform-grid"><section className="booking-admin-list">{activeBookings.length ? activeBookings.map(item => <button className={booking?.id === item.id ? "selected" : ""} key={item.id} onClick={() => setBooking(item)}><b>{item.reference}</b><span>{item.contactName} · {item.organizationName || item.bookerType}</span><small>{new Date(item.startsAt).toLocaleString("fi-FI", {
                    dateStyle: "short",
                    timeStyle: "short",
                    hour12: false
                  })} · {item.status}</small></button>) : <div className="admin-empty">{t.no}</div>}</section>{booking ? <section className="platform-form booking-editor"><div className="form-title"><h2><BookOpenCheck />{booking.reference}</h2><Button variant="ghost" size="icon" onClick={() => remove("booking", booking.id)}><Trash2 /></Button></div><p>{booking.contactName} · <a href={`mailto:${booking.contactEmail}`}>{booking.contactEmail}</a> · {booking.contactPhone}</p><div className="occurrence-admin">{booking.occurrences.map(o => <span key={o.id}><b>{new Date(o.startsAt).toLocaleString("fi-FI", {
                      dateStyle: "short",
                      timeStyle: "short",
                      hour12: false
                    })}</b>{o.resources.join(", ")}</span>)}</div><div className="editor-grid"><div><Label>Status</Label><Select value={booking.status} onValueChange={v => setBooking({
                    ...booking,
                    status: v
                  })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["pending", "quoted", "approved", "contract_sent", "signed", "cancelled"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div><div><Label>Final price (€)</Label><Input type="number" step="0.01" value={cents(booking.finalPriceCents)} onChange={e => setBooking({
                    ...booking,
                    finalPriceCents: toCents(e.target.value)
                  })} /></div><div><Label>Deposit (€)</Label><Input type="number" step="0.01" value={cents(booking.depositCents)} onChange={e => setBooking({
                    ...booking,
                    depositCents: toCents(e.target.value)
                  })} /></div><div><Label>Paid (€)</Label><Input type="number" step="0.01" value={cents(booking.amountPaidCents)} onChange={e => setBooking({
                    ...booking,
                    amountPaidCents: toCents(e.target.value)
                  })} /></div><div><Label>Invoice</Label><Select value={booking.invoiceStatus} onValueChange={v => setBooking({
                    ...booking,
                    invoiceStatus: v
                  })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["not_required", "draft", "sent", "paid", "overdue", "credited"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div><div><Label>Agreement</Label><Select value={booking.contractStatus} onValueChange={v => setBooking({
                    ...booking,
                    contractStatus: v
                  })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["not_required", "draft", "sent", "signed", "declined"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div><div><Label>Language</Label><Select value={booking.contractLanguage} onValueChange={v => setBooking({
                    ...booking,
                    contractLanguage: v
                  })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="sv">Svenska</SelectItem><SelectItem value="en">English</SelectItem><SelectItem value="fi">Suomi</SelectItem></SelectContent></Select></div><div><Label>Cleaning</Label><Select value={booking.cleaningStatus} onValueChange={v => setBooking({
                    ...booking,
                    cleaningStatus: v
                  })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["not_checked", "approved", "needs_cleaning", "disputed"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div><div><Label>Cleaning fee (€)</Label><Input type="number" step="0.01" value={cents(booking.cleaningFeeCents)} onChange={e => setBooking({
                    ...booking,
                    cleaningFeeCents: toCents(e.target.value)
                  })} /></div><div><Label>Damage (€)</Label><Input type="number" step="0.01" value={cents(booking.damageChargeCents)} onChange={e => setBooking({
                    ...booking,
                    damageChargeCents: toCents(e.target.value)
                  })} /></div><div><Label>Door code</Label><Input value={booking.doorCode} disabled={booking.contractStatus !== "signed"} onChange={e => setBooking({
                    ...booking,
                    doorCode: e.target.value
                  })} /></div><label><Checkbox checked={booking.memberVerified} onCheckedChange={v => setBooking({
                    ...booking,
                    memberVerified: v === true
                  })} />Member verified</label><label><Checkbox checked={booking.associationVerified} onCheckedChange={v => setBooking({
                    ...booking,
                    associationVerified: v === true
                  })} />Association verified</label><div className="full"><Label>Internal notes</Label><Textarea value={booking.internalNotes} onChange={e => setBooking({
                    ...booking,
                    internalNotes: e.target.value
                  })} /></div></div><Button onClick={() => send("booking", booking, "PATCH")}><Save />{t.save}</Button></section> : <section className="platform-placeholder">{lang === "sv" ? "Välj en bokning för att öppna hela arbetsflödet." : "Select a booking to open its full workflow."}</section>}</div></TabsContent>

 <TabsContent value="blocks"><div className="platform-grid"><section className="platform-form"><h2><Plus />{t.new} {t.blocks.toLowerCase()}</h2><div className="editor-grid"><div><Label>Start</Label><Input type="datetime-local" value={isoToHelsinkiLocalInput(block.startsAt)} onChange={e => setBlock({
                    ...block,
                    startsAt: e.target.value
                  })} /></div><div><Label>End</Label><Input type="datetime-local" value={isoToHelsinkiLocalInput(block.endsAt)} onChange={e => setBlock({
                    ...block,
                    endsAt: e.target.value
                  })} /></div><div className="full resource-list">{["hall", "kitchen", "cabinet_sauna"].map(x => <label key={x}><Checkbox checked={block.resources.includes(x)} onCheckedChange={() => setBlock({
                      ...block,
                      resources: block.resources.includes(x) ? block.resources.filter((r: string) => r !== x) : [...block.resources, x]
                    })} />{x}</label>)}</div><div><Label>Svenska</Label><Textarea value={block.reasonSv} onChange={e => setBlock({
                    ...block,
                    reasonSv: e.target.value
                  })} /></div><div><Label>English</Label><Textarea value={block.reasonEn} onChange={e => setBlock({
                    ...block,
                    reasonEn: e.target.value
                  })} /></div><label><Switch checked={block.active} onCheckedChange={v => setBlock({
                    ...block,
                    active: v
                  })} />Active</label></div><Button onClick={async () => {
                if (await send("booking_block", block, block.id ? "PATCH" : "POST")) setBlock(blankB);
              }}><Save />{t.save}</Button></section><section className="platform-list">{data.bookingBlocks.map(x => <div className="list-row" key={x.id}><button onClick={() => setBlock({
                  ...x,
                  startsAt: isoToHelsinkiLocalInput(x.startsAt),
                  endsAt: isoToHelsinkiLocalInput(x.endsAt)
                })}><b>{new Date(x.startsAt).toLocaleString("fi-FI", {
                      dateStyle: "short",
                      timeStyle: "short",
                      hour12: false,
                      timeZone: "Europe/Helsinki"
                    })}</b><span>{x.resources.join(", ")} · {x.reasonSv || x.reasonEn}</span></button><Button variant="ghost" size="icon" onClick={() => remove("booking_block", x.id)}><Trash2 /></Button></div>)}</section></div></TabsContent>

 <TabsContent value="collabs"><div className="platform-grid"><section className="platform-form"><div className="form-title"><h2><Building2 />{collab.id ? collab.name : `${t.new} ${t.collabs.toLowerCase()}`}</h2><Button variant="outline" onClick={() => send("import_defaults", {})}>{t.import}</Button></div><div className="editor-grid"><div><Label>Slug</Label><Input value={collab.slug} onChange={e => setCollab({
                    ...collab,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")
                  })} /></div><div><Label>Name</Label><Input value={collab.name} onChange={e => setCollab({
                    ...collab,
                    name: e.target.value
                  })} /></div><div><Label>Type</Label><Select value={collab.type} onValueChange={v => setCollab({
                    ...collab,
                    type: v
                  })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["association", "sponsor", "company", "partner", "alumni"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div><div><Label>Approval</Label><Select value={collab.approvalStatus} onValueChange={v => setCollab({
                    ...collab,
                    approvalStatus: v
                  })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["draft", "approved", "expired"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div><div><Label>Website</Label><Input value={collab.websiteUrl} onChange={e => setCollab({
                    ...collab,
                    websiteUrl: e.target.value
                  })} /></div><div><Label>Logo URL</Label><Input value={collab.logoUrl} onChange={e => setCollab({
                    ...collab,
                    logoUrl: e.target.value
                  })} /><Input className="mt-2" type="file" accept="image/*" onChange={e => e.target.files?.[0] && upload(e.target.files[0], "collab")} /></div><div className="brand-color-field"><Label>Event colour</Label><Input type="color" value={collab.brandColor} onChange={e => setCollab({ ...collab, brandColor:e.target.value })} /><Input value={collab.brandColor} onChange={e => setCollab({ ...collab, brandColor:e.target.value })} /></div><div><Label>Contact name</Label><Input value={collab.contactName} onChange={e => setCollab({
                    ...collab,
                    contactName: e.target.value
                  })} /></div><div><Label>Contact email</Label><Input type="email" value={collab.contactEmail} onChange={e => setCollab({
                    ...collab,
                    contactEmail: e.target.value
                  })} /></div><div><Label>Starts</Label><Input type="date" value={collab.agreementStartsAt?.slice(0, 10) || ""} onChange={e => setCollab({
                    ...collab,
                    agreementStartsAt: e.target.value || null
                  })} /></div><div><Label>Ends</Label><Input type="date" value={collab.agreementEndsAt?.slice(0, 10) || ""} onChange={e => setCollab({
                    ...collab,
                    agreementEndsAt: e.target.value || null
                  })} /></div><div><Label>Svenska</Label><Input placeholder="Kort beskrivning" value={collab.shortDescriptionSv} onChange={e => setCollab({
                    ...collab,
                    shortDescriptionSv: e.target.value
                  })} /><Textarea value={collab.descriptionSv} onChange={e => setCollab({
                    ...collab,
                    descriptionSv: e.target.value
                  })} /></div><div><Label>English</Label><Input placeholder="Short description" value={collab.shortDescriptionEn} onChange={e => setCollab({
                    ...collab,
                    shortDescriptionEn: e.target.value
                  })} /><Textarea value={collab.descriptionEn} onChange={e => setCollab({
                    ...collab,
                    descriptionEn: e.target.value
                  })} /></div><div className="full"><Label>Internal notes</Label><Textarea value={collab.internalNotes} onChange={e => setCollab({
                    ...collab,
                    internalNotes: e.target.value
                  })} /></div><label><Switch checked={collab.active} onCheckedChange={v => setCollab({
                    ...collab,
                    active: v
                  })} />Active</label><label><Switch checked={collab.visible} onCheckedChange={v => setCollab({
                    ...collab,
                    visible: v
                  })} />Public</label><label><Switch checked={collab.featured} onCheckedChange={v => setCollab({
                    ...collab,
                    featured: v
                  })} />Featured</label></div><Button onClick={async () => {
                if (await send("collaboration", collab, collab.id ? "PATCH" : "POST")) setCollab(blankC);
              }}><Save />{t.save}</Button></section><section className="platform-list">{data.collaborations.map(x => <div className="list-row" key={x.id}><button onClick={() => setCollab(x)}><b>{x.name}</b><span>{x.type} · {x.approvalStatus} · {x.visible ? "public" : "private"}</span></button><Button variant="ghost" size="icon" onClick={() => remove("collaboration", x.id)}><Trash2 /></Button></div>)}</section></div><section className="platform-form event-linker"><h2><Link2 />Event collaboration</h2><Select value={eventId} onValueChange={setEventId}><SelectTrigger><SelectValue placeholder="Event" /></SelectTrigger><SelectContent>{data.events.map(e => <SelectItem key={e.id} value={e.id}>{lang === "sv" ? e.titleSv : e.titleEn || e.titleSv}</SelectItem>)}</SelectContent></Select><Select value={collaborationId} onValueChange={setCollaborationId}><SelectTrigger><SelectValue placeholder={t.collabs} /></SelectTrigger><SelectContent>{data.collaborations.map(x => <SelectItem key={x.id} value={x.id}>{x.name}</SelectItem>)}</SelectContent></Select><Button disabled={!eventId || !collaborationId} onClick={() => send("event_collaboration", {
              eventId,
              collaborationId,
              role: "partner",
              visiblePublicly: true
            })}><Plus />{t.save}</Button></section></TabsContent>

 <TabsContent value="docs"><div className="platform-grid"><section className="platform-form"><h2><FileArchive />{document.id ? document.titleSv : `${t.new} ${t.docs.toLowerCase()}`}</h2><div className="editor-grid"><div><Label>Slug</Label><Input value={document.slug} onChange={e => setDocument({
                    ...document,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")
                  })} /></div><div><Label>Category</Label><Select value={document.category} onValueChange={v => setDocument({
                    ...document,
                    category: v
                  })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["council_agenda", "council_minutes", "bylaws", "regulation", "policy", "form", "annual_report", "other"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div><div><Label>Title · SV</Label><Input value={document.titleSv} onChange={e => setDocument({
                    ...document,
                    titleSv: e.target.value
                  })} /><Textarea value={document.descriptionSv} onChange={e => setDocument({
                    ...document,
                    descriptionSv: e.target.value
                  })} /></div><div><Label>Title · EN</Label><Input value={document.titleEn} onChange={e => setDocument({
                    ...document,
                    titleEn: e.target.value
                  })} /><Textarea value={document.descriptionEn} onChange={e => setDocument({
                    ...document,
                    descriptionEn: e.target.value
                  })} /></div><div><Label>Meeting date</Label><Input type="date" value={document.meetingDate?.slice(0, 10) || ""} onChange={e => setDocument({
                    ...document,
                    meetingDate: e.target.value || null
                  })} /></div><div><Label>Document language</Label><Input value={document.language} onChange={e => setDocument({
                    ...document,
                    language: e.target.value
                  })} /></div><div><Label>File URL</Label><Input value={document.fileUrl} onChange={e => setDocument({
                    ...document,
                    fileUrl: e.target.value
                  })} /></div><div><Label>{t.upload}</Label><Input type="file" accept="application/pdf" onChange={e => e.target.files?.[0] && upload(e.target.files[0], "document")} /></div><div><Label>Status</Label><Select value={document.status} onValueChange={v => setDocument({
                    ...document,
                    status: v
                  })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">draft</SelectItem><SelectItem value="published">published</SelectItem></SelectContent></Select></div></div><Button onClick={async () => {
                if (await send("document", document, document.id ? "PATCH" : "POST")) setDocument(blankD);
              }}><Save />{t.save}</Button></section><section className="platform-list">{data.documents.map(x => <div className="list-row" key={x.id}><button onClick={() => setDocument(x)}><b>{x.titleSv}</b><span>{x.category} · {x.status}</span></button><Button variant="ghost" size="icon" onClick={() => remove("document", x.id)}><Trash2 /></Button></div>)}</section></div></TabsContent>

 <TabsContent value="inbox"><section className="case-list">{inbox.length ? inbox.map(item => <article key={item.id}><div><small>{item.type} · {new Date(item.createdAt).toLocaleString("fi-FI", {
                    dateStyle: "short",
                    timeStyle: "short",
                    hour12: false
                  })}</small><h3>{item.reference} · {item.name}</h3><a href={`mailto:${item.email}`}>{item.email}</a><p>{item.message || item.details}</p></div><Select value={item.status} onValueChange={v => send(item.message !== undefined ? "form_submission" : "data_request", {
                id: item.id,
                status: v
              }, "PATCH")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{(item.message !== undefined ? ["new", "in_progress", "answered", "closed"] : ["received", "verifying", "processing", "completed", "rejected"]).map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></article>) : <div className="admin-empty">{t.no}</div>}</section></TabsContent>

 <TabsContent value="live"><section className="calendar-import"><h3>{lang === "sv" ? "Importera Cor-kalender" : "Import Cor calendar"} · {data.corCalendar.length}</h3><p>{lang === "sv" ? "Ladda upp en Google Calendar .ics-export. Privata bokningar anonymiseras automatiskt; föreningsbokningar får föreningens färg." : "Upload a Google Calendar .ics export. Private bookings are anonymised automatically and association bookings receive the association colour."}</p><Input type="file" accept=".ics,text/calendar" onChange={e => e.target.files?.[0] && importCalendar(e.target.files[0])} /><div className="calendar-event-preview">{data.corCalendar.slice(0, 12).map(item => <span style={{ borderColor:item.brandColor }} key={item.id}><i style={{ background:item.brandColor }} /><b>{lang === "sv" ? item.titleSv : item.titleEn}</b>{new Date(item.startsAt).toLocaleString("fi-FI", { dateStyle:"short", timeStyle:"short", hour12:false, timeZone:"Europe/Helsinki" })}</span>)}</div></section><div className="platform-grid"><section className="platform-form"><h2><CalendarClock />{live.id ? live.titleSv : `${t.new} ${t.live.toLowerCase()}`}</h2><div className="editor-grid"><div><Label>Type</Label><Select value={live.type} onValueChange={v => setLive({
                    ...live,
                    type: v
                  })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["status", "office_hours", "presence", "public_event"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div><div><Label>Space</Label><Input value={live.space} onChange={e => setLive({
                    ...live,
                    space: e.target.value
                  })} /></div><div><Label>Svenska</Label><Input value={live.titleSv} onChange={e => setLive({
                    ...live,
                    titleSv: e.target.value
                  })} /><Textarea value={live.descriptionSv} onChange={e => setLive({
                    ...live,
                    descriptionSv: e.target.value
                  })} /></div><div><Label>English</Label><Input value={live.titleEn} onChange={e => setLive({
                    ...live,
                    titleEn: e.target.value
                  })} /><Textarea value={live.descriptionEn} onChange={e => setLive({
                    ...live,
                    descriptionEn: e.target.value
                  })} /></div><div><Label>Start</Label><Input type="datetime-local" value={isoToHelsinkiLocalInput(live.startsAt)} onChange={e => setLive({
                    ...live,
                    startsAt: e.target.value || null
                  })} /></div><div><Label>End</Label><Input type="datetime-local" value={isoToHelsinkiLocalInput(live.endsAt)} onChange={e => setLive({
                    ...live,
                    endsAt: e.target.value || null
                  })} /></div><div><Label>Collaboration</Label><Select value={live.collaborationId || "none"} onValueChange={v => setLive({
                    ...live,
                    collaborationId: v === "none" ? null : v
                  })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">—</SelectItem>{data.collaborations.map(x => <SelectItem key={x.id} value={x.id}>{x.name}</SelectItem>)}</SelectContent></Select></div><label><Switch checked={live.active} onCheckedChange={v => setLive({
                    ...live,
                    active: v
                  })} />Active</label><label><Switch checked={live.visiblePublicly} onCheckedChange={v => setLive({
                    ...live,
                    visiblePublicly: v
                  })} />Public</label></div><Button onClick={async () => {
                if (await send("live_cor", live, live.id ? "PATCH" : "POST")) setLive(blankL);
              }}><Save />{t.save}</Button></section><section className="platform-list">{data.liveCor.map(x => <div className="list-row" key={x.id}><button onClick={() => setLive(x)}><b>{lang === "sv" ? x.titleSv : x.titleEn || x.titleSv}</b><span>{x.type} · {x.visiblePublicly ? "public" : "private"}</span></button><Button variant="ghost" size="icon" onClick={() => remove("live_cor", x.id)}><Trash2 /></Button></div>)}</section></div></TabsContent>

 <TabsContent value="media"><section className="media-panel"><div className="media-upload"><Upload /><div><h2>{t.media}</h2><p>JPG, PNG, WebP, GIF or PDF · max 12 MB</p></div><Input type="file" accept="image/*,application/pdf" onChange={e => e.target.files?.[0] && upload(e.target.files[0])} /></div><div className="media-grid">{media.map(item => <article key={item.key}>{/\.(jpg|png|webp|gif)$/i.test(item.key) ? <img src={item.url} alt="" /> : <FileArchive />}<Input readOnly value={item.url} /><small>{(item.size / 1024).toFixed(0)} KB</small><Button variant="ghost" size="sm" onClick={() => removeMedia(item.key)}><Trash2 />{lang === "sv" ? "Radera" : "Delete"}</Button></article>)}</div></section></TabsContent>
 <TabsContent value="audit"><section className="audit-list">{data.auditLogs.map(item => <article key={item.id}><History /><div><b>{item.action} · {item.entityType}</b><span>{item.entityId}</span></div><small>{item.actorEmail}<br />{new Date(item.createdAt).toLocaleString("fi-FI", {
                  dateStyle: "short",
                  timeStyle: "short",
                  hour12: false
                })}</small></article>)}</section></TabsContent>
 <TabsContent value="admins"><div className="platform-grid"><section className="platform-form"><h2><ShieldCheck />{t.new} admin</h2><div className="editor-grid"><div><Label>Email</Label><Input type="email" value={admin.email} onChange={e => setAdmin({
                    ...admin,
                    email: e.target.value
                  })} /></div><div><Label>Name</Label><Input value={admin.displayName} onChange={e => setAdmin({
                    ...admin,
                    displayName: e.target.value
                  })} /></div><div><Label>Role</Label><Select value={admin.role} onValueChange={v => setAdmin({
                    ...admin,
                    role: v
                  })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["super_admin", "admin", "editor", "association_rep"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div><label><Switch checked={admin.active} onCheckedChange={v => setAdmin({
                    ...admin,
                    active: v
                  })} />Active</label></div><Button onClick={async () => {
                if (await send("admin", admin)) setAdmin(blankA);
              }}><Save />{t.save}</Button></section><section className="platform-list">{data.admins.map(x => <button key={x.id} onClick={() => setAdmin(x)}><b>{x.displayName}</b><span>{x.email} · {x.role} · {x.active ? "active" : "disabled"}</span></button>)}</section></div></TabsContent>
 </Tabs></main><Toaster richColors /></div>;
}
