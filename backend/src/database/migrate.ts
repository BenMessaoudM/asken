import mongoose from 'mongoose';
import { loadEnv } from '../env';
import { platformFoundationMigration } from './migrations/001-platform-foundation';
import { identityRbacMigration } from './migrations/002-identity-rbac';
import { cmsFoundationMigration } from './migrations/003-cms-foundation';
import { genericContentFoundationMigration } from './migrations/004-generic-content-foundation';
import { newsBlogMigration } from './migrations/005-news-blog';
import { eventsManagementMigration } from './migrations/006-events-management';
import { bookingSystemMigration } from './migrations/007-booking-system';
import { removeLegacyBookingIndexesMigration } from './migrations/008-remove-legacy-booking-indexes';
import { corHouseBookingV06Migration } from './migrations/009-cor-house-booking-v06';
import { bookingConfigurablePricingMigration } from './migrations/010-booking-configurable-pricing';
import { organizationV07Migration } from './migrations/011-organization-v07';
import { bookingHardeningV08Migration } from './migrations/012-booking-hardening-v08';
import { organizationBylawsAlignmentMigration } from './migrations/013-organization-bylaws-alignment';
import { studentRepresentativesMigration } from './migrations/014-student-representatives';
import { publicGovernanceMigration } from './migrations/015-public-governance';
import { Migration } from './migrations/types';

const migrations: Migration[] = [
  platformFoundationMigration,
  identityRbacMigration,
  cmsFoundationMigration,
  genericContentFoundationMigration,
  newsBlogMigration,
  eventsManagementMigration,
  bookingSystemMigration,
  removeLegacyBookingIndexesMigration,
  corHouseBookingV06Migration,
  bookingConfigurablePricingMigration,
  organizationV07Migration,
  bookingHardeningV08Migration,
  organizationBylawsAlignmentMigration,
  studentRepresentativesMigration,
  publicGovernanceMigration,
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
