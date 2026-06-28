import { Schema, model, models } from 'mongoose';

const localizedTextSchema = new Schema({ sv: { type: String, default: '' }, en: { type: String, default: '' } }, { _id: false });

const collaborationSettingsSchema = new Schema({
  key: { type: String, required: true, unique: true, default: 'collaborations-settings' },
  intro: { type: localizedTextSchema, required: true, default: () => ({ sv: '', en: '' }) },
  contactEmail: String,
  visible: { type: Boolean, default: true },
}, { timestamps: true });

export const CollaborationSettingsModel = models.CollaborationSettings || model('CollaborationSettings', collaborationSettingsSchema);
