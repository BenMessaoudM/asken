import { Db } from 'mongodb';
import { Migration } from './types';

export const eventCollaborationsMigration: Migration = {
  id: '018-event-collaborations',
  description: 'Index event references to collaboration records',
  up: async (database: Db) => {
    await database.collection('cmsevents').createIndex({ 'eventCollaborations.collaborationId': 1, 'eventCollaborations.role': 1 });
  },
  down: async () => {},
};
