import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { TimeEventService } from './time-event.service';
import { CreateTimeEventDto } from './dtos';

@ApiTags('Time Events')
@Controller('time-events')
export class TimeEventController {
  constructor(private readonly timeEventService: TimeEventService) {}

  @Post()
  @ApiOperation({ summary: 'Create a time event (Clock In/Out, Break In/Out)' })
  @ApiResponse({ status: 201, description: 'Event recorded successfully' })
  async create(@Body() dto: CreateTimeEventDto, @Req() req: Request) {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    return this.timeEventService.create(dto, ipAddress);
  }

  @Get('status/:employeeNumber')
  @ApiOperation({ summary: 'Get current status of an employee' })
  async getStatus(@Param('employeeNumber') employeeNumber: string) {
    return this.timeEventService.getStatusByNumber(employeeNumber);
  }

  @Get('recent/:employeeNumber')
  @ApiOperation({ summary: 'Get recent time events for an employee' })
  async getRecent(@Param('employeeNumber') employeeNumber: string) {
    return this.timeEventService.getRecentEvents(employeeNumber);
  }

  @Get('server-time')
  @ApiOperation({ summary: 'Get current server time' })
  async getServerTime() {
    return this.timeEventService.getServerTime();
  }
}
