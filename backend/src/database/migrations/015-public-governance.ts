import { Db, ObjectId } from 'mongodb';
import { Migration } from './types';

export const publicGovernanceMigration: Migration = {
  id: '015-public-governance',
  description: 'Add public governance document settings, indexes, and permissions',
  up: async (database: Db) => {
    const now = new Date();
    await database.collection('governancedocuments').createIndex({ slug: 1 }, { unique: true });
    await database.collection('governancedocuments').createIndex({ isPublic: 1, isPublished: 1, documentType: 1, year: -1 });
    await database.collection('governancedocuments').createIndex({ governanceBody: 1, documentType: 1, year: -1 });
    await database.collection('governancesettings').updateOne(
      { singletonKey: 'governance-settings' },
      { $set: { intro: { sv: 'Här publicerar ASK offentliga styrdokument, Fullmäktigehandlingar, stadgar, reglemente, verksamhetsberättelser, bokslut och policyer.', en: 'ASK publishes public governance documents, Student Council documents, statutes, regulations, annual reports, financial statements and policies here.' }, documentPolicyText: { sv: 'Fullmäktiges protokoll är offentliga, men delar kan undanhållas om de innehåller uppgifter om privatpersoner eller annat material som inte ska publiceras. Styrelsens interna handlingar ingår inte i denna modul.', en: 'Student Council minutes are public, but parts may be withheld if they contain private-person information or other material that should not be published. Internal Board documents are not included in this module.' }, contactEmail: 'info@asken.fi', visible: true, updatedAt: now }, $setOnInsert: { _id: new ObjectId(), singletonKey: 'governance-settings', createdAt: now, schemaVersion: 1 } },
      { upsert: true },
    );
    const permissionSpecs = [
      ['governance.read', 'View governance document management'],
      ['governance.write', 'Manage and publish public governance documents'],
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
