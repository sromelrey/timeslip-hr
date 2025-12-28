import { DataSource } from 'typeorm';
import * as argon2 from 'argon2';
import { Seeder } from './seed.config';
import { User } from '../../entities/user.entity';
import { Employee } from '../../entities/employee.entity';
import { Company } from '../../entities/company.entity';
import { UserRole, EmploymentType } from '../../types/enums';

export const EmployeeSeeder: Seeder = {
  name: 'EmployeeSeeder',

  async run(dataSource: DataSource): Promise<void> {
    const userRepo = dataSource.getRepository(User);
    const employeeRepo = dataSource.getRepository(Employee);
    const companyRepo = dataSource.getRepository(Company);

    // Get the default company
    const company = await companyRepo.findOne({ where: { name: 'Acme Corp' } });
    if (!company) {
      console.log('  ❌ Company not found. Run CompanySeeder first.');
      return;
    }

    const employeeEmail = 'employee@example.com';
    let employeeUser = await userRepo.findOne({
      where: { email: employeeEmail },
      relations: ['employee'],
    });

    if (!employeeUser) {
      console.log(`  Creating employee user: ${employeeEmail}`);
      const passwordHash = await argon2.hash('password123');

      // Generate employee number
      const currentYear = new Date().getFullYear();
      const initialEmployeeNumber = currentYear * 1000 + 1; // e.g., 2025001

      const employeeRecord = employeeRepo.create({
        company: company,
        employeeNumber: initialEmployeeNumber,
        firstName: 'John',
        lastName: 'Doe',
        department: 'Engineering',
        position: 'Software Developer',
        employmentType: EmploymentType.DAILY,
        isActive: true,
        hiredAt: new Date().toISOString().split('T')[0],
      });
      const savedEmployee = await employeeRepo.save(employeeRecord);
      console.log(`  ✅ Created employee #${savedEmployee.employeeNumber}`);

      // Create User and link to Employee
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
      console.log(`  ✅ Created user linked to employee: ${employeeEmail}`);
    } else if (!employeeUser.employee) {
      console.log(`  Creating employee record for existing user: ${employeeEmail}`);

      const currentYear = new Date().getFullYear();
      const initialEmployeeNumber = currentYear * 1000 + 1;

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

      employeeUser.employee = savedEmployee;
      await userRepo.save(employeeUser);
      console.log(`  ✅ Linked employee #${savedEmployee.employeeNumber} to user`);
    } else {
      console.log(`  ⏭️  Employee user "${employeeEmail}" already exists`);
    }
  },
};
