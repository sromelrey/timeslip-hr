import { DataSource } from 'typeorm';
import { Seeder } from './seed.config';
import { Company } from '../../entities/company.entity';

export const CompanySeeder: Seeder = {
  name: 'CompanySeeder',

  async run(dataSource: DataSource): Promise<void> {
    const companyRepo = dataSource.getRepository(Company);
    const companyName = 'Acme Corp';

    let company = await companyRepo.findOne({ where: { name: companyName } });

    if (!company) {
      console.log(`  Creating company: ${companyName}`);
      company = companyRepo.create({ name: companyName });
      await companyRepo.save(company);
      console.log(`  ✅ Created company: ${companyName}`);
    } else {
      console.log(`  ⏭️  Company "${companyName}" already exists`);
    }
  },
};
