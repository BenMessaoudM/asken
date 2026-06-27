import { model, Schema } from 'mongoose';

const localized = new Schema({ sv: { type: String, required: true, default: '' }, en: { type: String, required: true, default: '' } }, { _id: false });
const member = new Schema({
  name: { type: String, required: true }, title: String, mandateStart: Date, mandateEnd: Date,
  chairperson: { type: Boolean, required: true, default: false }, secretary: { type: Boolean, required: true, default: false },
  active: { type: Boolean, required: true, default: true }, displayOrder: { type: Number, required: true, default: 100 },
}, { _id: false });
const schema = new Schema({
  singletonKey: { type: String, required: true, unique: true, default: 'elders-council' },
  title: { type: localized, required: true }, description: { type: localized, required: true },
  contactEmail: { type: String, required: true, default: 'aldresrad@asken.fi' }, members: { type: [member], default: [] },
  visible: { type: Boolean, required: true, default: true },
}, { timestamps: true });

export const EldersCouncilSettingsModel = model('OrganizationEldersCouncilSettings', schema);
