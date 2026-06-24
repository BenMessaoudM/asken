import mongoose from 'mongoose';
import { loadEnv } from '../env';
import { platformFoundationMigration } from './migrations/001-platform-foundation';
import { identityRbacMigration } from './migrations/002-identity-rbac';
import { cmsFoundationMigration } from './migrations/003-cms-foundation';
import { genericContentFoundationMigration } from './migrations/004-generic-content-foundation';
import { newsBlogMigration } from './migrations/005-news-blog';
import { eventsManagementMigration } from './migrations/006-events-management';
import { Migration } from './migrations/types';

const migrations: Migration[] = [
  platformFoundationMigration,
  identityRbacMigration,
  cmsFoundationMigration,
  genericContentFoundationMigration,
  newsBlogMigration,
  eventsManagementMigration,
];

export async function runMigrations() {
  const env = loadEnv();
  await mongoose.connect(env.MONGO_URI);
  const database = mongoose.connection.db;
  if (!database) throw new Error('Database connection is not ready');
  const migrationCollection = database.collection<{ id: string; appliedAt: Date }>('_migrations');
  await migrationCollection.createIndex({ id: 1 }, { unique: true });
  const applied = new Set((await migrationCollection.find({}, { projection: { id: 1 } }).toArray()).map((migration) => migration.id));
  for (const migration of migrations) {
    if (applied.has(migration.id)) continue;
    await migration.up(database);
    await migrationCollection.insertOne({ id: migration.id, appliedAt: new Date() });
    console.log(`Applied migration ${migration.id}: ${migration.description}`);
  }
  await mongoose.disconnect();
}

if (require.main === module) {
  runMigrations().catch((error: unknown) => {
    console.error('Migration failed', error);
    process.exit(1);
  });
}
