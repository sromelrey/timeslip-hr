import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayPeriod } from '@/entities/pay-period.entity';
import { Payslip } from '@/entities/payslip.entity';
import { PayslipItem } from '@/entities/payslip-item.entity';
import { Employee } from '@/entities/employee.entity';
import { Company } from '@/entities/company.entity';
import { Deduction } from '@/entities/deduction.entity';
import { Timesheet } from '@/entities/timesheet.entity';
import { TimesheetDay } from '@/entities/timesheet-day.entity';
import { EmployeeCompensation } from '@/entities/employee-compensation.entity';
import { PayPeriodService } from './providers/pay-period.service';
import { PayrollService } from './providers/payroll.service';
import { PayslipService } from './providers/payslip.service';
import { PayslipPdfService } from './providers/payslip-pdf.service';
import { PayslipExportService } from './providers/payslip-export.service';
import { DeductionService } from './providers/deduction.service';
import { PayrollController } from './payroll.controller';
import { DeductionController } from './deduction.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PayPeriod,
      Payslip,
      PayslipItem,
      Employee,
      Company,
      Deduction,
      Timesheet,
      TimesheetDay,
      EmployeeCompensation,
    ]),
  ],
  controllers: [PayrollController, DeductionController],
  providers: [PayPeriodService, PayrollService, PayslipService, PayslipPdfService, DeductionService, PayslipExportService],
  exports: [PayPeriodService, PayrollService, PayslipService, PayslipPdfService, DeductionService, PayslipExportService],
})
export class PayrollModule {}
