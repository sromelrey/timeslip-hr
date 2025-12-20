import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/timeslip_hr_db',
  entities: [__dirname + '/../entities/*.entity.{ts,js}'],
  synchronize: false, // Important: False so we don't try to sync broken schema before dropping
});

async function dropSchema() {
  console.log('🗑️  Dropping database schema...');
  try {
    await dataSource.initialize();
    
    // Drop all tables
    await dataSource.query('DROP SCHEMA public CASCADE');
    await dataSource.query('CREATE SCHEMA public');
    
    // Re-sync schema (create tables)
    await dataSource.synchronize();
    
    console.log('✅ Schema dropped and re-synchronized successfully');
  } catch (error) {
    console.error('❌ Failed to drop schema:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

dropSchema();
