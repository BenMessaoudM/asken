import { Schema, model } from 'mongoose';
const localized = { sv: { type: String, default: '' }, en: { type: String, default: '' } };
const schema = new Schema({
  singletonKey: { type: String, required: true, unique: true, default: 'alumni' },
  title: localized, intro: localized, body: localized, heroImageUrl: String, heroImageAltText: localized,
  benefits: { type: [localized], default: [] }, ctaPrimaryLabel: localized, ctaPrimaryUrl: { type: String, default: '/booking?category=alumni' },
  ctaSecondaryLabel: localized, ctaSecondaryUrl: String, contactEmail: String, published: { type: Boolean, default: true }, schemaVersion: { type: Number, default: 1 },
}, { timestamps: true });
export const AlumniPageContentModel = model('OrganizationAlumniPageContent', schema);
