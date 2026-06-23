import { model, Schema, Types } from 'mongoose';

const refreshSessionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date },
    lastUsedAt: { type: Date },
    createdByIp: { type: String },
    userAgent: { type: String },
    schemaVersion: { type: Number, required: true, default: 1 },
  },
  { timestamps: true },
);

refreshSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshSessionModel = model('RefreshSession', refreshSessionSchema);
