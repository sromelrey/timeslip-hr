import { IsEnum, IsNumber, IsOptional, IsDateString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CompensationType } from '@/entities/employee-compensation.entity';

export class CreateCompensationDto {
  @ApiProperty({ enum: CompensationType })
  @IsEnum(CompensationType)
  type: CompensationType;

  @ApiProperty({ required: false })
  @ValidateIf(o => o.type === CompensationType.HOURLY)
  @IsNumber()
  hourlyRate?: number;

  @ApiProperty({ required: false })
  @ValidateIf(o => o.type === CompensationType.DAILY)
  @IsNumber()
  dailyRate?: number;

  @ApiProperty({ required: false })
  @ValidateIf(o => o.type === CompensationType.SALARIED)
  @IsNumber()
  monthlySalary?: number;

  @ApiProperty()
  @IsDateString()
  effectiveFrom: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  effectiveTo?: string;
}
