import { DataSource } from 'typeorm';
import { Seeder } from './seed.config';
import { EmployeeCompensation } from '../../entities/employee-compensation.entity';
import { User } from '../../entities/user.entity';
import { CompensationType } from '../../types/enums';

export const CompensationSeeder: Seeder = {
  name: 'CompensationSeeder',

  async run(dataSource: DataSource): Promise<void> {
    const compensationRepo = dataSource.getRepository(EmployeeCompensation);
    const userRepo = dataSource.getRepository(User);

    // Get the employee user
    const employeeUser = await userRepo.findOne({
      where: { email: 'employee@example.com' },
      relations: ['employee'],
    });

    if (!employeeUser?.employee) {
      console.log('  ❌ Employee not found. Run EmployeeSeeder first.');
      return;
    }

    const existingComp = await compensationRepo.findOneBy({ employeeId: employeeUser.employee.id });

    if (!existingComp) {
      console.log('  Creating compensation for John Doe');
      const comp = compensationRepo.create({
        employee: employeeUser.employee,
        type: CompensationType.DAILY,
        dailyRate: 200.0,
        effectiveFrom: new Date().toISOString().split('T')[0],
      });
      await compensationRepo.save(comp);
      console.log('  ✅ Created compensation record');
    } else {
      console.log('  ⏭️  Compensation record already exists');
    }
  },
};
