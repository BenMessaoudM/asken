import { model, Schema, Types } from 'mongoose';
import { contentTypes } from '../types';

const contentSchema = new Schema(
  {
    contentType: { type: String, enum: contentTypes, required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    status: { type: String, enum: ['draft', 'published'], required: true, default: 'draft', index: true },
    version: { type: Number, required: true, default: 1 },
    publishedAt: { type: Date },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: true },
    schemaVersion: { type: Number, required: true, default: 1 },
  },
  { timestamps: true },
);

contentSchema.index({ contentType: 1, slug: 1 }, { unique: true });
contentSchema.index({ contentType: 1, status: 1, updatedAt: -1 });

export const ContentModel = model('Content', contentSchema);
