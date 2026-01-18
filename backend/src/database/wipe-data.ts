import { DataSource } from 'typeorm';
import { seedDataSource } from './seeds/seed.config';
import { User } from '../entities/user.entity';
import { UserRole } from '../types/enums';

async function wipeData() {
  console.log('🧹 Starting database wipe (preserving Super Admin)...');

  try {
    if (!seedDataSource.isInitialized) {
      await seedDataSource.initialize();
    }
    console.log('✅ Database connected');

    const entities = seedDataSource.entityMetadatas;
    const userMetadata = entities.find(e => e.target === User || e.name === 'User');
    const userTableName = userMetadata ? `"${userMetadata.tableName}"` : '"users"';

    const tableNames = entities
      .map((entity) => `"${entity.tableName}"`)
      .filter((name) => name !== userTableName)
      .join(', ');

    if (tableNames) {
      console.log(`📦 Truncating tables: ${tableNames}`);
      await seedDataSource.query(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`);
    }

    // Handle User table: Delete everyone except SUPER_ADMIN
    console.log(`👤 Cleaning up users table (${userTableName}) keeping SUPER_ADMIN...`);
    
    // Delete non-super admins
    await seedDataSource.query(`DELETE FROM ${userTableName} WHERE "role" != '${UserRole.SUPER_ADMIN}';`);
    
    console.log('✅ Database wipe completed successfully!');
    console.log('ℹ️  Keep in mind that you might need to re-seed companies if you want to add new employees.');
  } catch (error) {
    console.error('❌ Wipe failed:', error);
    process.exit(1);
  } finally {
    if (seedDataSource.isInitialized) {
      await seedDataSource.destroy();
    }
  }
}

wipeData();
