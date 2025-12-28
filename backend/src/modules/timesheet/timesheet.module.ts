import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimesheetController } from './timesheet.controller';
import { TimesheetService } from './timesheet.service';
import { Timesheet } from '../../entities/timesheet.entity';
import { TimesheetDay } from '../../entities/timesheet-day.entity';
import { PayPeriod } from '../../entities/pay-period.entity';
import { Employee } from '../../entities/employee.entity';
import { TimeEvent } from '../../entities/time-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Timesheet, TimesheetDay, PayPeriod, Employee, TimeEvent])],
  controllers: [TimesheetController],
  providers: [TimesheetService],
})
export class TimesheetModule {}

