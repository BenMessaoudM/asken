import { Schema, Types, model } from 'mongoose';
const localized = { sv: { type: String, default: '' }, en: { type: String, default: '' } };
const schema = new Schema({
  name: localized, slug: { type: String, required: true, unique: true, lowercase: true }, description: localized, responsibilities: localized,
  contactEmail: String, contactPersonId: { type: Types.ObjectId, ref: 'OrganizationPerson' }, personIds: { type: [Types.ObjectId], default: [], ref: 'OrganizationPerson' },
  active: { type: Boolean, default: true, index: true }, visible: { type: Boolean, default: true, index: true },
  displayOrder: { type: Number, default: 100 }, schemaVersion: { type: Number, default: 1 },
}, { timestamps: true });
schema.index({ active: 1, visible: 1, displayOrder: 1 });
export const CommitteeModel = model('OrganizationCommittee', schema);
