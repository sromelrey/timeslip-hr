import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayPeriod } from '@/entities/pay-period.entity';
import { Payslip } from '@/entities/payslip.entity';
import { PayslipItem } from '@/entities/payslip-item.entity';
import { Employee } from '@/entities/employee.entity';
import { Timesheet } from '@/entities/timesheet.entity';
import { TimesheetDay } from '@/entities/timesheet-day.entity';
import { EmployeeCompensation } from '@/entities/employee-compensation.entity';
import { PayPeriodService } from './pay-period.service';
import { PayrollService } from './payroll.service';
import { PayslipService } from './payslip.service';
import { PayrollController } from './payroll.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PayPeriod,
      Payslip,
      PayslipItem,
      Employee,
      Timesheet,
      TimesheetDay,
      EmployeeCompensation,
    ]),
  ],
  controllers: [PayrollController],
  providers: [PayPeriodService, PayrollService, PayslipService],
  exports: [PayPeriodService, PayrollService, PayslipService],
})
export class PayrollModule {}
