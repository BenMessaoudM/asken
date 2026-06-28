import { Db, ObjectId } from 'mongodb';
import { Migration } from './types';

export const collaborationsMigration: Migration = {
  id: '017-collaborations',
  description: 'Create collaborations collections, settings, and permissions',
  up: async (database: Db) => {
    await database.collection('collaborations').createIndex({ slug: 1 }, { unique: true });
    await database.collection('collaborations').createIndex({ type: 1, active: 1, visible: 1, featured: -1, displayOrder: 1 });
    await database.collection('collaborations').createIndex({ name: 'text', 'description.sv': 'text', 'description.en': 'text', 'tags.sv': 'text', 'tags.en': 'text' });
    await database.collection('collaborationsettings').createIndex({ key: 1 }, { unique: true });
    await database.collection('collaborationsettings').updateOne(
      { key: 'collaborations-settings' },
      { $setOnInsert: { key: 'collaborations-settings', intro: { sv: 'Samarbeten samlar ASK:s specialföreningar, studentnationer och partner.', en: 'Collaborations collect ASK associations, student nations and partners.' }, visible: true, createdAt: new Date(), updatedAt: new Date() } },
      { upsert: true },
    );

    const permissionSpecs = [
      ['collaborations.read', 'View collaboration management'],
      ['collaborations.write', 'Manage collaboration profiles and settings'],
    ] as const;
    const permissionIds: ObjectId[] = [];
    for (const [key, description] of permissionSpecs) {
      await database.collection('permissions').updateOne({ key }, { $set: { description }, $setOnInsert: { _id: new ObjectId(), schemaVersion: 1 } }, { upsert: true });
      const permission = await database.collection('permissions').findOne<{ _id: ObjectId }>({ key });
      if (permission) permissionIds.push(permission._id);
    }
    if (permissionIds.length) await database.collection('roles').updateOne({ key: 'super_admin' }, { $addToSet: { permissionIds: { $each: permissionIds } } });
  },
  down: async () => {},
};
