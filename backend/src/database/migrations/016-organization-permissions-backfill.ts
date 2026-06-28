import { Db, ObjectId } from 'mongodb';
import { Migration } from './types';

export const organizationPermissionsBackfillMigration: Migration = {
  id: '016-organization-permissions-backfill',
  description: 'Ensure Organization permissions are granted to Super Admin',
  up: async (database: Db) => {
    const permissionSpecs = [
      ['organization.read', 'View organization management'],
      ['organization.write', 'Manage public organization information'],
    ] as const;
    const permissionIds: ObjectId[] = [];

    for (const [key, description] of permissionSpecs) {
      await database.collection('permissions').updateOne(
        { key },
        { $set: { description }, $setOnInsert: { _id: new ObjectId(), schemaVersion: 1 } },
        { upsert: true },
      );
      const permission = await database.collection('permissions').findOne<{ _id: ObjectId }>({ key });
      if (permission) permissionIds.push(permission._id);
    }

    if (permissionIds.length > 0) {
      await database.collection('roles').updateOne(
        { key: 'super_admin' },
        { $addToSet: { permissionIds: { $each: permissionIds } } },
      );
    }
  },
  down: async () => {},
};
