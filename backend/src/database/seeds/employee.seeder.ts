import { DataSource } from 'typeorm';
import * as argon2 from 'argon2';
import { Seeder } from './seed.config';
import { User } from '../../entities/user.entity';
import { Employee } from '../../entities/employee.entity';
import { Company } from '../../entities/company.entity';
import { UserRole, EmploymentType } from '../../types/enums';

interface EmployeeSeedData {
  companyName: string;
  email: string;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  password?: string;
  role?: UserRole;
}

export const EmployeeSeeder: Seeder = {
  name: 'EmployeeSeeder',

  async run(dataSource: DataSource): Promise<void> {
    const userRepo = dataSource.getRepository(User);
    const employeeRepo = dataSource.getRepository(Employee);
    const companyRepo = dataSource.getRepository(Company);

    const employeesToSeed: EmployeeSeedData[] = [
      {
        companyName: 'Acme Corp',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        department: 'Engineering',
        position: 'Software Developer',
      },
      {
        companyName: 'Tech Solutions Inc.',
        email: 'alice.tech@example.com',
        firstName: 'Alice',
        lastName: 'Tech',
        department: 'Development',
        position: 'Senior Engineer',
        role: UserRole.ADMIN,
      },
      {
        companyName: 'Startup Hub',
        email: 'bob.startup@example.com',
        firstName: 'Bob',
        lastName: 'Startup',
        department: 'Product',
        position: 'Product Manager',
        role: UserRole.ADMIN,
      }
    ];

    const currentYear = new Date().getFullYear();
    const passwordHash = await argon2.hash('Password123!');

    for (const data of employeesToSeed) {
      // Find company
      const company = await companyRepo.findOne({ where: { name: data.companyName } });
      if (!company) {
        console.log(`  ❌ Company "${data.companyName}" not found. skipping employee ${data.email}.`);
        continue;
      }

      // Check if user already exists
      let employeeUser = await userRepo.findOne({
        where: { email: data.email },
        relations: ['employee'],
      });

      if (!employeeUser) {
        console.log(`  Creating employee user: ${data.email}`);
        
        let employeeRecord: Employee | null = null;
        
        // Check if employee already exists by name/company to avoid duplicates if email changed
        employeeRecord = await employeeRepo.findOne({
          where: { 
            firstName: data.firstName, 
            lastName: data.lastName, 
            companyId: company.id 
          }
        });

        if (!employeeRecord) {
          const randomSuffix = Math.floor(1000 + Math.random() * 9000); 
          const employeeNumber = parseInt(`${currentYear}${randomSuffix}`);

          employeeRecord = employeeRepo.create({
            company: company,
            employeeNumber: employeeNumber,
            firstName: data.firstName,
            lastName: data.lastName,
            department: data.department,
            position: data.position,
            employmentType: EmploymentType.DAILY,
            isActive: true,
            hiredAt: new Date().toISOString().split('T')[0],
          });
          employeeRecord = await employeeRepo.save(employeeRecord);
          console.log(`  ✅ Created employee #${employeeRecord.employeeNumber} for ${data.companyName}`);
        } else {
          console.log(`  ⏭️  Employee ${data.firstName} ${data.lastName} already exists`);
        }

        // Create User and link to Employee
        employeeUser = userRepo.create({
          email: data.email,
          passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: `${data.firstName} ${data.lastName}`,
          role: data.role || UserRole.EMPLOYEE,
          company: company,
          employee: employeeRecord,
          isActive: true,
        });
        await userRepo.save(employeeUser);
        console.log(`  ✅ Created user linked to employee: ${data.email}`);
      } else {
        // Update password and roles for existing users to match new standards
        employeeUser.passwordHash = passwordHash;
        employeeUser.role = data.role || UserRole.EMPLOYEE;
        await userRepo.save(employeeUser);
        console.log(`  ⏭️  Employee user "${data.email}" updated with new password/role`);
      }
    }
  },
};
