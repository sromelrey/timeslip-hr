import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateTimesheetDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  payPeriodId: number;
}
