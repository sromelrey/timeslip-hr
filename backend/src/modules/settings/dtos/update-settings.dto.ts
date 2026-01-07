import { IsString, IsOptional, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  roundingRule?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  breakPolicy?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  overtimeRule?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  gracePeriodMinutes?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  payPeriodType?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  defaultHourlyRate?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  sessionDurationMinutes?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  passwordPolicy?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  pinPolicy?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  dataRetentionMonths?: number;
}
