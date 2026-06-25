import { model, Schema, Types } from 'mongoose';

const schema = new Schema({
  reference: { type: String, required: true, unique: true, index: true }, accessCodeHash: { type: String, required: true },
  resourceId: { type: Types.ObjectId, ref: 'BookingResource', required: true, index: true },
  startAt: { type: Date, required: true, index: true }, endAt: { type: Date, required: true, index: true },
  requesterName: { type: String, required: true }, requesterEmail: { type: String, required: true, lowercase: true }, requesterPhone: String,
  organization: String, purpose: { type: String, required: true }, attendees: { type: Number, required: true }, accessibilityNeeds: String,
  locale: { type: String, enum: ['en', 'sv'], required: true }, privacyAcceptedAt: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled'], required: true, index: true },
  publicNotes: String, internalNotes: String, decisionAt: Date, decidedBy: { type: Types.ObjectId, ref: 'User' }, schemaVersion: { type: Number, default: 1 },
}, { timestamps: true });
schema.index({ resourceId: 1, startAt: 1, endAt: 1 });
schema.index({ requesterEmail: 1, createdAt: -1 });
export const BookingModel = model('Booking', schema);
