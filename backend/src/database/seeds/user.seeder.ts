import { DataSource } from 'typeorm';
import * as argon2 from 'argon2';
import { Seeder } from './seed.config';
import { User } from '../../entities/user.entity';
import { Company } from '../../entities/company.entity';
import { UserRole } from '../../types/enums';

export const UserSeeder: Seeder = {
  name: 'UserSeeder',

  async run(dataSource: DataSource): Promise<void> {
    const userRepo = dataSource.getRepository(User);
    const companyRepo = dataSource.getRepository(Company);

    // Get the default company
    const company = await companyRepo.findOne({ where: { name: 'Acme Corp' } });
    if (!company) {
      console.log('  ❌ Company not found. Run CompanySeeder first.');
      return;
    }

    // Create Admin User
    const adminEmail = 'admin@example.com';
    let admin = await userRepo.findOne({ where: { email: adminEmail } });

    if (!admin) {
      console.log(`  Creating admin: ${adminEmail}`);
      const passwordHash = await argon2.hash('password123');
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
      console.log(`  ✅ Created admin: ${adminEmail}`);
    } else {
      console.log(`  ⏭️  Admin "${adminEmail}" already exists`);
    }
  },
};
