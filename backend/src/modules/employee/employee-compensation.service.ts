import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeCompensation, CompensationType } from '@/entities/employee-compensation.entity';
import { Employee } from '@/entities/employee.entity';
import { CreateCompensationDto } from './dtos/create-compensation.dto';

@Injectable()
export class EmployeeCompensationService {
  constructor(
    @InjectRepository(EmployeeCompensation)
    private readonly compensationRepo: Repository<EmployeeCompensation>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  async create(employeeId: number, dto: CreateCompensationDto) {
    const employee = await this.employeeRepo.findOneBy({ id: employeeId });
    if (!employee) {
      throw new NotFoundException(`Employee #${employeeId} not found`);
    }

    // Close current compensation if exists
    // Logic: Find the latest active compensation and set its effectiveTo to one day before new effectiveFrom
    // OR just use null effectiveTo for current.
    
    // For simplicity, let's just create the new record. 
    // In a real app, we would query the current active one and close it.
    
    // Check for overlap or active record
    const activeCompensation = await this.compensationRepo.findOne({
        where: { employeeId, effectiveTo: undefined }, // Assuming null means active indefinitely
        order: { effectiveFrom: 'DESC' }
    });
    
    if (activeCompensation) {
        // Close it day before new one starts
        const newEffectiveDate = new Date(dto.effectiveFrom);
        const closeDate = new Date(newEffectiveDate);
        closeDate.setDate(closeDate.getDate() - 1);
        
        activeCompensation.effectiveTo = closeDate.toISOString().split('T')[0];
        await this.compensationRepo.save(activeCompensation);
    }

    const compensation = this.compensationRepo.create({
      employeeId,
      ...dto,
    });

    return this.compensationRepo.save(compensation);
  }

  async getHistory(employeeId: number) {
    return this.compensationRepo.find({
      where: { employeeId },
      order: { effectiveFrom: 'DESC' },
    });
  }

  async getCurrent(employeeId: number) {
    // Basic logic: find one with no effectiveTo or effectiveTo > today
    // Or just sort by date desc and take first.
    return this.compensationRepo.findOne({
      where: { employeeId },
      order: { effectiveFrom: 'DESC' },
    });
  }
}
