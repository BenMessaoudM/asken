import { model, Schema, Types } from 'mongoose';

const localizedArticleSchema = new Schema({
  title: { type: String, required: true, trim: true },
  summary: { type: String, required: true, trim: true },
  body: { type: String, required: true },
  imageUrl: { type: String },
  imageAlt: { type: String },
}, { _id: false });

const translationMetadataSchema = new Schema({
  status: { type: String, enum: ['missing', 'draft', 'needs_review', 'reviewed', 'published', 'stale'], required: true, default: 'draft' },
  sourceLanguage: { type: String, enum: ['sv', 'en', 'fi'], required: true, default: 'sv' },
  lastTranslatedAt: { type: Date },
  reviewedBy: { type: Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  staleSourceVersion: { type: Number },
}, { _id: false });

const newsArticleSchema = new Schema({
  contentId: { type: Types.ObjectId, ref: 'Content', required: true, unique: true, index: true },
  translations: {
    sv: { type: localizedArticleSchema, required: true },
    en: { type: localizedArticleSchema, required: true },
  },
  translationMeta: {
    sv: { type: translationMetadataSchema, default: () => ({ status: 'published', sourceLanguage: 'sv' }) },
    en: { type: translationMetadataSchema, default: () => ({ status: 'draft', sourceLanguage: 'sv' }) },
  },
  categoryIds: [{ type: Types.ObjectId, ref: 'NewsCategory' }],
  tagIds: [{ type: Types.ObjectId, ref: 'NewsTag' }],
  featured: { type: Boolean, required: true, default: false, index: true },
  scheduledAt: { type: Date, index: true },
  schemaVersion: { type: Number, required: true, default: 1 },
}, { timestamps: true });

newsArticleSchema.index({ categoryIds: 1, updatedAt: -1 });
newsArticleSchema.index({ tagIds: 1, updatedAt: -1 });
newsArticleSchema.index({ 'translations.en.title': 'text', 'translations.en.summary': 'text', 'translations.en.body': 'text', 'translations.sv.title': 'text', 'translations.sv.summary': 'text', 'translations.sv.body': 'text' });

export const NewsArticleModel = model('NewsArticle', newsArticleSchema);
