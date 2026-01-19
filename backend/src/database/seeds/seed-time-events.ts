/**
 * Standalone script to seed time events for existing employees.
 * Run with: npm run seed:time-events
 * Or with a specific company: npm run seed:time-events -- --company=5
 * 
 * This will generate 15 days of realistic clock in/out and break data
 * for all active employees in the database (or just the specified company).
 */
import { seedDataSource } from './seed.config';
import { TimeEventSeeder } from './time-event.seeder';

// Parse command line arguments for --company=<id>
function getCompanyId(): number | undefined {
  const args = process.argv.slice(2);
  for (const arg of args) {
    if (arg.startsWith('--company=')) {
      const id = parseInt(arg.split('=')[1], 10);
      if (!isNaN(id)) return id;
    }
  }
  return undefined;
}

async function runTimeEventSeeder() {
  const companyId = getCompanyId();
  
  console.log('🕐 Starting Time Event Seeder...\n');
  if (companyId) {
    console.log(`📍 Targeting Company ID: ${companyId}\n`);
  } else {
    console.log('📍 Targeting ALL companies\n');
  }

  try {
    await seedDataSource.initialize();
    console.log('✅ Database connected\n');

    console.log(`▶️  Running ${TimeEventSeeder.name}...`);
    await TimeEventSeeder.run(seedDataSource, companyId);
    console.log('');

    console.log('✅ Time event seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    if (seedDataSource.isInitialized) {
      await seedDataSource.destroy();
    }
  }
}

runTimeEventSeeder();

