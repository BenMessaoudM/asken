import PDFDocument from 'pdfkit';
import { BillLanguage, BookingRecord, CorHouseBookingSettings } from './types';
import { formatDate, formatTime } from '../formatting/dateTime';

export const BILL_TEMPLATE_VERSION = '2026.1-arcada-association';
const euros = (value: number) => `${value.toFixed(2)} €`;
const labels = {
  sv: { title: 'Faktureringsunderlag', ref: 'Bokningsreferens', category: 'Bokarkategori', association: 'Förening', contact: 'Kontaktperson', billing: 'Faktureringsadress', vat: 'FO-/momsnummer', billingRef: 'Referens', resource: 'Utrymme', period: 'Datum och tid', purpose: 'Syfte', price: 'Prisspecifikation', total: 'Totalt', notes: 'Faktureringsanteckningar' },
  en: { title: 'Invoice basis', ref: 'Booking reference', category: 'Booker category', association: 'Association', contact: 'Contact person', billing: 'Billing address', vat: 'VAT / Business ID', billingRef: 'Reference', resource: 'Resource', period: 'Date and time', purpose: 'Purpose', price: 'Price breakdown', total: 'Total', notes: 'Billing notes' },
};

export function createBillPdf(booking: BookingRecord, language: BillLanguage, settings: CorHouseBookingSettings): Promise<Buffer> {
  const copy = labels[language];
  const billing = booking.billingAddress;
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 54, info: { Title: `${copy.title} ${booking.reference}`, Author: 'Arcada studerandekår - ASK' } });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    const heading = (value: string) => doc.moveDown(0.8).font('Helvetica-Bold').fontSize(13).text(value).moveDown(0.2);
    const row = (label: string, value?: string) => doc.font('Helvetica-Bold').fontSize(10).text(`${label}: `, { continued: true }).font('Helvetica').text(value || '-');
    doc.font('Helvetica-Bold').fontSize(18).text(copy.title);
    doc.font('Helvetica').fontSize(10).text('Arcada studerandekår - ASK').text(`Generated ${formatDate(new Date())}`);
    heading(copy.ref); row(copy.ref, booking.reference); row(copy.category, language === 'sv' ? 'Arcada-förening' : 'Arcada Association');
    heading(copy.association); row(copy.association, booking.organization); row(copy.contact, `${booking.requesterName} / ${booking.requesterEmail}`);
    heading(copy.billing);
    doc.font('Helvetica').fontSize(10).text(billing ? `${billing.name}\n${billing.address}\n${billing.postalCode} ${billing.city}\n${billing.country}` : '-');
    if (billing?.vatOrBusinessId) row(copy.vat, billing.vatOrBusinessId);
    if (billing?.referenceNumber) row(copy.billingRef, billing.referenceNumber);
    heading(copy.resource); row(copy.resource, booking.resource.name[language] || booking.resource.name.sv); row(copy.period, `${formatDate(booking.startAt)} ${formatTime(booking.startAt)}-${formatTime(booking.endAt)}`); row(copy.purpose, booking.purpose);
    heading(copy.price); row('Hyra/Rent', euros(booking.price.rentalPrice)); row('Kök/Kitchen', euros(booking.price.kitchenFee)); row('Bastu/Sauna', euros(booking.price.saunaFee)); row('Rabatt/Discount', euros(booking.price.discount)); doc.font('Helvetica-Bold').text(`${copy.total}: ${euros(booking.price.totalPrice)}`);
    if (settings.billingNotes) { heading(copy.notes); doc.font('Helvetica').fontSize(10).text(settings.billingNotes); }
    doc.end();
  });
}
