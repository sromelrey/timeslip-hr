import { DataSource } from 'typeorm';
import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';
import { Company } from '../../entities/company.entity';
import { User, UserRole } from '../../entities/user.entity';

dotenv.config();

// Database configuration
// Note: In a real app, use dotenv or ConfigService. 
// For this script, we'll try to use environment variables or fallback to defaults matching docker-compose.
const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/starter_jwt_db',
  entities: [__dirname + '/../../entities/*.entity.{ts,js}'], // Load all entities to satisfy relations
  synchronize: true, // Create tables if they don't exist
});

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

    const companyRepo = dataSource.getRepository(Company);
    const userRepo = dataSource.getRepository(User);

    // 1. Create Company
    const companyName = 'Acme Corp';
    let company = await companyRepo.findOne({ where: { name: companyName } });

    if (!company) {
      console.log(`Creating company: ${companyName}`);
      company = companyRepo.create({ name: companyName });
      await companyRepo.save(company);
    } else {
      console.log(`Company ${companyName} already exists`);
    }

    // 2. Create Admin User
    const adminEmail = 'admin@example.com';
    let admin = await userRepo.findOne({ where: { email: adminEmail } });

    if (!admin) {
      console.log(`Creating admin: ${adminEmail}`);
      const passwordHash = await argon2.hash('password123'); // Default password
      admin = userRepo.create({
        email: adminEmail,
        passwordHash,
        firstName: 'Admin',
        lastName: 'User',
        displayName: 'Admin User',
        role: UserRole.ADMIN,
        company: company,
        isActive: true,
      });
      await userRepo.save(admin);
    } else {
      console.log(`Admin ${adminEmail} already exists`);
    }

    // 3. Create Employee User
    const employeeEmail = 'employee@example.com';
    let employee = await userRepo.findOne({ where: { email: employeeEmail } });

    if (!employee) {
      console.log(`Creating employee: ${employeeEmail}`);
      const passwordHash = await argon2.hash('password123');
      employee = userRepo.create({
        email: employeeEmail,
        passwordHash,
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        role: UserRole.EMPLOYEE,
        company: company,
        isActive: true,
      });
      await userRepo.save(employee);
    } else {
      console.log(`Employee ${employeeEmail} already exists`);
    }

    console.log('✅ Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

seed();
