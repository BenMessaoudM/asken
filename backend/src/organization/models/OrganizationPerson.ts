import { Schema, Types, model } from 'mongoose';
const localized = { sv: { type: String, default: '' }, en: { type: String, default: '' } };
const schema = new Schema({
  fullName: { type: String, required: true, trim: true }, nickname: String, slug: { type: String, required: true, unique: true, lowercase: true },
  photoUrl: String, photoAltText: localized, positionTitle: localized, description: localized, responsibilities: localized,
  email: { type: String, required: true, lowercase: true, trim: true }, phone: String, languagesSpoken: { type: [String], default: [] },
  roleBadgeIds: { type: [Types.ObjectId], default: [], ref: 'OrganizationRoleBadge' },
  socialLinks: { instagram: String, linkedIn: String, website: String }, officeHours: { sv: String, en: String },
  type: { type: String, enum: ['board', 'staff', 'council', 'committee', 'alumni', 'other'], required: true, index: true },
  displayOrder: { type: Number, default: 100 }, active: { type: Boolean, default: true, index: true }, visible: { type: Boolean, default: true, index: true },
  startDate: Date, endDate: Date, schemaVersion: { type: Number, default: 1 },
}, { timestamps: true });
schema.index({ type: 1, active: 1, visible: 1, displayOrder: 1 });
export const OrganizationPersonModel = model('OrganizationPerson', schema);
