import { and, eq } from "drizzle-orm";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { getDb } from "@/db";
import { bookingOccurrences, bookingRequests } from "@/db/schema";

export const dynamic = "force-dynamic";

const text = {
  sv: { title: "Bokningsavtal – Cor-huset", party: "Bokare", dates: "Bokningstider", spaces: "Utrymmen", billing: "Faktureringsadress", price: "Avtalat pris", terms: ["Bokaren ansvarar för deltagare, ordning, nycklar och att Cor-huset lämnas i avtalat skick.", "Avbokning hanteras enligt den bekräftelse som ASK har skickat. Skador och extra städning debiteras enligt faktisk kostnad; extra städning har en grundavgift på 150 euro.", "Dörrkod lämnas först när avtalet har undertecknats. Koden är personlig för bokningen och får inte spridas.", "Detta dokument undertecknas utanför webbplatsen och status registreras därefter av ASK."] },
  en: { title: "Booking agreement – Cor House", party: "Booker", dates: "Booking dates", spaces: "Spaces", billing: "Billing address", price: "Agreed price", terms: ["The booker is responsible for participants, order, keys and leaving Cor House in the agreed condition.", "Cancellation follows the confirmation issued by ASK. Damage and additional cleaning are charged at actual cost; additional cleaning has a base fee of EUR 150.", "The door code is issued only after signature. It is personal to the booking and must not be shared.", "This document is signed outside the website and ASK records the resulting status."] },
  fi: { title: "Varaussopimus – Cor-talo", party: "Varaaja", dates: "Varausajat", spaces: "Tilat", billing: "Laskutusosoite", price: "Sovittu hinta", terms: ["Varaaja vastaa osallistujista, järjestyksestä, avaimista ja tilan jättämisestä sovittuun kuntoon.", "Peruutukseen sovelletaan ASK:n lähettämää vahvistusta. Vahingot ja lisäsiivous veloitetaan todellisten kulujen mukaan; lisäsiivouksen perusmaksu on 150 euroa.", "Ovikoodi luovutetaan vasta allekirjoituksen jälkeen. Koodi on varauskohtainen eikä sitä saa jakaa.", "Tämä asiakirja allekirjoitetaan verkkosivuston ulkopuolella ja ASK kirjaa tilan sen jälkeen."] },
};

function drawWrapped(page: PDFPage, value: string, x: number, y: number, width: number, font: PDFFont, size = 10, lineHeight = 14) {
  const words = value.split(/\s+/); let line = ""; let cursor = y;
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > width && line) { page.drawText(line, { x, y: cursor, size, font }); cursor -= lineHeight; line = word; }
    else line = candidate;
  }
  if (line) { page.drawText(line, { x, y: cursor, size, font }); cursor -= lineHeight; }
  return cursor;
}

export async function GET(request: Request, { params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const token = new URL(request.url).searchParams.get("token") || "";
  const [booking] = await getDb().select().from(bookingRequests).where(and(eq(bookingRequests.reference, reference), eq(bookingRequests.statusToken, token))).limit(1);
  if (!booking || booking.deletedAt) return new Response("Not found", { status: 404 });
  if (booking.bookerType === "arcada_association" || booking.contractStatus === "not_required") return new Response("A separate contract is not required for verified Arcada associations.", { status: 409 });
  if (!["approved", "contract_sent", "signed"].includes(booking.status)) return new Response("The agreement becomes available after ASK has approved the booking.", { status: 409 });

  const occurrences = await getDb().select().from(bookingOccurrences).where(eq(bookingOccurrences.bookingId, booking.id));
  const language = text[booking.contractLanguage];
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  page.drawRectangle({ x: 0, y: 760, width: 595, height: 82, color: rgb(.64, .18, .56) });
  page.drawText("ASK", { x: 42, y: 791, size: 24, font: bold, color: rgb(1, 1, 1) });
  page.drawText(language.title, { x: 42, y: 725, size: 21, font: bold, color: rgb(.12, .08, .15) });
  let y = 684;
  const line = (label: string, value: string) => { page.drawText(label, { x: 42, y, size: 9, font: bold, color: rgb(.44, .13, .39) }); y -= 15; y = drawWrapped(page, value, 42, y, 505, font, 10, 14) - 15; };
  line("Reference", booking.reference);
  line(language.party, `${booking.contactName} · ${booking.organizationName || "–"} · ${booking.contactEmail}`);
  line(language.dates, (occurrences.length ? occurrences : [booking]).map((item) => `${new Date(item.startsAt).toLocaleString("sv-FI")} – ${new Date(item.endsAt).toLocaleString("sv-FI")}`).join("; "));
  line(language.spaces, [...new Set((occurrences.length ? occurrences : [booking]).flatMap((item) => JSON.parse(item.resources) as string[]))].join(", "));
  line(language.billing, `${booking.billingName}, ${booking.billingStreet}, ${booking.billingPostalCode} ${booking.billingCity}, ${booking.billingCountry}`);
  line(language.price, `${((booking.finalPriceCents ?? booking.estimatedPriceCents ?? 0) / 100).toFixed(2)} EUR`);
  page.drawText("Terms", { x: 42, y, size: 9, font: bold, color: rgb(.44, .13, .39) }); y -= 18;
  for (const [index, term] of language.terms.entries()) y = drawWrapped(page, `${index + 1}. ${term}`, 42, y, 505, font, 9.5, 13) - 7;
  y -= 20;
  page.drawLine({ start: { x: 42, y }, end: { x: 255, y }, thickness: 1, color: rgb(.3, .3, .3) });
  page.drawLine({ start: { x: 330, y }, end: { x: 545, y }, thickness: 1, color: rgb(.3, .3, .3) });
  page.drawText("Booker / Varaaja", { x: 42, y: y - 15, size: 8, font });
  page.drawText("ASK", { x: 330, y: y - 15, size: 8, font });
  page.drawText(`Privacy notice version ${booking.privacyNoticeVersion}`, { x: 42, y: 35, size: 7, font, color: rgb(.45, .45, .45) });
  const bytes = await pdf.save();
  const body=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength) as ArrayBuffer;
  return new Response(body, { headers: { "content-type": "application/pdf", "content-disposition": `inline; filename=${reference}.pdf`, "cache-control": "private, no-store" } });
}
