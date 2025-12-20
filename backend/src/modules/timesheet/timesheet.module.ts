import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimesheetController } from './timesheet.controller';
import { TimesheetService } from './timesheet.service';
import { Timesheet } from '../../entities/timesheet.entity';
import { PayPeriod } from '../../entities/pay-period.entity';
import { Employee } from '../../entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Timesheet, PayPeriod, Employee])],
  controllers: [TimesheetController],
  providers: [TimesheetService],
})
export class TimesheetModule {}
