export const COR_RESOURCES = ["hall", "kitchen", "cabinet_sauna"] as const;
export type CorResource = (typeof COR_RESOURCES)[number];
export type BookerType = "internal_ask" | "arcada_association" | "external" | "external_member" | "alumni";

export type BookingPolicy = {
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

export const DEFAULT_BOOKING_POLICY: BookingPolicy = {
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
  cleaningFeeCents: 15000,
};

export type BookingOccurrenceInput = {
  startsAt: string;
  endsAt: string;
  resources: CorResource[];
};

export const ASSOCIATION_PACKAGES: Record<number, number> = {
  3: 21000,
  5: 32500,
  10: 60000,
};

export function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && aEnd > bStart;
}

export function sharesResource(a: readonly string[], b: readonly string[]) {
  return a.some((resource) => b.includes(resource));
}

export function helsinkiDateKey(date: Date) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Helsinki", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function validateOccurrence(value: BookingOccurrenceInput, policy: BookingPolicy = DEFAULT_BOOKING_POLICY) {
  const start = new Date(value.startsAt);
  const end = new Date(value.endsAt);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) {
    return "Invalid time range";
  }
  if (end.getTime() - start.getTime() > policy.maxBookingHours * 60 * 60 * 1000) {
    return `Cor cannot be booked continuously for more than ${policy.maxBookingHours} hours.`;
  }
  if (helsinkiDateKey(start) !== helsinkiDateKey(end)) {
    return "Each booking time must start and end on the same Helsinki calendar date.";
  }
  if (!value.resources.length) return "Choose at least one space.";
  return null;
}

export function estimateOccurrence(type: BookerType, start: Date, end: Date, resources: readonly string[], policy: BookingPolicy = DEFAULT_BOOKING_POLICY) {
  const actualHours = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 3600000));
  const chargedHours = Math.max(policy.externalFirstHours, actualHours);
  let price = 0;

  if (["external", "external_member", "alumni"].includes(type)) {
    price = Math.min(chargedHours, policy.externalFirstHours) * policy.externalFirstHourlyCents + Math.max(0, chargedHours - policy.externalFirstHours) * policy.externalAfterHourlyCents;
  }
  if (type === "arcada_association" && [5, 6, 0].includes(start.getDay())) price = policy.associationWeekendCents;
  if (resources.includes("kitchen") && type !== "arcada_association") price += policy.externalKitchenCents;
  if (resources.includes("cabinet_sauna")) price += policy.saunaPerDateCents;
  return price;
}

export function estimateBooking(type: BookerType, occurrences: BookingOccurrenceInput[], packageSize?: number | null, policy: BookingPolicy = DEFAULT_BOOKING_POLICY) {
  const packages: Record<number, number> = { 3: policy.associationPackage3Cents, 5: policy.associationPackage5Cents, 10: policy.associationPackage10Cents };
  if (type === "arcada_association" && packageSize && packages[packageSize]) {
    const saunaExtras = occurrences.filter((item) => item.resources.includes("cabinet_sauna")).length * policy.saunaPerDateCents;
    return packages[packageSize] + saunaExtras;
  }
  return occurrences.reduce((sum, item) => sum + estimateOccurrence(type, new Date(item.startsAt), new Date(item.endsAt), item.resources, policy), 0);
}

export function academicYearStart(date: Date) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Helsinki", year: "numeric", month: "2-digit" }).formatToParts(date).map((part) => [part.type, part.value]));
  const year = Number(parts.month) >= 8 ? Number(parts.year) : Number(parts.year) - 1;
  return new Date(Date.UTC(year, 6, 31, 21)).toISOString();
}

export function bookingRetentionDate(createdAt = new Date(), retentionClass: "request" | "operational" | "accounting" = "request") {
  const date = new Date(createdAt);
  if (retentionClass === "request") date.setUTCFullYear(date.getUTCFullYear() + 1);
  if (retentionClass === "operational") date.setUTCFullYear(date.getUTCFullYear() + 2);
  if (retentionClass === "accounting") {
    date.setUTCFullYear(date.getUTCFullYear() + 6);
    date.setUTCMonth(date.getUTCMonth() + 1);
  }
  return date.toISOString();
}

export function maxAdvanceDate(from: Date, months: number) {
  const date = new Date(from);
  const originalDay = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const endOfTargetMonth = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(originalDay, endOfTargetMonth));
  return date;
}

export function helsinkiLocalToIso(value?: string | null) {
  if (!value) return null;
  if (/[zZ]$|[+-]\d{2}:?\d{2}$/.test(value)) {
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date.toISOString() : null;
  }
  const match = value.match(/^(\d{4})-(?:(\d{2})-(\d{2})|(?:(\d{2})(\d{2})))(?:T?(\d{2}):?(\d{2}):?(\d{2})?)?$/);
  if (!match) return null;
  const [, year, dashedMonth, dashedDay, compactMonth, compactDay, hour = "00", minute = "00", second = "00"] = match;
  const month = dashedMonth || compactMonth;
  const day = dashedDay || compactDay;
  if (!month || !day) return null;
  const target = Date.UTC(+year!, +month - 1, +day, +hour, +minute, +second);
  let candidate = target;
  const formatter = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Helsinki", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
  for (let index = 0; index < 2; index += 1) {
    const parts = Object.fromEntries(formatter.formatToParts(new Date(candidate)).map((part) => [part.type, part.value]));
    const represented = Date.UTC(+parts.year!, +parts.month! - 1, +parts.day!, +parts.hour!, +parts.minute!, +parts.second!);
    candidate += target - represented;
  }
  return new Date(candidate).toISOString();
}

export function isoToHelsinkiLocalInput(value?: string | null) {
  if (!value) return "";
  if (!/[zZ]$|[+-]\d{2}:?\d{2}$/.test(value)) return value.slice(0, 16);
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Helsinki", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export async function hashBookingToken(token: string) {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
