import PDFDocument from 'pdfkit';
import { BookingRecord, ContractLanguage } from './types';
import { CONTRACT_TEMPLATE_VERSION, CONTRACT_TERMS_VERSION, contractTemplates } from './contractTemplates';
import { formatDate, formatTime } from '../formatting/dateTime';
const officialNames:Record<ContractLanguage,string>={en:'Arcada Student Union – ASK',sv:'Arcada Studerandekår – ASK',fi:'Arcada opiskelijakunta – ASK'};
const typeLabels:Record<ContractLanguage,Record<BookingRecord['bookingType'],string>>={
 en:{internal_ask:'Internal ASK',arcada_association:'Arcada Association',ask_member:'ASK Member',alumni:'Alumni',external:'External'},
 sv:{internal_ask:'Intern ASK',arcada_association:'Arcada-förening',ask_member:'ASK-medlem',alumni:'Alumn',external:'Extern'},
 fi:{internal_ask:'ASK:n sisäinen',arcada_association:'Arcada-yhdistys',ask_member:'ASK:n jäsen',alumni:'Alumni',external:'Ulkopuolinen'}
};
const euros=(value:number)=>`${value.toFixed(2)} €`;
const date=(value:Date,_language:ContractLanguage)=>formatDate(value);
const time=(value:Date,_language:ContractLanguage)=>formatTime(value);
export interface ContractPdfOptions{language:ContractLanguage;doorCode:string;landlordAddress:string;landlordEmail:string}
export function createContractPdf(booking:BookingRecord,options:ContractPdfOptions):Promise<Buffer>{
 const template=contractTemplates[options.language],billing=booking.billingAddress;
 return new Promise((resolve,reject)=>{const doc=new PDFDocument({size:'A4',margin:54,info:{Title:`${template.title} ${booking.reference}`,Author:officialNames[options.language]}}),chunks:Buffer[]=[];doc.on('data',chunk=>chunks.push(Buffer.from(chunk)));doc.on('end',()=>resolve(Buffer.concat(chunks)));doc.on('error',reject);
 const heading=(value:string)=>{doc.moveDown(.7).font('Helvetica-Bold').fontSize(13).fillColor('#A32F8E').text(value).moveDown(.25).fillColor('#23212B')};
 const row=(label:string,value:string)=>doc.font('Helvetica-Bold').fontSize(9).text(label,{continued:true}).font('Helvetica').text(`  ${value||'—'}`);
 doc.font('Helvetica-Bold').fontSize(20).fillColor('#23212B').text(template.title);doc.font('Helvetica').fontSize(9).fillColor('#555').text(`${template.labels.reference}: ${booking.reference}  |  ${template.labels.contractDate}: ${date(new Date(),options.language)}  |  ${template.labels.language}: ${options.language.toUpperCase()}`);
 heading(template.labels.landlord);doc.font('Helvetica-Bold').text(officialNames[options.language]).font('Helvetica').text(options.landlordAddress).text(options.landlordEmail);
 heading(template.labels.tenant);row(template.labels.tenant,booking.requesterName);row(template.labels.organization,booking.organization||'');row(template.labels.email,booking.requesterEmail);row(template.labels.phone,booking.requesterPhone||'');
 heading(template.labels.billing);doc.font('Helvetica').text(billing?`${billing.name}\n${billing.address}\n${billing.postalCode} ${billing.city}\n${billing.country}${billing.vatOrBusinessId?`\n${template.labels.vat}: ${billing.vatOrBusinessId}`:''}${billing.referenceNumber?`\n${template.labels.billingReference}: ${billing.referenceNumber}`:''}`:template.labels.notApplicable);
 heading(template.labels.object);row(template.labels.object,`${booking.resource.name[options.language]}, ${booking.resource.floor[options.language]}`);row(template.labels.type,typeLabels[options.language][booking.bookingType]);row(template.labels.period,`${date(booking.startAt,options.language)} ${time(booking.startAt,options.language)}–${time(booking.endAt,options.language)}`);row(template.labels.participants,String(booking.attendees));row(template.labels.purpose,booking.purpose);
 heading(template.labels.priceBreakdown);row(template.labels.rental,euros(booking.price.rentalPrice));row(template.labels.kitchen,euros(booking.price.kitchenFee));row(template.labels.sauna,euros(booking.price.saunaFee));row(template.labels.discount,booking.price.benefitApplied||euros(booking.price.discount));row(template.labels.total,euros(booking.price.totalPrice));
 heading(template.labels.doorCode);doc.font('Helvetica-Bold').fontSize(14).text(options.doorCode).font('Helvetica').fontSize(9).text(template.accessInstructions);
 heading(template.labels.terms);template.terms.forEach((term,index)=>doc.font('Helvetica').fontSize(9).text(`${index+1}. ${term}`,{paragraphGap:3}));heading(template.labels.liability);template.liability.forEach((term,index)=>doc.font('Helvetica').fontSize(9).text(`${index+1}. ${term}`,{paragraphGap:3}));
 heading(template.labels.signatures);doc.moveDown(1.5).font('Helvetica').text('__________________________________                       __________________________________');doc.text(`${template.signatureLandlord}                                      ${template.signatureTenant}`);doc.moveDown().fontSize(8).fillColor('#666').text(`Template ${CONTRACT_TEMPLATE_VERSION} · Terms ${CONTRACT_TERMS_VERSION}`);doc.end();});
}
