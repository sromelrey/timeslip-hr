import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeEvent } from '@/entities/time-event.entity';
import { Employee } from '@/entities/employee.entity';
import { TimeEventService } from './time-event.service';
import { TimeEventController } from './time-event.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TimeEvent, Employee])],
  controllers: [TimeEventController],
  providers: [TimeEventService],
  exports: [TimeEventService],
})
export class TimeEventModule {}
