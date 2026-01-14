import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '@/entities/company.entity';
import { User } from '@/entities/user.entity';
import { Employee } from '@/entities/employee.entity';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  async getGlobalStats() {
    const [totalCompanies, totalUsers, totalEmployees] = await Promise.all([
      this.companyRepo.count(),
      this.userRepo.count(),
      this.employeeRepo.count(),
    ]);

    return {
      totalCompanies,
      totalUsers,
      totalEmployees,
    };
  }
}
