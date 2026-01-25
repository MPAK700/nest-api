import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Profile } from '../features/profile/entity/profile.entity.ts';
import { RefreshToken } from '../auth/entity/refresh-token.entity.ts';
import { resolve } from 'path';

dotenv.config({ path: resolve('./.env.test.local') });

export const AppDataSource = new DataSource({
  migrationsTableName: 'migrations',
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Profile, RefreshToken],
  migrations: ['./migrations/*.ts'],
  synchronize: false,
});
