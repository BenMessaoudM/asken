import { associationBrand, ASK_PURPLE } from "@/lib/association-brand";
import { helsinkiLocalToIso, type CorResource } from "@/lib/booking";

export type CorCalendarEventInput = {
  sourceUid: string;
  titleSv: string;
  titleEn: string;
  associationSlug: string | null;
  brandColor: string;
  startsAt: string;
  endsAt: string;
  resources: CorResource[];
  category: "association" | "ask" | "private";
  tentative: boolean;
  allDay: boolean;
  visiblePublicly: boolean;
  active: boolean;
  sourceUpdatedAt: string | null;
};

const unescapeIcal = (value: string) => value.replaceAll("\\n", "\n").replaceAll("\\,", ",").replaceAll("\\;", ";").replaceAll("\\\\", "\\").trim();

function field(block: string, name: string) {
  const match = block.match(new RegExp(`^${name}(?:;[^:]*)?:(.*)$`, "m"));
  return match ? unescapeIcal(match[1] || "") : "";
}

function parseIcalDate(value: string) {
  if (!value) return null;
  if (/^\d{8}T\d{6}Z$/.test(value)) {
    return new Date(`${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T${value.slice(9, 11)}:${value.slice(11, 13)}:${value.slice(13, 15)}Z`).toISOString();
  }
  const normalized = /^\d{8}(?:T\d{6})?$/.test(value)
    ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}${value.includes("T") ? `T${value.slice(9, 11)}:${value.slice(11, 13)}:${value.slice(13, 15)}` : ""}`
    : value;
  return helsinkiLocalToIso(normalized);
}

function resourcesFromLocation(location: string): CorResource[] {
  const normalized = location.toLocaleLowerCase("sv");
  const resources: CorResource[] = [];
  if (normalized.includes("salen") || normalized === "salen") resources.push("hall");
  if (normalized.includes("köket") || normalized.includes("koket")) resources.push("kitchen");
  if (normalized.includes("kabinet") || normalized.includes("bastu")) resources.push("cabinet_sauna");
  return resources.length ? resources : ["hall", "kitchen", "cabinet_sauna"];
}

function publicIdentity(summary: string) {
  const brand = associationBrand(summary);
  if (brand) return { titleSv: `${brand.name} på Cor`, titleEn: `${brand.name} at Cor`, associationSlug: brand.slug, brandColor: brand.color, category: "association" as const };
  if (/\bask\b/i.test(summary)) return { titleSv: "ASK-bokning", titleEn: "ASK booking", associationSlug: null, brandColor: ASK_PURPLE, category: "ask" as const };
  return { titleSv: "Privat bokning", titleEn: "Private booking", associationSlug: null, brandColor: "#6B6470", category: "private" as const };
}

export function parseCorCalendar(icalText: string): CorCalendarEventInput[] {
  const unfolded = icalText.replace(/\r?\n[ \t]/g, "");
  const events = [...unfolded.matchAll(/BEGIN:VEVENT\r?\n([\s\S]*?)END:VEVENT/g)];
  return events.flatMap((match) => {
    const block = match[1] || "";
    if (field(block, "STATUS").toUpperCase() === "CANCELLED") return [];
    const sourceUid = field(block, "UID");
    const rawStart = field(block, "DTSTART");
    const rawEnd = field(block, "DTEND");
    const startsAt = parseIcalDate(rawStart);
    const endsAt = parseIcalDate(rawEnd);
    if (!sourceUid || !startsAt || !endsAt || endsAt <= startsAt) return [];
    const summary = field(block, "SUMMARY");
    const identity = publicIdentity(summary);
    const tentative = /prelim|tentative/i.test(summary) || field(block, "STATUS").toUpperCase() === "TENTATIVE";
    return [{ sourceUid, ...identity, startsAt, endsAt, resources: resourcesFromLocation(field(block, "LOCATION")), tentative, allDay: /^\d{8}$/.test(rawStart), visiblePublicly: true, active: true, sourceUpdatedAt: parseIcalDate(field(block, "LAST-MODIFIED")) }];
  });
}

type SeedTuple = [string, string, string, string, CorResource[]];
const seed: SeedTuple[] = [
  ["seed-20260911-hanse", "2026-09-11T13:00:00.000Z", "2026-09-11T19:00:00.000Z", "HanSe", ["hall", "kitchen"]],
  ["seed-20260918-commedia", "2026-09-18T14:00:00.000Z", "2026-09-18T19:00:00.000Z", "Commedia", ["hall", "kitchen"]],
  ["seed-20260921-private", "2026-09-21T13:00:00.000Z", "2026-09-21T19:00:00.000Z", "Private", ["hall", "kitchen"]],
  ["seed-20260926-hosk", "2026-09-26T13:00:00.000Z", "2026-09-26T19:00:00.000Z", "HoSK", ["hall", "kitchen"]],
  ["seed-20261001-hanse", "2026-10-01T13:00:00.000Z", "2026-10-01T19:00:00.000Z", "HanSe", ["kitchen"]],
  ["seed-20261003-ask", "2026-10-03T13:00:00.000Z", "2026-10-03T23:00:00.000Z", "ASK", ["hall", "kitchen"]],
  ["seed-20261008-commedia", "2026-10-08T13:00:00.000Z", "2026-10-08T19:00:00.000Z", "Commedia", ["hall", "kitchen"]],
  ["seed-20261009-private", "2026-10-09T13:00:00.000Z", "2026-10-09T20:00:00.000Z", "Private", ["hall", "kitchen", "cabinet_sauna"]],
  ["seed-20261012-hanse", "2026-10-11T21:00:00.000Z", "2026-10-18T21:00:00.000Z", "HanSe", ["hall", "kitchen", "cabinet_sauna"]],
  ["seed-20261022-hosk", "2026-10-22T13:00:00.000Z", "2026-10-22T18:00:00.000Z", "HoSK", ["hall", "kitchen"]],
  ["seed-20261023-hosk", "2026-10-23T13:00:00.000Z", "2026-10-23T19:00:00.000Z", "HoSK", ["hall", "kitchen"]],
  ["seed-20261028-commedia", "2026-10-28T16:00:00.000Z", "2026-10-28T20:00:00.000Z", "Commedia", ["hall", "kitchen"]],
  ["seed-20261029-hanse", "2026-10-29T14:00:00.000Z", "2026-10-29T20:00:00.000Z", "HanSe", ["kitchen"]],
  ["seed-20261030-hanse", "2026-10-30T14:00:00.000Z", "2026-10-30T20:00:00.000Z", "HanSe", ["hall", "kitchen"]],
  ["seed-20261103-private", "2026-11-03T14:00:00.000Z", "2026-11-03T21:30:00.000Z", "Private preliminary", ["hall", "kitchen", "cabinet_sauna"]],
  ["seed-20261105-hanse", "2026-11-05T15:00:00.000Z", "2026-11-05T20:00:00.000Z", "HanSe", ["hall", "kitchen"]],
  ["seed-20261107-tlk", "2026-11-07T10:00:00.000Z", "2026-11-07T20:30:00.000Z", "TLK", ["hall", "kitchen"]],
  ["seed-20261109-kult", "2026-11-08T22:00:00.000Z", "2026-11-15T21:00:00.000Z", "Kult", ["hall", "kitchen", "cabinet_sauna"]],
  ["seed-20261119-tlk", "2026-11-19T15:00:00.000Z", "2026-11-19T20:00:00.000Z", "TLK", ["hall", "kitchen"]],
  ["seed-20261125-hosk", "2026-11-25T14:00:00.000Z", "2026-11-25T20:00:00.000Z", "HoSK", ["hall", "kitchen"]],
  ["seed-20261126-commedia", "2026-11-26T14:00:00.000Z", "2026-11-26T20:00:00.000Z", "Commedia", ["hall", "kitchen"]],
  ["seed-20261127-hanse", "2026-11-27T14:00:00.000Z", "2026-11-27T20:00:00.000Z", "HanSe", ["kitchen"]],
  ["seed-20261128-hanse", "2026-11-28T14:00:00.000Z", "2026-11-29T00:00:00.000Z", "HanSe", ["hall", "kitchen"]],
  ["seed-20261205-tlk", "2026-12-05T14:00:00.000Z", "2026-12-05T20:00:00.000Z", "TLK", ["hall", "kitchen"]],
  ["seed-20261216-tlk", "2026-12-16T14:00:00.000Z", "2026-12-16T20:00:00.000Z", "TLK preliminary", ["hall", "kitchen", "cabinet_sauna"]],
  ["seed-20261218-private", "2026-12-18T14:00:00.000Z", "2026-12-18T20:00:00.000Z", "Private preliminary", ["hall", "kitchen"]],
];

export const INITIAL_COR_CALENDAR: CorCalendarEventInput[] = seed.map(([sourceUid, startsAt, endsAt, summary, resources]) => ({
  sourceUid, startsAt, endsAt, resources, ...publicIdentity(summary), tentative: /prelim/i.test(summary),
  allDay: sourceUid === "seed-20261012-hanse", visiblePublicly: true, active: true,
  sourceUpdatedAt: "2026-09-06T14:06:27.000Z",
}));
