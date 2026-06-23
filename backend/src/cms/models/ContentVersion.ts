import { model, Schema, Types } from 'mongoose';
import { contentTypes } from '../types';

const contentVersionSchema = new Schema(
  {
    contentId: { type: Types.ObjectId, ref: 'Content', required: true, index: true },
    version: { type: Number, required: true },
    contentType: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published'], required: true },
    publishedAt: { type: Date },
    sections: [{
      type: { type: String, enum: ['hero', 'text', 'image', 'cta', 'faq'], required: true },
      position: { type: Number, required: true },
      data: { type: Schema.Types.Mixed, required: true },
      _id: false,
    }],
    actorId: { type: Types.ObjectId, ref: 'User', required: true },
    schemaVersion: { type: Number, required: true, default: 1 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

contentVersionSchema.index({ contentId: 1, version: 1 }, { unique: true });
contentVersionSchema.index({ contentId: 1, createdAt: -1 });

export const ContentVersionModel = model('ContentVersion', contentVersionSchema);
