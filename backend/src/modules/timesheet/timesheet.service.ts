import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timesheet } from '../../entities/timesheet.entity';
import { PayPeriod } from '../../entities/pay-period.entity';
import { Employee } from '../../entities/employee.entity';

@Injectable()
export class TimesheetService {
  constructor(
    @InjectRepository(Timesheet)
    private readonly timesheetRepo: Repository<Timesheet>,
    @InjectRepository(PayPeriod)
    private readonly payPeriodRepo: Repository<PayPeriod>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  async findAll(companyId: number): Promise<Timesheet[]> {
    return this.timesheetRepo.find({
      where: { payPeriod: { companyId } },
      relations: ['employee', 'payPeriod'],
      order: { payPeriod: { startDate: 'DESC' }, employee: { lastName: 'ASC' } },
    });
  }

  async findOne(id: number, companyId: number): Promise<Timesheet> {
    const timesheet = await this.timesheetRepo.findOne({
      where: { id, payPeriod: { companyId } },
      relations: ['employee', 'payPeriod', 'days'],
      order: { days: { workDate: 'ASC' } }, 
    });
    if (!timesheet) {
      throw new NotFoundException(`Timesheet #${id} not found`);
    }
    return timesheet;
  }

  // Generate timesheets for a pay period if they don't exist
  async generateForPeriod(companyId: number, payPeriodId: number): Promise<Timesheet[]> {
    const payPeriod = await this.payPeriodRepo.findOneBy({ id: payPeriodId, companyId });
    if (!payPeriod) {
      throw new NotFoundException('PayPeriod not found');
    }

    const employees = await this.employeeRepo.find({ where: { companyId, isActive: true } });
    const createdTimesheets: Timesheet[] = [];

    for (const employee of employees) {
      // Check if exists
      const existing = await this.timesheetRepo.findOneBy({
        employeeId: employee.id,
        payPeriodId: payPeriod.id,
      });

      if (!existing) {
        const newTimesheet = this.timesheetRepo.create({
          employeeId: employee.id,
          payPeriodId: payPeriod.id,
          status: 'DRAFT' as any, // Use enum properly in real code
        });
        await this.timesheetRepo.save(newTimesheet);
        createdTimesheets.push(newTimesheet);
      }
    }

    return createdTimesheets;
  }
}
