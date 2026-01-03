import { DataSource } from 'typeorm';
import { Seeder } from './seed.config';
import { EmployeeCompensation } from '../../entities/employee-compensation.entity';
import { Employee } from '../../entities/employee.entity';
import { CompensationType } from '../../types/enums';

export const CompensationSeeder: Seeder = {
  name: 'CompensationSeeder',

  async run(dataSource: DataSource): Promise<void> {
    const compensationRepo = dataSource.getRepository(EmployeeCompensation);
    const employeeRepo = dataSource.getRepository(Employee);

    // Get all active employees with their user relations to identify them
    const employees = await employeeRepo.find({
      where: { isActive: true },
      relations: ['user'],
    });

    if (employees.length === 0) {
      console.log('  ❌ No employees found. Run EmployeeSeeder first.');
      return;
    }

    for (const employee of employees) {
      const existingComp = await compensationRepo.findOneBy({ employeeId: employee.id });

      if (existingComp) {
        // console.log(`  ⏭️  Compensation already exists for ${employee.firstName} ${employee.lastName}`);
        continue;
      }

      console.log(`  Creating compensation for ${employee.firstName} ${employee.lastName}...`);

      let type = CompensationType.DAILY;
      let rate = {};

      // Custom logic based on email to assign diverse types
      const email = employee.user?.email || '';

      if (email === 'alice.tech@techsolutions.com') {
        type = CompensationType.SALARIED;
        rate = { monthlySalary: 60000.00 };
      } else if (email === 'bob.startup@startuphub.com') {
        type = CompensationType.HOURLY;
        rate = { hourlyRate: 300.00 };
      } else {
        // Default (John Doe)
        type = CompensationType.DAILY;
        rate = { dailyRate: 1500.00 }; // Increased from 200 for realism
      }

      const comp = compensationRepo.create({
        employee: employee,
        type,
        effectiveFrom: new Date().toISOString().split('T')[0],
        ...rate,
      });

      await compensationRepo.save(comp);
    }
    
    console.log('  ✅ Compensation seeding completed');
  },
};
