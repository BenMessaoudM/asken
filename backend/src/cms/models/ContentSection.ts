import { model, Schema, Types } from 'mongoose';

const contentSectionSchema = new Schema(
  {
    contentId: { type: Types.ObjectId, ref: 'Content', required: true, index: true },
    type: { type: String, enum: ['hero', 'text', 'image', 'cta', 'faq'], required: true },
    position: { type: Number, required: true, min: 0 },
    data: { type: Schema.Types.Mixed, required: true },
    schemaVersion: { type: Number, required: true, default: 1 },
  },
  { timestamps: true },
);

contentSectionSchema.index({ contentId: 1, position: 1 }, { unique: true });

export const ContentSectionModel = model('ContentSection', contentSectionSchema);
