import {
  IsOptional,
  IsInt,
  IsDateString,
  IsEnum,
  IsString,
} from 'class-validator';
import { TimesheetStatus } from '@/types/enums';

export class TimesheetExportDto {
  @IsOptional()
  @IsInt()
  employeeId?: number;

  @IsOptional()
  @IsInt()
  departmentId?: number;

  @IsOptional()
  @IsInt()
  costCenterId?: number;

  @IsOptional()
  @IsInt()
  payPeriodId?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(TimesheetStatus)
  status?: TimesheetStatus;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  sortBy?: 'employeeName' | 'date' | 'totalHours';
}
