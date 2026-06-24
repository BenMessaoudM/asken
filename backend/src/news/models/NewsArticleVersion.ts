import { model, Schema, Types } from 'mongoose';

const newsArticleVersionSchema = new Schema({
  articleId: { type: Types.ObjectId, ref: 'NewsArticle', required: true, index: true },
  contentId: { type: Types.ObjectId, ref: 'Content', required: true, index: true },
  version: { type: Number, required: true },
  snapshot: { type: Schema.Types.Mixed, required: true },
  actorId: { type: Types.ObjectId, ref: 'User', required: true },
  schemaVersion: { type: Number, required: true, default: 1 },
}, { timestamps: { createdAt: true, updatedAt: false } });

newsArticleVersionSchema.index({ articleId: 1, version: 1 }, { unique: true });
export const NewsArticleVersionModel = model('NewsArticleVersion', newsArticleVersionSchema);
