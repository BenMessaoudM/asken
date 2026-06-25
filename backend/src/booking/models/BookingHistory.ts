import { model, Schema, Types } from 'mongoose';
const schema = new Schema({ bookingId: { type: Types.ObjectId, ref: 'Booking', required: true, index: true }, bookingReference: { type: String, required: true, index: true }, action: { type: String, required: true }, status: { type: String, required: true }, actorId: { type: Types.ObjectId, ref: 'User' }, note: String, snapshot: Schema.Types.Mixed, occurredAt: { type: Date, required: true, default: Date.now } }, { versionKey: false });
schema.index({ bookingId: 1, occurredAt: -1 });
export const BookingHistoryModel = model('BookingHistory', schema);
