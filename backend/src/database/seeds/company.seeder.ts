import { DataSource } from 'typeorm';
import { Seeder } from './seed.config';
import { Company } from '../../entities/company.entity';

export const CompanySeeder: Seeder = {
  name: 'CompanySeeder',

  async run(dataSource: DataSource): Promise<void> {
    const companyRepo = dataSource.getRepository(Company);
    
    // Define companies to seed
    const companiesToSeed = [
      { name: 'Acme Corp' },
      { name: 'Tech Solutions Inc.' },
      { name: 'Startup Hub' }
    ];

    for (const companyData of companiesToSeed) {
      let company = await companyRepo.findOne({ where: { name: companyData.name } });

      if (!company) {
        console.log(`  Creating company: ${companyData.name}`);
        company = companyRepo.create(companyData);
        await companyRepo.save(company);
        console.log(`  ✅ Created company: ${companyData.name}`);
      } else {
        console.log(`  ⏭️  Company "${companyData.name}" already exists`);
      }
    }
  },
};
