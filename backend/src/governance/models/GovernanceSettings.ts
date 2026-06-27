import { model, Schema } from 'mongoose';
const localized = new Schema({ sv: { type: String, default: '' }, en: { type: String, default: '' } }, { _id: false });
const schema = new Schema({ singletonKey: { type: String, required: true, unique: true, default: 'governance-settings' }, intro: { type: localized, required: true }, documentPolicyText: { type: localized, required: true }, contactEmail: String, visible: { type: Boolean, required: true, default: true } }, { timestamps: true });
export const GovernanceSettingsModel = model('GovernanceSettings', schema);
