import { Db, ObjectId } from 'mongodb';
import { defaultRepresentativeBodies } from '../../representatives/defaultRepresentativeBodies';
import { Migration } from './types';

export const studentRepresentativesMigration: Migration = {
  id: '014-student-representatives',
  description: 'Add Student Representatives bodies, indexes, and permissions',
  up: async (database: Db) => {
    const now = new Date();
    const bodies = database.collection('representativebodies');
    await bodies.createIndex({ slug: 1 }, { unique: true });
    await bodies.createIndex({ active: 1, visible: 1, displayOrder: 1 });
    await database.collection('studentrepresentatives').createIndex({ bodyId: 1, status: 1, publicProfile: 1, displayOrder: 1 });
    await database.collection('representativecalls').createIndex({ published: 1, featured: -1, displayOrder: 1, closingDate: 1 });
    await database.collection('representativecalls').createIndex({ bodyId: 1, published: 1 });

    for (const body of defaultRepresentativeBodies) {
      await bodies.updateOne(
        { slug: body.slug },
        { $set: { ...body, updatedAt: now }, $setOnInsert: { _id: new ObjectId(), createdAt: now, schemaVersion: 1 } },
        { upsert: true },
      );
    }

    const permissionSpecs = [
      ['representatives.read', 'View student representatives management'],
      ['representatives.write', 'Manage student representative bodies, people, and calls'],
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
      await database.collection('roles').updateOne({ key: 'super_admin' }, { $addToSet: { permissionIds: { $each: permissionIds } } });
    }
  },
  down: async () => {},
};
