import { model, Schema } from 'mongoose';

const newsTagSchema = new Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  labels: {
    en: { type: String, required: true, trim: true },
    sv: { type: String, required: true, trim: true },
  },
  schemaVersion: { type: Number, required: true, default: 1 },
}, { timestamps: true });

export const NewsTagModel = model('NewsTag', newsTagSchema);
