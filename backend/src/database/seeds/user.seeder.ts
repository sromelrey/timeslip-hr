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

    const allCompanies = await companyRepo.find();
    
    // Create Global Admin for Acme Corp (First company)
    const acme = allCompanies.find(c => c.name === 'Acme Corp');
    
    // Create Super Admin (Global)
    const superAdminEmail = 'superadmin@example.com';
    let superAdmin = await userRepo.findOne({ where: { email: superAdminEmail } });
    if (!superAdmin) {
      console.log(`  Creating super admin: ${superAdminEmail}`);
      const passwordHash = await argon2.hash('password123');
      superAdmin = userRepo.create({
        email: superAdminEmail,
        passwordHash,
        firstName: 'Super',
        lastName: 'Admin',
        displayName: 'Super Admin',
        role: UserRole.SUPER_ADMIN,
        isActive: true,
      });
      await userRepo.save(superAdmin);
      console.log(`  ✅ Created super admin: ${superAdminEmail}`);
    }

    if (acme) {
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
          company: acme,
          isActive: true,
        });
        await userRepo.save(admin);
        console.log(`  ✅ Created admin: ${adminEmail}`);
      }
    }

    // Create Kiosk Users for all companies
    const kioskPasswordHash = await argon2.hash('kiosk123');

    for (const targetCompany of allCompanies) {
      // Create a slug for the email
      const slug = targetCompany.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const kioskEmail = `kiosk@${slug}.com`;
      
      let kioskUser = await userRepo.findOne({ where: { email: kioskEmail } });

      if (!kioskUser) {
        console.log(`  Creating kiosk user for ${targetCompany.name}: ${kioskEmail}`);
        kioskUser = userRepo.create({
          email: kioskEmail,
          passwordHash: kioskPasswordHash,
          firstName: targetCompany.name,
          lastName: 'Kiosk',
          displayName: `${targetCompany.name} Kiosk`,
          role: UserRole.KIOSK,
          company: targetCompany,
          isActive: true,
        });
        await userRepo.save(kioskUser);
        console.log(`  ✅ Created kiosk: ${kioskEmail}`);
      } else {
        // Ensure it has the KIOSK role even if it existed before with a different role
        if (kioskUser.role !== UserRole.KIOSK) {
          kioskUser.role = UserRole.KIOSK;
          await userRepo.save(kioskUser);
        }
        console.log(`  ⏭️  Kiosk "${kioskEmail}" already exists`);
      }
    }
  },
};
