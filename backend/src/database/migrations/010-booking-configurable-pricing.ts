import { Db, ObjectId } from 'mongodb';
import { defaultBookingCategories, defaultBookingPricingRules } from '../../booking/defaultPricing';
import { Migration } from './types';

export const bookingConfigurablePricingMigration: Migration = {
  id: '010-booking-configurable-pricing',
  description: 'Seed configurable booking categories and pricing rules',
  up: async (database: Db) => {
    const now = new Date();
    const categories = database.collection('bookingcategories');
    for (const category of defaultBookingCategories) {
      await categories.updateOne({ key: category.key }, { $set: { ...category, updatedAt: now }, $setOnInsert: { _id: new ObjectId(), createdAt: now } }, { upsert: true });
    }
    await categories.createIndex({ key: 1 }, { unique: true });
    await categories.createIndex({ active: 1, public: 1, displayOrder: 1 });

    const pricingRules = database.collection('bookingpricingrules');
    for (const rule of defaultBookingPricingRules) {
      await pricingRules.updateOne({ version: rule.version }, { $set: { ...rule, updatedAt: now }, $setOnInsert: { _id: new ObjectId(), createdAt: now } }, { upsert: true });
    }
    await pricingRules.createIndex({ version: 1 }, { unique: true });
    await pricingRules.createIndex({ bookingType: 1, resourceSlug: 1, active: 1, validFrom: -1 });
  },
  down: async () => {},
};
