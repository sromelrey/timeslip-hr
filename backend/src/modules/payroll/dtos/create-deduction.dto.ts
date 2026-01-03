import {
  IsEnum,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  DeductionType,
  DeductionCalculationType,
} from '@/types/enums';

export class CreateDeductionDto {
  @ApiProperty({ description: 'Employee ID' })
  @IsNumber()
  employeeId: number;

  @ApiProperty({ enum: DeductionType, description: 'Type of deduction' })
  @IsEnum(DeductionType)
  type: DeductionType;

  @ApiProperty({ description: 'Display label for the deduction' })
  @IsString()
  label: string;

  @ApiProperty({
    enum: DeductionCalculationType,
    description: 'Calculation method (FIXED or PERCENTAGE)',
  })
  @IsEnum(DeductionCalculationType)
  calculationType: DeductionCalculationType;

  @ApiProperty({ description: 'Amount (fixed value or percentage)' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Effective from date', required: false })
  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @ApiProperty({ description: 'Effective until date', required: false })
  @IsOptional()
  @IsDateString()
  effectiveUntil?: string;

  @ApiProperty({ description: 'Is deduction active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
