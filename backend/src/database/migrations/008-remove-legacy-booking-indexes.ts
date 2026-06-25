import { Migration } from './types';

const legacyIndexes = [
  'date_1',
  'resource_1',
  'status_1',
  'date_1_resource_1_slot_1',
  'date_1_resource_1',
  'date_1_resources_1',
  'date_1_startTime_1_endTime_1_status_1',
  'spaces_1',
];

export const removeLegacyBookingIndexesMigration: Migration = {
  id: '008-remove-legacy-booking-indexes',
  description: 'Remove indexes from the retired placeholder booking schema',
  up: async (database) => {
    const collection = database.collection('bookings');
    const existing = new Set((await collection.indexes()).map((index) => index.name));
    await Promise.all(
      legacyIndexes
        .filter((name) => existing.has(name))
        .map((name) => collection.dropIndex(name)),
    );
  },
  down: async () => {
    // The retired schema is intentionally not restored.
  },
};
