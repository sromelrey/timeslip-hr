import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '@/entities/company.entity';
import { User } from '@/entities/user.entity';
import { Employee } from '@/entities/employee.entity';
import { SuperAdminService } from './providers/super-admin.service';
import { CompanyManagementService } from './providers/company-management.service';
import { SuperAdminController } from './super-admin.controller';
import { CompanyManagementController } from './company-management.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Company, User, Employee])],
  providers: [SuperAdminService, CompanyManagementService],
  controllers: [SuperAdminController, CompanyManagementController],
})
export class SuperAdminModule {}
