import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TimesheetStatus } from '@/types/enums';

export class UpdateTimesheetStatusDto {
  @ApiProperty({ enum: TimesheetStatus, description: 'New status for the timesheet' })
  @IsEnum(TimesheetStatus)
  status: TimesheetStatus;
}
