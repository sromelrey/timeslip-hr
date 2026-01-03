import { DataSource } from 'typeorm';
import { Seeder } from './seed.config';
import { Deduction } from '../../entities/deduction.entity';
import { Employee } from '../../entities/employee.entity';
import { Company } from '../../entities/company.entity';
import { DeductionType, DeductionCalculationType } from '../../types/enums';

export const DeductionSeeder: Seeder = {
  name: 'DeductionSeeder',

  async run(dataSource: DataSource): Promise<void> {
    const deductionRepo = dataSource.getRepository(Deduction);
    const employeeRepo = dataSource.getRepository(Employee);
    const companyRepo = dataSource.getRepository(Company);

    // Get "Tech Solutions Inc." company
    const targetCompany = await companyRepo.findOne({ where: { name: 'Tech Solutions Inc.' } });
    
    if (!targetCompany) {
      console.log('  ❌ Company "Tech Solutions Inc." not found. Skipping DeductionSeeder.');
      return;
    }

    // Get employees of this company
    const employees = await employeeRepo.find({
      where: { company: { id: targetCompany.id } },
    });

    if (employees.length === 0) {
      console.log('  ❌ No employees found for Tech Solutions Inc.');
      return;
    }

    const standardDeductions = [
      {
        type: DeductionType.SSS,
        label: 'SSS Contribution',
        calculationType: DeductionCalculationType.FIXED,
        amount: 1125.00,
        isActive: true,
      },
      {
        type: DeductionType.PHILHEALTH,
        label: 'PhilHealth Contribution',
        calculationType: DeductionCalculationType.PERCENTAGE,
        amount: 2.5, // 2.5%
        isActive: true,
      },
      {
        type: DeductionType.PAGIBIG,
        label: 'Pag-IBIG Contribution',
        calculationType: DeductionCalculationType.FIXED,
        amount: 200.00,
        isActive: true,
      }
    ];

    for (const employee of employees) {
      console.log(`  Processing deductions for ${employee.firstName} ${employee.lastName}...`);
      
      for (const dedData of standardDeductions) {
        // Check if deduction already exists
        const exists = await deductionRepo.findOne({
          where: {
            employeeId: employee.id,
            type: dedData.type,
            label: dedData.label
          }
        });

        if (!exists) {
          const deduction = deductionRepo.create({
            employee: employee,
            ...dedData
          });
          await deductionRepo.save(deduction);
          console.log(`    ✅ Added ${dedData.label} (${dedData.calculationType === 'FIXED' ? '₱' + dedData.amount : dedData.amount + '%'})`);
        } else {
          console.log(`    ⏭️  ${dedData.label} already exists`);
        }
      }
    }
  },
};
