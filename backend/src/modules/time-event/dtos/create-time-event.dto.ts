import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TimeEventSource, TimeEventType } from '@/types/enums';

export class CreateTimeEventDto {
  @ApiProperty({ description: 'Employee unique number', example: '2025001' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, { message: 'employeeNumber must contain only numbers' })
  employeeNumber: string;

  @ApiPropertyOptional({ description: 'Employee PIN for kiosk authentication', example: '1234' })
  @IsString()
  @IsOptional()
  @Length(4, 8)
  pin?: string;

  @ApiProperty({ enum: TimeEventType, description: 'Type of event' })
  @IsEnum(TimeEventType)
  @IsNotEmpty()
  type: TimeEventType;

  @ApiProperty({ description: 'Client-generated UUID for idempotency', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @ApiPropertyOptional({ enum: TimeEventSource, description: 'Source of the event', default: TimeEventSource.KIOSK })
  @IsEnum(TimeEventSource)
  @IsOptional()
  source?: TimeEventSource = TimeEventSource.KIOSK;

  @ApiPropertyOptional({ description: 'Device identifier' })
  @IsString()
  @IsOptional()
  deviceId?: string;

  @ApiPropertyOptional({ description: 'Metadata in JSON string format' })
  @IsString()
  @IsOptional()
  metaJson?: string;
}
