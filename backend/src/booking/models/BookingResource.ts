import { model, Schema } from 'mongoose';

const localized = new Schema({ en: { type: String, required: true }, sv: { type: String, required: true }, fi: { type: String, required: true } }, { _id: false });
const opening = new Schema({ weekday: { type: Number, required: true }, start: { type: String, required: true }, end: { type: String, required: true } }, { _id: false });
const blackout = new Schema({ startAt: { type: Date, required: true }, endAt: { type: Date, required: true }, reason: localized }, { _id: false });

const schema = new Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: localized, required: true }, floor: { type: localized, required: true }, description: { type: localized, required: true }, location: { type: localized, required: true }, rules: { type: localized, required: true },
  capacity: { type: Number, required: true }, accessibility: { type: localized, required: true }, imageUrl: String,
  active: { type: Boolean, required: true, default: true, index: true }, requiresApproval: { type: Boolean, required: true, default: true },
  minDurationMinutes: { type: Number, required: true }, maxDurationMinutes: { type: Number, required: true }, advanceBookingDays: { type: Number, required: true },
  openingHours: { type: [opening], default: [] }, blackoutPeriods: { type: [blackout], default: [] }, schemaVersion: { type: Number, default: 2 },
}, { timestamps: true });

export const BookingResourceModel = model('BookingResource', schema);
