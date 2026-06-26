import { Schema, model } from 'mongoose';
const localized = { sv: { type: String, default: '' }, en: { type: String, default: '' } };
const schema = new Schema({
  name: localized, description: localized, icon: String, color: String, link: String,
  active: { type: Boolean, default: true, index: true }, displayOrder: { type: Number, default: 100 }, schemaVersion: { type: Number, default: 1 },
}, { timestamps: true });
schema.index({ active: 1, displayOrder: 1 });
export const OrganizationRoleBadgeModel = model('OrganizationRoleBadge', schema);
