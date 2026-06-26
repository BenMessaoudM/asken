import { model, Schema } from 'mongoose';

const schema = new Schema({
  version: { type: String, required: true, unique: true, trim: true },
  resourceId: { type: Schema.Types.ObjectId, ref: 'BookingResource' },
  resourceSlug: { type: String, required: true, default: 'all', trim: true, lowercase: true },
  bookingType: { type: String, required: true, index: true },
  active: { type: Boolean, required: true, default: true, index: true },
  displayOrder: { type: Number, required: true, default: 100 },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date },
  minimumHours: { type: Number, required: true, default: 0 },
  weekdayHourly: Number,
  weekendHourly: Number,
  weekdayFixedPrice: Number,
  weekendFixedPrice: Number,
  fixedBookingPrice: Number,
  firstHours: Number,
  firstHoursHourly: Number,
  additionalHourly: Number,
  kitchenFee: { type: Number, required: true, default: 0 },
  saunaFee: { type: Number, required: true, default: 0 },
  kitchenIncluded: { type: Boolean, required: true, default: false },
  saunaIncluded: { type: Boolean, required: true, default: false },
  manualOverrideAllowed: { type: Boolean, required: true, default: true },
}, { timestamps: true });

schema.index({ bookingType: 1, resourceSlug: 1, active: 1, validFrom: -1 });
export const BookingPricingRuleModel = model('BookingPricingRule', schema);
