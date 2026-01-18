import { IsDateString, IsInt, IsString, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManualEntryDto {
  @ApiProperty({ example: '2025-01-20', description: 'Date of the manual entry (YYYY-MM-DD)' })
  @IsDateString()
  workDate: string;

  @ApiProperty({ example: 480, description: 'Regular minutes worked (must be >= 0)' })
  @IsInt()
  @Min(0)
  regularMinutes: number;

  @ApiProperty({ example: 0, description: 'Overtime minutes worked (must be >= 0)' })
  @IsInt()
  @Min(0)
  overtimeMinutes: number;

  @ApiProperty({ example: 'Forgot to clock in', description: 'Reason for manual entry (min 10 chars)' })
  @IsString()
  @MinLength(10)
  reason: string;
}
