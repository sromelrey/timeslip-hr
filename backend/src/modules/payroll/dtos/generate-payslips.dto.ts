import { IsInt, IsNotEmpty, IsOptional, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GeneratePayslipsDto {
  @ApiProperty({ example: 1, description: 'Pay period ID to generate payslips for' })
  @IsInt()
  @IsNotEmpty()
  payPeriodId: number;

  @ApiProperty({ 
    example: [1, 2, 3], 
    description: 'Optional array of employee IDs. If not provided, generates for all active employees',
    required: false 
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  employeeIds?: number[];
}
