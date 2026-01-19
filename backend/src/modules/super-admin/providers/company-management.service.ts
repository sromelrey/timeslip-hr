import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '@/entities/company.entity';
import { User } from '@/entities/user.entity';
import { UserRole } from '@/types/enums';
import * as argon2 from 'argon2';
import { CreateCompanyDto } from '../dtos/create-company.dto';
import { CreateCompanyAdminDto } from '../dtos/create-company-admin.dto';

@Injectable()
export class CompanyManagementService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<Company[]> {
    return this.companyRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.companyRepo.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async create(dto: CreateCompanyDto): Promise<Company> {
    const existing = await this.companyRepo.findOne({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException(`Company with name "${dto.name}" already exists`);
    }

    const company = this.companyRepo.create(dto);
    return this.companyRepo.save(company);
  }

  async update(id: number, dto: Partial<CreateCompanyDto>): Promise<Company> {
    const company = await this.findOne(id);
    
    if (dto.name && dto.name !== company.name) {
      const existing = await this.companyRepo.findOne({ where: { name: dto.name } });
      if (existing) {
        throw new ConflictException(`Company with name "${dto.name}" already exists`);
      }
    }

    Object.assign(company, dto);
    return this.companyRepo.save(company);
  }

  async remove(id: number): Promise<void> {
    const company = await this.findOne(id);
    await this.companyRepo.softRemove(company);
  }

  async createCompanyAdmin(companyId: number, dto: CreateCompanyAdminDto): Promise<any> {
    const company = await this.findOne(companyId);

    const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException(`User with email "${dto.email}" already exists`);
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = this.userRepo.create({
      email: dto.email,
      passwordHash,
      displayName: `${dto.firstName} ${dto.lastName}`,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: UserRole.ADMIN,
      companyId: company.id,
      isActive: true,
    });

    const savedUser = await this.userRepo.save(user);

    // Return sanitized user
    const { passwordHash: _, refreshToken: __, ...result } = savedUser;
    return result;
  }
}
