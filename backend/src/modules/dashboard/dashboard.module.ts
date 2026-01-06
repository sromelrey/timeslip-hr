import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '@/entities/employee.entity';
import { TimeEvent } from '@/entities/time-event.entity';
import { Timesheet } from '@/entities/timesheet.entity';
import { Payslip } from '@/entities/payslip.entity';
import { DashboardController } from './dashboard.controller';
<<<<<<< HEAD
import { DashboardService } from './providers/dashboard.service';
=======
import { DashboardService } from './dashboard.service';
>>>>>>> 5ae84cd77ef04fa4014940b17a1fc78eac906025

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, TimeEvent, Timesheet, Payslip]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
