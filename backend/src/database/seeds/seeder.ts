import { DataSource } from 'typeorm';
import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';
import { Company } from '../../entities/company.entity';
import { User } from '../../entities/user.entity';
import { Employee } from '../../entities/employee.entity';
import { EmployeeCompensation } from '../../entities/employee-compensation.entity';
import { UserRole, EmploymentType, CompensationType } from '../../types/enums';

dotenv.config();

// Database configuration
// Note: In a real app, use dotenv or ConfigService. 
// For this script, we'll try to use environment variables or fallback to defaults matching docker-compose.
const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/timeslip_hr_db',
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
    const employeeRepo = dataSource.getRepository(Employee);

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

    // 3. Create Employee User with Employee Record
    const employeeEmail = 'employee@example.com';
    let employeeUser = await userRepo.findOne({ 
      where: { email: employeeEmail },
      relations: ['employee']
    });

    if (!employeeUser) {
      console.log(`Creating employee user: ${employeeEmail}`);
      const passwordHash = await argon2.hash('password123');
      
      // First create the Employee record (employeeNumber will be auto-generated manually for seed)
      const currentYear = new Date().getFullYear();
      const initialEmployeeNumber = (currentYear * 1000) + 1; // e.g., 2025001
      
      const employeeRecord = employeeRepo.create({
        company: company,
        employeeNumber: initialEmployeeNumber,
        firstName: 'John',
        lastName: 'Doe',
        department: 'Engineering',
        position: 'Software Developer',
        employmentType: EmploymentType.DAILY,
        isActive: true,
        hiredAt: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      });
      const savedEmployee = await employeeRepo.save(employeeRecord);
      console.log(`Created employee record with number: ${savedEmployee.employeeNumber}`);
      
      // Then create the User and link to Employee
      employeeUser = userRepo.create({
        email: employeeEmail,
        passwordHash,
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        role: UserRole.EMPLOYEE,
        company: company,
        employee: savedEmployee,
        isActive: true,
      });
      await userRepo.save(employeeUser);
      console.log(`Created user linked to employee: ${employeeEmail}`);
    } else {
      console.log(`Employee user ${employeeEmail} already exists`);
      
      // Check if the user has an employee record
      if (!employeeUser.employee) {
        console.log(`Creating employee record for existing user: ${employeeEmail}`);
        
        // Create the Employee record (employeeNumber will be auto-generated manually for seed)
        const currentYear = new Date().getFullYear();
        const initialEmployeeNumber = (currentYear * 1000) + 1; // e.g., 2025001

        const employeeRecord = employeeRepo.create({
          company: company,
          employeeNumber: initialEmployeeNumber,
          firstName: employeeUser.firstName || 'John',
          lastName: employeeUser.lastName || 'Doe',
          department: 'Engineering',
          position: 'Software Developer',
          employmentType: EmploymentType.DAILY,
          isActive: true,
          hiredAt: new Date().toISOString().split('T')[0],
        });
        const savedEmployee = await employeeRepo.save(employeeRecord);
        console.log(`Created employee record with number: ${savedEmployee.employeeNumber}`);
        
        // Link the employee to the user
        employeeUser.employee = savedEmployee;
        await userRepo.save(employeeUser);
        console.log(`Linked employee record to user: ${employeeEmail}`);
      } else {
        console.log(`Employee record already linked to user: ${employeeEmail}`);
      }
    }

    // 4. Create PayPeriod (logic placeholder)
    const compensationRepo = dataSource.getRepository(EmployeeCompensation);
    
    
    // Add Compensation for John Doe if not exists
    if (employeeUser && employeeUser.employee) {
        const existingComp = await compensationRepo.findOneBy({ employeeId: employeeUser.employee.id });
        if (!existingComp) {
            console.log('Creating initial compensation for John Doe');
            const comp = compensationRepo.create({
                employee: employeeUser.employee,
                type: CompensationType.DAILY,
                dailyRate: 200.00,
                effectiveFrom: new Date().toISOString().split('T')[0],
            });
            await compensationRepo.save(comp);
            console.log('✅ Created compensation record');
        }
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
