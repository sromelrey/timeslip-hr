import { seedDataSource, Seeder } from './seed.config';
import { CompanySeeder } from './company.seeder';
import { UserSeeder } from './user.seeder';
import { EmployeeSeeder } from './employee.seeder';
import { DeductionSeeder } from './deduction.seeder';
import { PayPeriodSeeder } from './pay-period.seeder';
import { CompensationSeeder } from './compensation.seeder';
import { TimeEventSeeder } from './time-event.seeder';

/**
 * List of seeders to run in order.
 * Add new seeders here as the app grows.
 */
const seeders: Seeder[] = [
  CompanySeeder,
  UserSeeder,
  EmployeeSeeder,
  DeductionSeeder,
  PayPeriodSeeder,
  CompensationSeeder,
  TimeEventSeeder,
];

async function runSeeders() {
  console.log('🌱 Starting database seed...\n');

  try {
    await seedDataSource.initialize();
    console.log('✅ Database connected\n');

    for (const seeder of seeders) {
      console.log(`▶️  Running ${seeder.name}...`);
      await seeder.run(seedDataSource);
      console.log('');
    }

    console.log('✅ All seeders completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    if (seedDataSource.isInitialized) {
      await seedDataSource.destroy();
    }
  }
}

runSeeders();
