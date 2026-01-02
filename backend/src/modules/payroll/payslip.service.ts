import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payslip } from '@/entities/payslip.entity';
import { PayslipItem } from '@/entities/payslip-item.entity';
import { PayPeriod } from '@/entities/pay-period.entity';
import { Employee } from '@/entities/employee.entity';
import { PayslipStatus, PayslipItemType } from '@/types/enums';
import { PayrollService } from './payroll.service';
import { GeneratePayslipsDto } from './dtos/generate-payslips.dto';

@Injectable()
export class PayslipService {
  constructor(
    @InjectRepository(Payslip)
    private readonly payslipRepo: Repository<Payslip>,
    @InjectRepository(PayslipItem)
    private readonly payslipItemRepo: Repository<PayslipItem>,
    @InjectRepository(PayPeriod)
    private readonly payPeriodRepo: Repository<PayPeriod>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    private readonly payrollService: PayrollService,
  ) {}

  async findAll(companyId: number, payPeriodId?: number): Promise<Payslip[]> {
    const query = this.payslipRepo
      .createQueryBuilder('ps')
      .leftJoinAndSelect('ps.employee', 'employee')
      .leftJoinAndSelect('ps.payPeriod', 'payPeriod')
      .leftJoinAndSelect('ps.items', 'items')
      .where('employee.company_id = :companyId', { companyId })
      .orderBy('ps.created_at', 'DESC');

    if (payPeriodId) {
      query.andWhere('ps.pay_period_id = :payPeriodId', { payPeriodId });
    }

    return query.getMany();
  }

  async findOne(id: number, companyId: number): Promise<Payslip> {
    const payslip = await this.payslipRepo
      .createQueryBuilder('ps')
      .leftJoinAndSelect('ps.employee', 'employee')
      .leftJoinAndSelect('ps.payPeriod', 'payPeriod')
      .leftJoinAndSelect('ps.items', 'items')
      .leftJoinAndSelect('ps.generatedByUser', 'generatedByUser')
      .where('ps.id = :id', { id })
      .andWhere('employee.company_id = :companyId', { companyId })
      .getOne();

    if (!payslip) {
      throw new NotFoundException(`Payslip #${id} not found`);
    }

    return payslip;
  }

  async generate(
    companyId: number,
    dto: GeneratePayslipsDto,
    userId: number,
  ): Promise<Payslip[]> {
    const { payPeriodId, employeeIds } = dto;

    // Verify pay period exists
    const payPeriod = await this.payPeriodRepo.findOne({
      where: { id: payPeriodId, companyId },
    });

    if (!payPeriod) {
      throw new NotFoundException(`Pay period #${payPeriodId} not found`);
    }

    // Check if payslips already exist for this period
    const existing = await this.payslipRepo.find({
      where: { payPeriodId },
    });

    if (existing.length > 0 && !employeeIds) {
      throw new BadRequestException(
        `Payslips already exist for pay period #${payPeriodId}. Use employeeIds to generate for specific employees.`
      );
    }

    // Calculate payroll for period
    const calculations = await this.payrollService.calculatePayForPeriod(
      payPeriodId,
      companyId,
      employeeIds,
    );

    if (calculations.length === 0) {
      throw new BadRequestException(
        'No timesheets found for the selected criteria. Generate timesheets first.'
      );
    }

    const payslips: Payslip[] = [];

    for (const calc of calculations) {
      // Check if payslip already exists for this employee
      const existingPayslip = await this.payslipRepo.findOne({
        where: {
          employeeId: calc.employeeId,
          payPeriodId,
        },
      });

      if (existingPayslip) {
        console.log(
          `Payslip already exists for employee #${calc.employeeId}, skipping...`
        );
        continue;
      }

      // Create payslip
      const payslip = this.payslipRepo.create({
        employeeId: calc.employeeId,
        payPeriodId,
        status: PayslipStatus.DRAFT,
        totalRegularMinutes: calc.totalRegularMinutes,
        totalOvertimeMinutes: calc.totalOvertimeMinutes,
        grossPay: calc.grossPay,
        totalDeductions: 0, // No deductions for now
        netPay: calc.grossPay, // Net = Gross if no deductions
        generatedByUserId: userId,
        generatedAt: new Date(),
        currency: 'PHP', // Default currency
      });

      const savedPayslip = await this.payslipRepo.save(payslip);

      // Create earnings item
      const earningsItem = this.payslipItemRepo.create({
        payslipId: savedPayslip.id,
        type: PayslipItemType.EARNING,
        code: 'BASIC_PAY',
        label: 'Basic Pay',
        amount: calc.grossPay,
        metaJson: JSON.stringify({
          totalRegularMinutes: calc.totalRegularMinutes,
          totalOvertimeMinutes: calc.totalOvertimeMinutes,
          hourlyRate: calc.hourlyRate,
          dailyRate: calc.dailyRate,
          monthlySalary: calc.monthlySalary,
          daysWorked: calc.daysWorked,
        }),
      });

      await this.payslipItemRepo.save(earningsItem);

      payslips.push(savedPayslip);
    }

    return payslips;
  }

  async finalize(id: number, userId: number, companyId: number): Promise<Payslip> {
    const payslip = await this.findOne(id, companyId);

    if (payslip.status === PayslipStatus.FINALIZED) {
      throw new BadRequestException('Payslip is already finalized');
    }

    if (payslip.status === PayslipStatus.VOID) {
      throw new BadRequestException('Cannot finalize a voided payslip');
    }

    payslip.status = PayslipStatus.FINALIZED;
    payslip.finalizedAt = new Date();

    return this.payslipRepo.save(payslip);
  }

  async void(id: number, userId: number, companyId: number): Promise<Payslip> {
    const payslip = await this.findOne(id, companyId);

    if (payslip.status === PayslipStatus.VOID) {
      throw new BadRequestException('Payslip is already voided');
    }

    payslip.status = PayslipStatus.VOID;
    payslip.voidedAt = new Date();
    payslip.voidedByUserId = userId;

    return this.payslipRepo.save(payslip);
  }
}
