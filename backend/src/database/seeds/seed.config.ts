import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Shared DataSource for all seeders.
 * Configured for Neon (PostgreSQL with SSL).
 */
export const seedDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/timeslip_hr_db',
  entities: [__dirname + '/../../entities/*.entity.{ts,js}'],
  synchronize: true,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

/**
 * Base seeder interface that all seeders must implement.
 */
export interface Seeder {
  name: string;
  run(dataSource: DataSource, companyId?: number): Promise<void>;
}
