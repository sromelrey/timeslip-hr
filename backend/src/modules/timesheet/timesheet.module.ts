import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimesheetController } from './timesheet.controller';
import { TimesheetService } from './providers/timesheet.service';
import { Timesheet } from '../../entities/timesheet.entity';
import { TimesheetDay } from '../../entities/timesheet-day.entity';
import { TimesheetAdjustment } from '../../entities/timesheet-adjustment.entity';
import { PayPeriod } from '../../entities/pay-period.entity';
import { Employee } from '../../entities/employee.entity';
import { TimeEvent } from '../../entities/time-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Timesheet, TimesheetDay, TimesheetAdjustment, PayPeriod, Employee, TimeEvent])],
  controllers: [TimesheetController],
  providers: [TimesheetService],
})
export class TimesheetModule {}

