import { Migration } from './types';

export const platformFoundationMigration: Migration = {
  id: '001-platform-foundation',
  description: 'Create indexes for shared platform entities',
  up: async (database) => {
    await database.collection('users').createIndex({ email: 1 }, { unique: true });
    await database.collection('roles').createIndex({ key: 1 }, { unique: true });
    await database
      .collection('translations')
      .createIndex({ entityType: 1, entityId: 1, locale: 1 }, { unique: true });
    await database.collection('media').createIndex({ storageKey: 1 }, { unique: true });
    await database.collection('auditEvents').createIndex({ occurredAt: -1 });
    await database.collection('notifications').createIndex({ status: 1, createdAt: 1 });
  },
  down: async (database) => {
    await database.collection('users').dropIndex('email_1');
    await database.collection('roles').dropIndex('key_1');
    await database
      .collection('translations')
      .dropIndex('entityType_1_entityId_1_locale_1');
    await database.collection('media').dropIndex('storageKey_1');
    await database.collection('auditEvents').dropIndex('occurredAt_-1');
    await database.collection('notifications').dropIndex('status_1_createdAt_1');
  },
};
