import { Migration } from './types';

export const cmsFoundationMigration: Migration = {
  id: '003-cms-foundation',
  description: 'Add CMS page, section, and version indexes',
  up: async (database) => {
    await database.collection('pages').createIndex({ slug: 1 }, { unique: true });
    await database.collection('pages').createIndex({ status: 1, updatedAt: -1 });
    await database.collection('pagesections').createIndex({ pageId: 1, position: 1 }, { unique: true });
    await database.collection('pageversions').createIndex({ pageId: 1, version: 1 }, { unique: true });
    await database.collection('pageversions').createIndex({ pageId: 1, createdAt: -1 });
  },
  down: async (database) => {
    await database.collection('pages').dropIndex('slug_1');
    await database.collection('pages').dropIndex('status_1_updatedAt_-1');
    await database.collection('pagesections').dropIndex('pageId_1_position_1');
    await database.collection('pageversions').dropIndex('pageId_1_version_1');
    await database.collection('pageversions').dropIndex('pageId_1_createdAt_-1');
  },
};
