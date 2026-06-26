import { ObjectId } from 'mongodb';
import { Migration } from './types';

const now = () => new Date();

export const organizationV07Migration: Migration = {
  id: '011-organization-v07',
  description: 'Add Organization module indexes and default public content',
  up: async (database) => {
    const roleBadges = database.collection('organizationrolebadges');
    await roleBadges.createIndex({ active: 1, displayOrder: 1 });
    await roleBadges.updateOne(
      { 'name.sv': 'Skyddsperson mot trakasserier' },
      { $set: { name: { sv: 'Skyddsperson mot trakasserier', en: 'Anti-Harassment Contact Person' }, description: { sv: 'Kontaktperson för stöd vid trakasserier.', en: 'Contact person for support related to harassment.' }, active: true, displayOrder: 10, schemaVersion: 1, updatedAt: now() }, $setOnInsert: { _id: new ObjectId(), createdAt: now() } },
      { upsert: true },
    );
    await database.collection('organizationpeople').createIndex({ slug: 1 }, { unique: true });
    await database.collection('organizationpeople').createIndex({ type: 1, active: 1, visible: 1, displayOrder: 1 });
    await database.collection('organizationcommittees').createIndex({ slug: 1 }, { unique: true });
    await database.collection('organizationcommittees').createIndex({ active: 1, visible: 1, displayOrder: 1 });
    await database.collection('organizationrecruitmentcampaigns').createIndex({ published: 1, active: 1, featured: -1, displayOrder: 1 });
    await database.collection('organizationstudentcouncilsettings').updateOne(
      { singletonKey: 'student-council' },
      { $setOnInsert: { _id: new ObjectId(), singletonKey: 'student-council', title: { sv: 'Fullmäktige', en: 'Student Council' }, description: { sv: 'Fullmäktige är ASK:s högsta beslutande organ.', en: 'The Student Council is ASK’s highest decision-making body.' }, contactEmail: 'info@asken.fi', members: [], documentLinks: [], visible: true, schemaVersion: 1, createdAt: now(), updatedAt: now() } },
      { upsert: true },
    );
    await database.collection('organizationalumnipagecontents').updateOne(
      { singletonKey: 'alumni' },
      { $setOnInsert: { _id: new ObjectId(), singletonKey: 'alumni', title: { sv: 'Alumner', en: 'Alumni' }, intro: { sv: 'ASK Alumni samlar tidigare studerande och vänner till ASK.', en: 'ASK Alumni connects former students and friends of ASK.' }, body: { sv: 'Här kan framtida styrelser uppdatera information om alumninätverket, evenemang och sätt att stöda ASK.', en: 'Future boards can update information about the alumni network, events and ways to support ASK here.' }, heroImageAltText: { sv: '', en: '' }, benefits: [{ sv: 'Nätverk med andra alumner', en: 'Network with other alumni' }, { sv: 'Ta del av alumni-evenemang', en: 'Join alumni events' }, { sv: 'Stöd ASK:s fortsatta arbete', en: 'Support ASK’s continued work' }], ctaPrimaryLabel: { sv: 'Boka Cor-huset som alumn', en: 'Book Cor House as Alumni' }, ctaPrimaryUrl: '/booking?category=alumni', ctaSecondaryLabel: { sv: 'Gå med i alumninätverket', en: 'Join the Alumni Network' }, ctaSecondaryUrl: 'mailto:info@asken.fi', contactEmail: 'info@asken.fi', published: true, schemaVersion: 1, createdAt: now(), updatedAt: now() } },
      { upsert: true },
    );
  },
  down: async (database) => {
    await database.collection('organizationpeople').dropIndexes();
    await database.collection('organizationcommittees').dropIndexes();
    await database.collection('organizationrolebadges').dropIndexes();
    await database.collection('organizationrecruitmentcampaigns').dropIndexes();
  },
};
