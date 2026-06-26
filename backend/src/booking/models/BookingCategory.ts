import { model, Schema } from 'mongoose';

const localized = new Schema({ sv: { type: String, required: true }, en: { type: String, required: true }, fi: { type: String, required: true } }, { _id: false });
const schema = new Schema({
  key: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: localized, required: true },
  description: { type: localized, required: true },
  active: { type: Boolean, required: true, default: true, index: true },
  displayOrder: { type: Number, required: true, default: 100 },
  billingAddressRequired: { type: Boolean, required: true, default: true },
  contractRequired: { type: Boolean, required: true, default: true },
  quoteRequestAllowed: { type: Boolean, required: true, default: true },
  public: { type: Boolean, required: true, default: true, index: true },
}, { timestamps: true });

export const BookingCategoryModel = model('BookingCategory', schema);
