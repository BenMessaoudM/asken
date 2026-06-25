import { model, Schema, Types } from 'mongoose';
const schema = new Schema({ resourceId: { type: Types.ObjectId, ref: 'BookingResource', required: true }, bookingId: { type: Types.ObjectId, ref: 'Booking', required: true, index: true }, slotAt: { type: Date, required: true } }, { timestamps: true });
schema.index({ resourceId: 1, slotAt: 1 }, { unique: true });
export const BookingSlotModel = model('BookingSlot', schema);
