import { Db, Document } from 'mongodb';
import { Migration } from './types';

async function collectionExists(database: Db, name: string) {
  return database.listCollections({ name }, { nameOnly: true }).hasNext();
}

async function migrateDocuments(
  database: Db,
  sourceName: string,
  targetName: string,
  transform: (document: Document) => Document,
) {
  if (!await collectionExists(database, sourceName)) return;
  const documents = await database.collection(sourceName).find().toArray();
  if (documents.length > 0) {
    const target = database.collection(targetName);
    const existingIds = new Set(
      (await target.find(
        { _id: { $in: documents.map((document) => document._id) } },
        { projection: { _id: 1 } },
      ).toArray()).map((document) => document._id.toString()),
    );
    const missing = documents
      .filter((document) => !existingIds.has(document._id.toString()))
      .map(transform);
    if (missing.length > 0) await target.insertMany(missing);
  }
  await database.collection(sourceName).drop();
}

export const genericContentFoundationMigration: Migration = {
  id: '004-generic-content-foundation',
  description: 'Generalize CMS pages into typed content',
  up: async (database) => {
    await migrateDocuments(database, 'pages', 'contents', (document) => ({
      ...document,
      contentType: 'page',
    }));
    await migrateDocuments(database, 'pagesections', 'contentsections', ({ pageId, ...document }) => ({
      ...document,
      contentId: pageId,
    }));
    await migrateDocuments(database, 'pageversions', 'contentversions', ({ pageId, ...document }) => ({
      ...document,
      contentId: pageId,
      contentType: 'page',
    }));

    await database.collection('contents').createIndex({ contentType: 1, slug: 1 }, { unique: true });
    await database.collection('contents').createIndex({ contentType: 1, status: 1, updatedAt: -1 });
    await database.collection('contentsections').createIndex({ contentId: 1, position: 1 }, { unique: true });
    await database.collection('contentversions').createIndex({ contentId: 1, version: 1 }, { unique: true });
    await database.collection('contentversions').createIndex({ contentId: 1, createdAt: -1 });
  },
  down: async (database) => {
    await database.collection('contents').dropIndex('contentType_1_slug_1');
    await database.collection('contents').dropIndex('contentType_1_status_1_updatedAt_-1');
    await database.collection('contentsections').dropIndex('contentId_1_position_1');
    await database.collection('contentversions').dropIndex('contentId_1_version_1');
    await database.collection('contentversions').dropIndex('contentId_1_createdAt_-1');
  },
};
