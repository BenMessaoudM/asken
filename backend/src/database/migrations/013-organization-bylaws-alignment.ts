import { Db } from 'mongodb';
import { Migration } from './types';

export const organizationBylawsAlignmentMigration: Migration = {
  id: '013-organization-bylaws-alignment',
  description: 'Seed Elders Council organization content from ASK bylaws and regulations',
  up: async (database: Db) => {
    const now = new Date();
    await database.collection('organizationelderscouncilsettings').updateOne(
      { singletonKey: 'elders-council' },
      {
        $set: {
          title: { sv: 'Äldres Råd', en: 'Elders’ Council' },
          description: {
            sv: 'Äldres Råd är ett rådgivande organ för studerandekåren. Rådet utses av Fullmäktige och består enligt reglementet av nio medlemmar med treårigt mandat. Fullmäktige kompletterar avgående medlemmar årligen vid höstmötet.',
            en: 'The Elders’ Council is an advisory body of the Student Union. It is appointed by the Student Council and, under the regulations, consists of nine members with a three-year mandate. The Student Council supplements outgoing members annually at the autumn meeting.',
          },
          contactEmail: 'aldresrad@asken.fi',
          visible: true,
          updatedAt: now,
        },
        $setOnInsert: { singletonKey: 'elders-council', members: [], createdAt: now },
      },
      { upsert: true },
    );
    await database.collection('organizationelderscouncilsettings').createIndex({ singletonKey: 1 }, { unique: true });
  },
  down: async () => {},
};
