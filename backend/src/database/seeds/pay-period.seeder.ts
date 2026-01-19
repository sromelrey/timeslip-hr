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

    // Get ALL companies to seed pay periods for everyone
    const targetCompanies = await companyRepo.find();

    if (targetCompanies.length === 0) {
      console.log('  ❌ No companies found to seed pay periods.');
      return;
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    // Use local date formatting to avoid UTC timezone conversion issues
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatLocalDate = (d: Date) => 
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    
    const startDateStr = formatLocalDate(startOfMonth);
    const endDateStr = formatLocalDate(endOfMonth);

    for (const company of targetCompanies) {
      let payPeriod = await payPeriodRepo.findOne({
        where: { companyId: company.id, startDate: startDateStr, endDate: endDateStr },
      });

      if (!payPeriod) {
        console.log(`  Creating pay period for ${company.name}: ${startDateStr} to ${endDateStr}`);
        payPeriod = payPeriodRepo.create({
          company: company,
          startDate: startDateStr,
          endDate: endDateStr,
          status: PayPeriodStatus.OPEN,
        });
        await payPeriodRepo.save(payPeriod);
        console.log(`  ✅ Created pay period ID: ${payPeriod.id}`);
      } else {
        console.log(`  ⏭️  Pay period for ${company.name} already exists (ID: ${payPeriod.id})`);
      }
    }
  },
};
