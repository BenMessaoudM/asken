import { Migration } from './types';

export const newsBlogMigration: Migration = {
  id: '005-news-blog',
  description: 'Add News and Blog specialization indexes',
  up: async (database) => {
    await database.collection('newsarticles').createIndex({ contentId: 1 }, { unique: true });
    await database.collection('newsarticles').createIndex({ featured: 1, updatedAt: -1 });
    await database.collection('newsarticles').createIndex({ categoryIds: 1, updatedAt: -1 });
    await database.collection('newsarticles').createIndex({ tagIds: 1, updatedAt: -1 });
    await database.collection('newsarticles').createIndex({ scheduledAt: 1 });
    await database.collection('newsarticles').createIndex({
      'translations.en.title': 'text', 'translations.en.summary': 'text', 'translations.en.body': 'text',
      'translations.sv.title': 'text', 'translations.sv.summary': 'text', 'translations.sv.body': 'text',
    });
    await database.collection('newscategories').createIndex({ slug: 1 }, { unique: true });
    await database.collection('newstags').createIndex({ slug: 1 }, { unique: true });
    await database.collection('newsarticleversions').createIndex({ articleId: 1, version: 1 }, { unique: true });
  },
  down: async (database) => {
    await database.collection('newsarticles').dropIndexes();
    await database.collection('newscategories').dropIndexes();
    await database.collection('newstags').dropIndexes();
    await database.collection('newsarticleversions').dropIndexes();
  },
};
