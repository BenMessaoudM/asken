import { Db } from 'mongodb';

export interface Migration {
  id: string;
  description: string;
  up: (database: Db) => Promise<void>;
  down: (database: Db) => Promise<void>;
}
