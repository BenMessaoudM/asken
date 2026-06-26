import { Schema, Types, model } from 'mongoose';
const localized = { sv: { type: String, default: '' }, en: { type: String, default: '' } };
const schema = new Schema({
  title: localized, description: localized, type: { type: String, enum: ['tutor', 'board', 'student_council', 'crew_member', 'staff', 'alumni', 'other'], required: true, index: true },
  openingDate: { type: Date, required: true }, closingDate: { type: Date, required: true }, ctaLabel: localized, ctaUrl: { type: String, required: true },
  contactPersonId: { type: Types.ObjectId, ref: 'OrganizationPerson' }, contactEmail: String, featured: { type: Boolean, default: false, index: true },
  published: { type: Boolean, default: false, index: true }, status: { type: String, enum: ['coming_soon', 'open', 'closed'], default: 'coming_soon', index: true },
  displayOrder: { type: Number, default: 100 }, active: { type: Boolean, default: true, index: true }, schemaVersion: { type: Number, default: 1 },
}, { timestamps: true });
schema.index({ published: 1, active: 1, featured: -1, displayOrder: 1 });
export const RecruitmentCampaignModel = model('OrganizationRecruitmentCampaign', schema);
