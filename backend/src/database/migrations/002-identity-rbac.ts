import { Migration } from './types';

export const identityRbacMigration: Migration = {
  id: '002-identity-rbac',
  description: 'Add identity, RBAC, refresh session, and audit indexes',
  up: async (database) => {
    await database.collection('permissions').createIndex({ key: 1 }, { unique: true });
    await database.collection('roles').createIndex({ key: 1 }, { unique: true });
    await database.collection('users').createIndex({ email: 1 }, { unique: true });
    await database.collection('refreshsessions').createIndex({ tokenHash: 1 }, { unique: true });
    await database.collection('refreshsessions').createIndex({ userId: 1, revokedAt: 1 });
    await database.collection('refreshsessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    await database.collection('auditevents').createIndex({ occurredAt: -1 });
    await database.collection('auditevents').createIndex({ actorId: 1, occurredAt: -1 });
  },
  down: async (database) => {
    await database.collection('permissions').dropIndex('key_1');
    await database.collection('refreshsessions').dropIndex('tokenHash_1');
    await database.collection('refreshsessions').dropIndex('userId_1_revokedAt_1');
    await database.collection('refreshsessions').dropIndex('expiresAt_1');
    await database.collection('auditevents').dropIndex('occurredAt_-1');
    await database.collection('auditevents').dropIndex('actorId_1_occurredAt_-1');
  },
};
