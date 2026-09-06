"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Building2, CalendarDays, FileText, Globe2, History, LayoutDashboard, Newspaper, Plus, RotateCcw, Search, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { helsinkiLocalToIso, isoToHelsinkiLocalInput } from "@/lib/booking";
type Item = {
  id: string;
  type: string;
  slug: string;
  status: string;
  reviewStatus: string;
  publishAt: string | null;
  titleSv: string;
  titleEn: string;
  summarySv: string;
  summaryEn: string;
  bodySv: string;
  bodyEn: string;
  startsAt: string | null;
  endsAt: string | null;
  location: string;
  ctaUrl: string;
  imageUrl: string;
  featured: boolean;
  sortOrder: number;
  updatedAt: string;
};
type Form = Omit<Item, "id" | "updatedAt" | "publishAt" | "startsAt" | "endsAt"> & {
  id?: string;
  publishAt: string;
  startsAt: string;
  endsAt: string;
};
type Revision = { id: number; version: number; actorEmail: string; createdAt: string };
const blank: Form = {
  type: "news",
  slug: "",
  status: "draft",
  reviewStatus: "editing",
  publishAt: "",
  titleSv: "",
  titleEn: "",
  summarySv: "",
  summaryEn: "",
  bodySv: "",
  bodyEn: "",
  startsAt: "",
  endsAt: "",
  location: "",
  ctaUrl: "",
  imageUrl: "",
  featured: false,
  sortOrder: 0
};
const types = ["all", "news", "event", "page", "person"];
const labels: Record<string, string> = {
  all: "Allt innehåll",
  news: "Nyheter",
  event: "Evenemang",
  page: "Sidor",
  person: "Personer"
};
const icons: Record<string, ReactNode> = {
  news: <Newspaper />,
  event: <CalendarDays />,
  page: <FileText />,
  person: <Users />
};
export default function AdminDashboard({
  user,
  role
}: {
  user: {
    displayName: string;
    email: string;
  };
  role: string;
}) {
  const [lang, setLang] = useState<"sv" | "en">("sv"),
    [items, setItems] = useState<Item[]>([]),
    [loading, setLoading] = useState(true),
    [filter, setFilter] = useState("all"),
    [search, setSearch] = useState(""),
    [open, setOpen] = useState(false),
    [form, setForm] = useState<Form>(blank),
    [revisions, setRevisions] = useState<Revision[]>([]),
    [remove, setRemove] = useState<Item | null>(null);
  const text = lang === "sv" ? {
    overview: "Översikt",
    heading: "Innehåll",
    view: "Visa webbplats",
    create: "Skapa innehåll",
    published: "Publicerat",
    draft: "Utkast",
    scheduled: "Schemalagt",
    languages: "Språk",
    search: "Sök innehåll…",
    updated: "Uppdaterad",
    save: "Spara",
    cancel: "Avbryt",
    delete: "Radera",
    edit: "Redigera innehåll",
    new: "Skapa innehåll",
    description: "Svenska är källspråk. Engelska och fler språk kan läggas till utan att ändra strukturen."
  } : {
    overview: "Overview",
    heading: "Content",
    view: "View website",
    create: "Create content",
    published: "Published",
    draft: "Draft",
    scheduled: "Scheduled",
    languages: "Languages",
    search: "Search content…",
    updated: "Updated",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit content",
    new: "Create content",
    description: "Swedish is the source language. English and more languages can be added without changing the structure."
  };
  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/content");
    const d = await r.json();
    if (r.ok) setItems(d.items || []);else toast.error(d.error || "Kunde inte ladda innehåll");
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);
  const shown = useMemo(() => items.filter(i => (filter === "all" || i.type === filter) && `${i.titleSv} ${i.titleEn} ${i.slug}`.toLowerCase().includes(search.toLowerCase())), [items, filter, search]);
  async function loadRevisions(id: string) {
    const response = await fetch(`/api/admin/content?contentId=${encodeURIComponent(id)}`);
    const data = await response.json();
    if (response.ok) setRevisions(data.revisions || []);
  }
  function edit(i?: Item) {
    setRevisions([]);
    setForm(i ? {
      ...i,
      publishAt: isoToHelsinkiLocalInput(i.publishAt),
      startsAt: isoToHelsinkiLocalInput(i.startsAt),
      endsAt: isoToHelsinkiLocalInput(i.endsAt)
    } : {
      ...blank
    });
    setOpen(true);
    if (i) void loadRevisions(i.id);
  }
  async function restoreRevision(version: number) {
    if (!form.id || !window.confirm(lang === "sv" ? `Återställ version ${version} som ett nytt utkast?` : `Restore version ${version} as a new draft?`)) return;
    const response = await fetch("/api/admin/content", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ contentId: form.id, version }) });
    const data = await response.json();
    if (!response.ok) return toast.error(data.error || "Restore failed");
    const item = data.item as Item;
    setForm({ ...item, publishAt: isoToHelsinkiLocalInput(item.publishAt), startsAt: isoToHelsinkiLocalInput(item.startsAt), endsAt: isoToHelsinkiLocalInput(item.endsAt) });
    toast.success(lang === "sv" ? "Revisionen återställdes som utkast" : "Revision restored as a draft");
    await Promise.all([load(), loadRevisions(item.id)]);
  }
  async function save() {
    const r = await fetch("/api/admin/content", {
      method: form.id ? "PATCH" : "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        publishAt: helsinkiLocalToIso(form.publishAt),
        startsAt: helsinkiLocalToIso(form.startsAt),
        endsAt: helsinkiLocalToIso(form.endsAt),
        sortOrder: Number(form.sortOrder) || 0
      })
    });
    const d = await r.json();
    if (!r.ok) return toast.error(d.error || "Kunde inte spara");
    toast.success(form.id ? "Innehållet uppdaterades" : "Innehållet skapades");
    setOpen(false);
    load();
  }
  async function destroy() {
    if (!remove) return;
    const r = await fetch("/api/admin/content", {
      method: "DELETE",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        id: remove.id
      })
    });
    if (r.ok) {
      toast.success("Innehållet raderades");
      setRemove(null);
      load();
    } else toast.error("Kunde inte radera");
  }
  async function upload(file: File) {
    const data = new FormData();
    data.set("file", file);
    const r = await fetch("/api/admin/media", {
        method: "POST",
        body: data
      }),
      d = await r.json();
    if (!r.ok) return toast.error(d.error || "Upload failed");
    setForm(current => ({
      ...current,
      imageUrl: d.url
    }));
    toast.success(lang === "sv" ? "Filen laddades upp" : "File uploaded");
  }
  return <div className="admin-shell">
    <aside className="admin-sidebar"><a href="/" className="admin-brand"><img src="/ask-logo-white.png" alt="ASK" /></a><nav><a className="active"><LayoutDashboard />{text.overview}</a>{types.slice(1).map(x => <button key={x} onClick={() => setFilter(x)}>{icons[x]}{labels[x]}</button>)}<a href="/admin/platform"><Building2 />Platform</a></nav><div className="admin-user"><span>{user.displayName.slice(0, 1).toUpperCase()}</span><div><b>{user.displayName}</b><small>{user.email} · {role}</small></div></div></aside>
    <main className="admin-main"><header><div><span>ASK website</span><h1>{text.heading}</h1></div><div><Button variant="outline" onClick={() => setLang(lang === "sv" ? "en" : "sv")}>{lang === "sv" ? "EN" : "SV"}</Button><a href="/" target="_blank"><Globe2 />{text.view}</a><Button onClick={() => edit()}><Plus />{text.create}</Button></div></header>
      <section className="stats"><article><span>{text.published}</span><b>{items.filter(i => i.status === "published").length}</b><small>{lang === "sv" ? "Synligt på webbplatsen" : "Visible on the website"}</small></article><article><span>{text.draft}</span><b>{items.filter(i => i.status === "draft").length}</b><small>{lang === "sv" ? "Väntar på publicering" : "Awaiting publication"}</small></article><article><span>{text.scheduled}</span><b>{items.filter(i => i.status === "scheduled").length}</b><small>{lang === "sv" ? "Kommande innehåll" : "Upcoming content"}</small></article><article className="purple-stat"><span>{text.languages}</span><b>2+</b><small>{lang === "sv" ? "Svenska som huvudspråk" : "Swedish is the source language"}</small></article></section>
      <section className="content-panel"><div className="content-toolbar"><Tabs value={filter} onValueChange={setFilter}><TabsList>{types.slice(0, 5).map(x => <TabsTrigger key={x} value={x}>{labels[x]}</TabsTrigger>)}</TabsList></Tabs><div className="search-box"><Search /><Input placeholder="Sök innehåll…" value={search} onChange={e => setSearch(e.target.value)} /></div></div>
        <Table><TableHeader><TableRow><TableHead>{text.heading}</TableHead><TableHead>Type</TableHead><TableHead>Status / review</TableHead><TableHead>{text.updated}</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{loading ? <TableRow><TableCell colSpan={5}>…</TableCell></TableRow> : shown.length ? shown.map(i => <TableRow key={i.id} onClick={() => edit(i)} className="clickable"><TableCell><b>{lang === "sv" ? i.titleSv : i.titleEn || i.titleSv}</b><small>/{i.slug} · {i.titleEn ? "SV + EN" : "SV"}</small></TableCell><TableCell>{labels[i.type]}</TableCell><TableCell><Badge variant={i.status === "published" ? "default" : "secondary"}>{i.status}</Badge><small>{i.reviewStatus}</small></TableCell><TableCell>{new Date(i.updatedAt).toLocaleDateString("fi-FI")}</TableCell><TableCell><Button variant="ghost" size="icon" onClick={e => {
                  e.stopPropagation();
                  setRemove(i);
                }}><Trash2 /></Button></TableCell></TableRow>) : <TableRow><TableCell colSpan={5}><div className="admin-empty"><FileText /><b>{lang === "sv" ? "Inget innehåll här ännu" : "No content yet"}</b><Button onClick={() => edit()}><Plus />{text.create}</Button></div></TableCell></TableRow>}</TableBody></Table>
      </section>
    </main>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl"><DialogHeader><DialogTitle>{form.id ? text.edit : text.new}</DialogTitle><DialogDescription>{text.description} {lang === "sv" ? "Varje sparning skapar en revision." : "Every save creates a revision."}</DialogDescription></DialogHeader>
      <div className="editor-grid"><div><Label>Typ</Label><Select value={form.type} onValueChange={v => setForm({
              ...form,
              type: v
            })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{types.slice(1).map(x => <SelectItem value={x} key={x}>{labels[x]}</SelectItem>)}</SelectContent></Select></div><div><Label>Status</Label><Select value={form.status} onValueChange={v => setForm({
              ...form,
              status: v
            })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Utkast</SelectItem><SelectItem value="published">Publicerad</SelectItem><SelectItem value="scheduled">Schemalagd</SelectItem></SelectContent></Select></div>
        <div><Label>Review</Label><Select value={form.reviewStatus} onValueChange={v => setForm({
              ...form,
              reviewStatus: v
            })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="editing">editing</SelectItem><SelectItem value="ready">ready</SelectItem><SelectItem value="approved">approved</SelectItem></SelectContent></Select></div><div><Label>Featured</Label><Select value={form.featured ? "yes" : "no"} onValueChange={v => setForm({
              ...form,
              featured: v === "yes"
            })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="no">no</SelectItem><SelectItem value="yes">yes</SelectItem></SelectContent></Select></div><div className="full"><Label>Slug / URL</Label><Input value={form.slug} onChange={e => setForm({
              ...form,
              slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")
            })} placeholder="e.g. welcome-to-ask" /></div>{form.status === "scheduled" && <div className="full"><Label>Publish automatically</Label><Input type="datetime-local" value={form.publishAt} onChange={e => setForm({
              ...form,
              publishAt: e.target.value
            })} /></div>}<div><Label>Rubrik · Svenska</Label><Input value={form.titleSv} onChange={e => setForm({
              ...form,
              titleSv: e.target.value
            })} /></div><div><Label>Title · English</Label><Input value={form.titleEn} onChange={e => setForm({
              ...form,
              titleEn: e.target.value
            })} /></div><div><Label>Sammanfattning · Svenska</Label><Textarea value={form.summarySv} onChange={e => setForm({
              ...form,
              summarySv: e.target.value
            })} /></div><div><Label>Summary · English</Label><Textarea value={form.summaryEn} onChange={e => setForm({
              ...form,
              summaryEn: e.target.value
            })} /></div><div><Label>Innehåll · Svenska</Label><Textarea className="min-h-36" value={form.bodySv} onChange={e => setForm({
              ...form,
              bodySv: e.target.value
            })} /></div><div><Label>Content · English</Label><Textarea className="min-h-36" value={form.bodyEn} onChange={e => setForm({
              ...form,
              bodyEn: e.target.value
            })} /></div>
        {form.type === "event" && <><div><Label>Start</Label><Input type="datetime-local" value={form.startsAt} onChange={e => setForm({
                ...form,
                startsAt: e.target.value
              })} /></div><div><Label>End</Label><Input type="datetime-local" value={form.endsAt} onChange={e => setForm({
                ...form,
                endsAt: e.target.value
              })} /></div><div className="full"><Label>Location</Label><Input value={form.location} onChange={e => setForm({
                ...form,
                location: e.target.value
              })} /></div></>}<div><Label>CTA / ticket link</Label><Input value={form.ctaUrl} onChange={e => setForm({
              ...form,
              ctaUrl: e.target.value
            })} placeholder="https://…" /></div><div><Label>Sort order</Label><Input type="number" value={form.sortOrder} onChange={e => setForm({
              ...form,
              sortOrder: Number(e.target.value)
            })} /></div><div><Label>Image URL</Label><Input value={form.imageUrl} onChange={e => setForm({
              ...form,
              imageUrl: e.target.value
            })} /></div><div><Label>Upload image</Label><Input type="file" accept="image/*" onChange={e => e.target.files?.[0] && upload(e.target.files[0])} /></div>
      </div>{form.id && <section className="revision-panel"><h3><History />{lang === "sv" ? "Revisionshistorik" : "Revision history"}</h3>{revisions.length ? revisions.map((revision) => <div key={revision.id}><span><b>v{revision.version}</b><small>{new Date(revision.createdAt).toLocaleString("fi-FI")} · {revision.actorEmail}</small></span><Button type="button" variant="outline" size="sm" onClick={() => restoreRevision(revision.version)}><RotateCcw />{lang === "sv" ? "Återställ" : "Restore"}</Button></div>) : <small>{lang === "sv" ? "Ingen historik ännu." : "No history yet."}</small>}</section>}<DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>{text.cancel}</Button><Button onClick={save}>{text.save}</Button></DialogFooter></DialogContent></Dialog>
    <AlertDialog open={!!remove} onOpenChange={o => !o && setRemove(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Radera innehållet?</AlertDialogTitle><AlertDialogDescription>“{remove?.titleSv}” tas bort permanent. Åtgärden kan inte ångras.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Avbryt</AlertDialogCancel><AlertDialogAction onClick={destroy}>Radera</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog><Toaster richColors />
  </div>;
}
