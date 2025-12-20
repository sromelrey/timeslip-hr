import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmploymentType } from '@/entities/employee.entity';

export class CreateEmployeeDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  companyId: number;

  @ApiProperty({ example: 'John' })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiPropertyOptional({ example: 'Engineering' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  department?: string;

  @ApiPropertyOptional({ example: 'Software Developer' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  position?: string;

  @ApiProperty({ example: EmploymentType.SALARIED, enum: EmploymentType })
  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  hiredAt?: string;

  @ApiPropertyOptional({ example: null })
  @IsOptional()
  @IsDateString()
  terminatedAt?: string;

  @ApiPropertyOptional({ example: 25.00, description: 'Hourly rate, Daily rate, or Monthly salary based on employment type' })
  @IsOptional()
  @IsNumber()
  rate?: number;
}
// Force rebuild

