import PDFDocument from 'pdfkit';
import { BookingRecord, ContractLanguage, CorHouseBookingSettings } from './types';
import { CONTRACT_TEMPLATE_VERSION, CONTRACT_TERMS_VERSION, contractTemplates } from './contractTemplates';
import { formatDate, formatTime } from '../formatting/dateTime';

const typeLabels: Record<ContractLanguage, Record<BookingRecord['bookingType'], string>> = {
  en: { internal_ask: 'Internal ASK', arcada_association: 'Arcada Association', ask_member: 'ASK Member', alumni: 'Alumni', external: 'External' },
  sv: { internal_ask: 'Intern ASK', arcada_association: 'Arcada-förening', ask_member: 'ASK-medlem', alumni: 'Alumn', external: 'Extern' },
  fi: { internal_ask: 'ASK:n sisäinen', arcada_association: 'Arcada-yhdistys', ask_member: 'ASK:n jäsen', alumni: 'Alumni', external: 'Ulkopuolinen' },
};

const defaults = {
  landlordName: 'Fastighets Ab Cor-huset',
  landlordAddress: 'Jan-Magnus Janssons plats 1',
  landlordPostalCode: '00560',
  landlordCity: 'Helsingfors',
  businessId: '2006332-4',
  bankName: 'Nordea',
  bankAccount: '174530-2982',
  contactPersonName: 'Arcada studerandekår – ASK',
  contactPersonEmail: 'info@asken.fi',
};

const euros = (value: number) => value === 0 ? '–' : `${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2)}€`;
const divider = (doc: PDFKit.PDFDocument) => doc.moveTo(doc.page.margins.left, doc.y + 5).lineTo(doc.page.width - doc.page.margins.right, doc.y + 5).strokeColor('#222').lineWidth(0.6).stroke().moveDown(0.8).fillColor('#111');
const resourceMarks = (booking: BookingRecord) => ({
  festsal: booking.resource.slug === 'main-hall' ? 'x' : '',
  kabinett: booking.resource.slug === 'meeting-room-sauna' && !booking.saunaExtra ? 'x' : '',
  bastuKabinett: booking.resource.slug === 'meeting-room-sauna' && booking.saunaExtra ? 'x' : '',
  kok: booking.resource.slug === 'kitchen' || booking.kitchenExtra || booking.bookingType === 'arcada_association' ? 'x' : '',
});

export interface ContractPdfOptions { language: ContractLanguage; doorCode: string; settings: CorHouseBookingSettings; }

export function createContractPdf(booking: BookingRecord, options: ContractPdfOptions): Promise<Buffer> {
  const template = contractTemplates[options.language];
  const settings = { ...defaults, ...options.settings };
  const billing = booking.billingAddress;
  const marks = resourceMarks(booking);
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 48, info: { Title: `${template.title} ${booking.reference}`, Author: settings.landlordName } });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    const heading = (value: string) => { doc.moveDown(0.7).font('Helvetica-Bold').fontSize(12).fillColor('#111').text(value); doc.moveDown(0.2); };
    const row = (label: string, value?: string) => doc.font('Helvetica-Bold').fontSize(9).text(`${label}: `, { continued: true }).font('Helvetica').text(value || '-');

    doc.font('Helvetica-Bold').fontSize(16).text(settings.landlordName);
    divider(doc);
    doc.font('Helvetica').fontSize(9).text(`${settings.landlordAddress}, ${settings.landlordPostalCode} ${settings.landlordCity}`);
    doc.text(`FO-nummer: ${settings.businessId}`);
    doc.text(`${settings.bankName}: ${settings.bankAccount}`);
    if (settings.phone) doc.text(`Telefon: ${settings.phone}`);
    if (settings.fax) doc.text(`Fax: ${settings.fax}`);
    row('Bokningsreferens', booking.reference);
    row('Avtalsdatum', formatDate(new Date()));

    heading('Hyresvärd');
    doc.font('Helvetica').fontSize(10).text(settings.landlordName).text(settings.landlordAddress).text(`${settings.landlordPostalCode} ${settings.landlordCity}`).text(`FO-nummer: ${settings.businessId}`);
    heading('Kontaktperson');
    doc.font('Helvetica').fontSize(10).text(settings.contactPersonName || defaults.contactPersonName);
    if (settings.contactPersonPhone) doc.text(settings.contactPersonPhone);
    if (settings.contactPersonEmail) doc.text(settings.contactPersonEmail);
    if (settings.administratorName || settings.administratorEmail) doc.text([settings.administratorName, settings.administratorEmail].filter(Boolean).join(' / '));

    heading('Hyresgäst');
    row('Namn', booking.requesterName); row('Organisation', booking.organization); row('E-post', booking.requesterEmail); row('Telefon', booking.requesterPhone); row('Bokningstyp', typeLabels[options.language][booking.bookingType]);
    heading('Faktureringsadress');
    doc.font('Helvetica').fontSize(10).text(billing ? `${billing.name}\n${billing.address}\n${billing.postalCode} ${billing.city}\n${billing.country}${billing.vatOrBusinessId ? `\nFO-/momsnummer: ${billing.vatOrBusinessId}` : ''}${billing.referenceNumber ? `\nReferens: ${billing.referenceNumber}` : ''}` : '-');

    heading('Hyresobjekt');
    doc.font('Helvetica').fontSize(10).text('Cor-huset').text('Majstadsgatan 11').text('00560 Helsingfors').moveDown(0.2);
    row('Festsal', marks.festsal); row('Kabinett', marks.kabinett); row('Bastu och kabinett', marks.bastuKabinett); row('Kök (med kärl)', marks.kok);

    heading('Avtalsperiod');
    doc.font('Helvetica').fontSize(10).text(`${formatDate(booking.startAt)} kl. ${formatTime(booking.startAt)}-${formatTime(booking.endAt)}`);
    row('Deltagare', String(booking.attendees)); row('Syfte', booking.purpose);

    heading('Hyra');
    doc.font('Helvetica').fontSize(10);
    doc.text(`${booking.resource.name.sv}: ${booking.price.billableHours} x ${booking.price.billableHours ? euros(booking.price.rentalPrice / booking.price.billableHours) : euros(booking.price.rentalPrice)} = ${euros(booking.price.rentalPrice)}`);
    doc.text(`Kök: ${euros(booking.price.kitchenFee)}`);
    doc.text(`Bastu: ${euros(booking.price.saunaFee)}`);
    doc.text(`Rabatt / kostnadsfri förmån: ${booking.price.benefitApplied || euros(booking.price.discount)}`);
    doc.font('Helvetica-Bold').text(`Totalt: ${euros(booking.price.totalPrice)}`);

    heading('Hyresvillkor');
    template.terms.forEach((term, index) => doc.font('Helvetica').fontSize(9).text(`${index + 1}. ${term}`, { paragraphGap: 2 }));
    heading('Tillträde / dörrkod');
    doc.font('Helvetica-Bold').fontSize(12).text(options.doorCode).font('Helvetica').fontSize(9).text(template.accessInstructions);

    heading('Underskrifter');
    doc.font('Helvetica').fontSize(10).text('Helsingfors ____ / ____ 20____').moveDown(1.7);
    doc.text('______________________________').text('Hyresgivarens representant');
    if (settings.contactPersonName) doc.fontSize(9).text(settings.contactPersonName).fontSize(10);
    doc.moveDown(1.4).text('______________________________').text('Hyresgästens representant');
    doc.moveDown().fontSize(8).fillColor('#666').text(`Template ${CONTRACT_TEMPLATE_VERSION} · Terms ${CONTRACT_TERMS_VERSION}`);
    doc.end();
  });
}
