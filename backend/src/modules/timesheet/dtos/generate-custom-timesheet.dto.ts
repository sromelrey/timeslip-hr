import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class GenerateCustomTimesheetDto {
  @ApiProperty({ example: '2025-02-01', description: 'Start date of the custom period (YYYY-MM-DD)' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-02-15', description: 'End date of the custom period (YYYY-MM-DD)' })
  @IsDateString()
  endDate: string;
}
