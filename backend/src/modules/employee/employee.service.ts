import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { Employee } from '@/entities/employee.entity';
import { EmployeeCompensation } from '@/entities/employee-compensation.entity';
import { CompensationType } from '@/types/enums';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dtos';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(EmployeeCompensation)
    private readonly compensationRepo: Repository<EmployeeCompensation>,
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.employeeRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepo.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    // Auto-generate employee number in format YYYY### (e.g., 2025001, 2025100)
    const currentYear = new Date().getFullYear();
    const yearPrefix = currentYear * 1000; // e.g., 2025000
    const yearMax = yearPrefix + 999;      // e.g., 2025999
    
    const maxEmployee = await this.employeeRepo
      .createQueryBuilder('employee')
      .where('employee.companyId = :companyId', { companyId: dto.companyId })
      .andWhere('employee.employeeNumber >= :yearPrefix', { yearPrefix })
      .andWhere('employee.employeeNumber <= :yearMax', { yearMax })
      .orderBy('employee.employeeNumber', 'DESC')
      .getOne();
    
    // If there are employees for this year, increment; otherwise start at YYYY001
    const nextEmployeeNumber = maxEmployee 
      ? maxEmployee.employeeNumber + 1 
      : yearPrefix + 1; // e.g., 2025001
    
    const employee = this.employeeRepo.create({
      ...dto,
      employeeNumber: nextEmployeeNumber,
    });
    const savedEmployee = await this.employeeRepo.save(employee);

    // Create initial compensation if rate is provided
    if (dto.rate) {
        const comp = this.compensationRepo.create({
            employee: savedEmployee,
            type: dto.employmentType as unknown as CompensationType, // Assuming keys match
            effectiveFrom: dto.hiredAt || new Date().toISOString().split('T')[0],
        });

        if (dto.employmentType === 'HOURLY') {
            comp.hourlyRate = dto.rate;
        } else if (dto.employmentType === 'DAILY') {
            comp.dailyRate = dto.rate;
        } else if (dto.employmentType === 'SALARIED') {
            comp.monthlySalary = dto.rate;
        }

        await this.compensationRepo.save(comp);
    }

    return savedEmployee;
  }

  async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    Object.assign(employee, dto);
    return this.employeeRepo.save(employee);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeeRepo.softRemove(employee);
  }

  async findByEmployeeNumber(employeeNumber: number): Promise<Employee | null> {
    return this.employeeRepo.findOne({ where: { employeeNumber } });
  }

  async setPin(id: number, pin: string): Promise<void> {
    const employee = await this.findOne(id);
    employee.pinHash = await argon2.hash(pin);
    await this.employeeRepo.save(employee);
  }

  async validatePin(employee: Employee, pin: string): Promise<boolean> {
    if (!employee.pinHash) return false;
    return argon2.verify(employee.pinHash, pin);
  }
}
