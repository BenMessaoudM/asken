import { model, Schema, Types } from 'mongoose';
import { contentTypes } from '../types';

const translationMetadataSchema = new Schema({
  status: { type: String, enum: ['missing', 'draft', 'needs_review', 'reviewed', 'published', 'stale'], required: true, default: 'draft' },
  sourceLanguage: { type: String, enum: ['sv', 'en', 'fi'], required: true, default: 'sv' },
  lastTranslatedAt: { type: Date },
  reviewedBy: { type: Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  staleSourceVersion: { type: Number },
}, { _id: false });

const contentSchema = new Schema(
  {
    contentType: { type: String, enum: contentTypes, required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    status: { type: String, enum: ['draft', 'published'], required: true, default: 'draft', index: true },
    version: { type: Number, required: true, default: 1 },
    publishedAt: { type: Date },
    sourceLanguage: { type: String, enum: ['sv', 'en'], required: true, default: 'sv' },
    translationMeta: {
      sv: { type: translationMetadataSchema, default: () => ({ status: 'published', sourceLanguage: 'sv' }) },
      en: { type: translationMetadataSchema, default: () => ({ status: 'draft', sourceLanguage: 'sv' }) },
    },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: true },
    schemaVersion: { type: Number, required: true, default: 1 },
  },
  { timestamps: true },
);

contentSchema.index({ contentType: 1, slug: 1 }, { unique: true });
contentSchema.index({ contentType: 1, status: 1, updatedAt: -1 });

export const ContentModel = model('Content', contentSchema);
