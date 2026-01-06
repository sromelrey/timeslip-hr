import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deduction } from '@/entities/deduction.entity';
import {
  DeductionType,
  DeductionCalculationType,
} from '@/types/enums';

export interface CreateDeductionDto {
  employeeId: number;
  type: DeductionType;
  label: string;
  calculationType: DeductionCalculationType;
  amount: number;
  effectiveFrom?: string;
  effectiveUntil?: string;
  isActive?: boolean;
}

export interface UpdateDeductionDto {
  type?: DeductionType;
  label?: string;
  calculationType?: DeductionCalculationType;
  amount?: number;
  effectiveFrom?: string;
  effectiveUntil?: string;
  isActive?: boolean;
}

export interface CalculatedDeduction {
  code: string;
  label: string;
  amount: number;
}

@Injectable()
export class DeductionService {
  constructor(
    @InjectRepository(Deduction)
    private readonly deductionRepo: Repository<Deduction>,
  ) {}

  async create(
    companyId: number,
    dto: CreateDeductionDto,
  ): Promise<Deduction> {
    // Note: We should verify that the employee belongs to this company
    // For now, we'll create the deduction directly
    const deduction = this.deductionRepo.create({
      employeeId: dto.employeeId,
      type: dto.type,
      label: dto.label,
      calculationType: dto.calculationType,
      amount: dto.amount,
      effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : null,
      effectiveUntil: dto.effectiveUntil ? new Date(dto.effectiveUntil) : null,
      isActive: dto.isActive !== undefined ? dto.isActive : true,
    });

    return this.deductionRepo.save(deduction);
  }

  async findAll(
    companyId: number,
    employeeId?: number,
  ): Promise<Deduction[]> {
    const query = this.deductionRepo
      .createQueryBuilder('deduction')
      .leftJoinAndSelect('deduction.employee', 'employee')
      .where('employee.company_id = :companyId', { companyId })
      .orderBy('deduction.created_at', 'DESC');

    if (employeeId) {
      query.andWhere('deduction.employee_id = :employeeId', { employeeId });
    }

    return query.getMany();
  }

  async findOne(id: number, companyId: number): Promise<Deduction> {
    const deduction = await this.deductionRepo
      .createQueryBuilder('deduction')
      .leftJoinAndSelect('deduction.employee', 'employee')
      .where('deduction.id = :id', { id })
      .andWhere('employee.company_id = :companyId', { companyId })
      .getOne();

    if (!deduction) {
      throw new NotFoundException(`Deduction #${id} not found`);
    }

    return deduction;
  }

  async update(
    id: number,
    companyId: number,
    dto: UpdateDeductionDto,
  ): Promise<Deduction> {
    const deduction = await this.findOne(id, companyId);

    if (dto.type !== undefined) deduction.type = dto.type;
    if (dto.label !== undefined) deduction.label = dto.label;
    if (dto.calculationType !== undefined)
      deduction.calculationType = dto.calculationType;
    if (dto.amount !== undefined) deduction.amount = dto.amount;
    if (dto.effectiveFrom !== undefined)
      deduction.effectiveFrom = dto.effectiveFrom
        ? new Date(dto.effectiveFrom)
        : null;
    if (dto.effectiveUntil !== undefined)
      deduction.effectiveUntil = dto.effectiveUntil
        ? new Date(dto.effectiveUntil)
        : null;
    if (dto.isActive !== undefined) deduction.isActive = dto.isActive;

    return this.deductionRepo.save(deduction);
  }

  async delete(id: number, companyId: number): Promise<void> {
    const deduction = await this.findOne(id, companyId);
    await this.deductionRepo.softRemove(deduction);
  }

  /**
   * Calculate applicable deductions for an employee based on gross pay
   * @param employeeId Employee ID
   * @param grossPay Gross pay amount
   * @param payPeriodEndDate End date of the pay period (to check effective dates)
   * @returns Array of calculated deductions
   */
  async calculateDeductions(
    employeeId: number,
    grossPay: number,
    payPeriodEndDate: Date,
  ): Promise<CalculatedDeduction[]> {
    const deductions = await this.deductionRepo.find({
      where: {
        employeeId,
        isActive: true,
      },
    });

    const calculated: CalculatedDeduction[] = [];

    for (const deduction of deductions) {
      // Check if deduction is within effective date range
      if (deduction.effectiveFrom && deduction.effectiveFrom > payPeriodEndDate) {
        continue; // Not yet effective
      }

      if (
        deduction.effectiveUntil &&
        deduction.effectiveUntil < payPeriodEndDate
      ) {
        continue; // No longer effective
      }

      let amount = 0;

      if (deduction.calculationType === DeductionCalculationType.FIXED) {
        amount = deduction.amount;
      } else if (
        deduction.calculationType === DeductionCalculationType.PERCENTAGE
      ) {
        amount = (grossPay * deduction.amount) / 100;
      }

      // Round to 2 decimal places
      amount = Math.round(amount * 100) / 100;

      calculated.push({
        code: deduction.type,
        label: deduction.label,
        amount,
      });
    }

    return calculated;
  }
}
