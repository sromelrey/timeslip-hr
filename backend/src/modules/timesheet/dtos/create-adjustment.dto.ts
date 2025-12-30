import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';
import { TimesheetAdjustmentField, TimesheetAdjustmentMode } from '@/types/enums';

export class CreateAdjustmentDto {
  @ApiProperty({ enum: TimesheetAdjustmentField, description: 'Which field to adjust' })
  @IsEnum(TimesheetAdjustmentField)
  field: TimesheetAdjustmentField;

  @ApiProperty({ enum: TimesheetAdjustmentMode, description: 'DELTA (add/subtract) or OVERRIDE (set value)' })
  @IsEnum(TimesheetAdjustmentMode)
  mode: TimesheetAdjustmentMode;

  @ApiPropertyOptional({ description: 'Minutes to add/subtract (required if mode is DELTA)' })
  @ValidateIf((o) => o.mode === TimesheetAdjustmentMode.DELTA)
  @IsInt()
  @IsNotEmpty()
  deltaMinutes?: number;

  @ApiPropertyOptional({ description: 'Absolute minutes value (required if mode is OVERRIDE)' })
  @ValidateIf((o) => o.mode === TimesheetAdjustmentMode.OVERRIDE)
  @IsInt()
  @IsNotEmpty()
  overrideMinutes?: number;

  @ApiProperty({ description: 'Reason for the adjustment (min 10 characters)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Reason must be at least 10 characters' })
  reason: string;
}
