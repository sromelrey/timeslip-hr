import {
  IsDateString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsEnum,
} from 'class-validator';

export class AttendanceSummaryDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsInt()
  departmentId?: number;

  @IsOptional()
  @IsInt()
  costCenterId?: number;

  @IsOptional()
  @IsBoolean()
  includeAnomalies?: boolean;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
