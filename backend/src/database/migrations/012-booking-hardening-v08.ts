import { Db, ObjectId } from 'mongodb';
import { Migration } from './types';

export const bookingHardeningV08Migration: Migration = {
  id: '012-booking-hardening-v08',
  description: 'Harden booking contracts, Arcada billing, and soft deletion',
  up: async (database: Db) => {
    const now = new Date();
    await database.collection('bookingcategories').updateOne(
      { key: 'arcada_association' },
      { $set: { contractRequired: false, billingAddressRequired: false, updatedAt: now } },
    );
    await database.collection('bookings').updateMany({ isDeleted: { $exists: false } }, { $set: { isDeleted: false } });
    await database.collection('bookings').createIndex({ isDeleted: 1, status: 1, startAt: 1 });
    await database.collection('bookings').createIndex({ deletedAt: 1 });
    await database.collection('bookingbills').createIndex({ bookingId: 1, generatedAt: -1 });
    await database.collection('bookingbills').createIndex({ bookingReference: 1 });
    await database.collection('permissions').updateOne(
      { key: 'booking.delete' },
      { $set: { description: 'Soft delete bookings from normal booking views' }, $setOnInsert: { _id: new ObjectId(), schemaVersion: 1 } },
      { upsert: true },
    );
    const permission = await database.collection('permissions').findOne({ key: 'booking.delete' });
    const superAdmin = await database.collection('roles').findOne({ key: 'super_admin' });
    if (permission && superAdmin) await database.collection('roles').updateOne({ _id: superAdmin._id }, { $addToSet: { permissionIds: permission._id } });
  },
  down: async () => {},
};
