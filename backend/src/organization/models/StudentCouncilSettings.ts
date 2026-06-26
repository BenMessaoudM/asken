import { Schema, model } from 'mongoose';
const localized = { sv: { type: String, default: '' }, en: { type: String, default: '' } };
const schema = new Schema({
  singletonKey: { type: String, required: true, unique: true, default: 'student-council' },
  title: localized, description: localized, speakerName: String, speakerEmail: String, viceSpeakerName: String, viceSpeakerEmail: String,
  contactEmail: { type: String, default: 'info@asken.fi' },
  members: { type: [{ name: String, title: String, displayOrder: { type: Number, default: 100 }, active: { type: Boolean, default: true } }], default: [] },
  documentLinks: { type: [{ label: localized, url: String, type: { type: String, enum: ['agenda', 'protocol', 'bylaws', 'other'], default: 'other' } }], default: [] },
  visible: { type: Boolean, default: true }, schemaVersion: { type: Number, default: 1 },
}, { timestamps: true });
export const StudentCouncilSettingsModel = model('OrganizationStudentCouncilSettings', schema);
