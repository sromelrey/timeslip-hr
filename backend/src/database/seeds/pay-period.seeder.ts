import { DataSource } from 'typeorm';
import { Seeder } from './seed.config';
import { PayPeriod } from '../../entities/pay-period.entity';
import { Company } from '../../entities/company.entity';
import { PayPeriodStatus } from '../../types/enums';

export const PayPeriodSeeder: Seeder = {
  name: 'PayPeriodSeeder',

  async run(dataSource: DataSource): Promise<void> {
    const payPeriodRepo = dataSource.getRepository(PayPeriod);
    const companyRepo = dataSource.getRepository(Company);

    // Get the default company
    const company = await companyRepo.findOne({ where: { name: 'Acme Corp' } });
    if (!company) {
      console.log('  ❌ Company not found. Run CompanySeeder first.');
      return;
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const startDateStr = startOfMonth.toISOString().split('T')[0];
    const endDateStr = endOfMonth.toISOString().split('T')[0];

    let payPeriod = await payPeriodRepo.findOne({
      where: { companyId: company.id, startDate: startDateStr, endDate: endDateStr },
    });

    if (!payPeriod) {
      console.log(`  Creating pay period: ${startDateStr} to ${endDateStr}`);
      payPeriod = payPeriodRepo.create({
        company: company,
        startDate: startDateStr,
        endDate: endDateStr,
        status: PayPeriodStatus.OPEN,
      });
      await payPeriodRepo.save(payPeriod);
      console.log(`  ✅ Created pay period ID: ${payPeriod.id}`);
    } else {
      console.log(`  ⏭️  Pay period ${startDateStr} to ${endDateStr} already exists (ID: ${payPeriod.id})`);
    }
  },
};
