import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './providers/reports.service';
import { Timesheet } from '@/entities/timesheet.entity';
import { TimeEvent } from '@/entities/time-event.entity';
import { Employee } from '@/entities/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Timesheet,
      TimeEvent,
      Employee,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
