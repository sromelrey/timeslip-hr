import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '@/entities/employee.entity';
import { EmployeeCompensation } from '@/entities/employee-compensation.entity';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { EmployeeCompensationService } from './employee-compensation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, EmployeeCompensation])],
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeCompensationService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
