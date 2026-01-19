import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '@/entities/employee.entity';
import { TimeEvent } from '@/entities/time-event.entity';
import { Timesheet } from '@/entities/timesheet.entity';
import { Payslip } from '@/entities/payslip.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './providers/dashboard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, TimeEvent, Timesheet, Payslip]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
