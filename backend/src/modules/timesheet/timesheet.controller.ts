import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { TimesheetService } from './timesheet.service';
import { GenerateTimesheetDto } from './dtos/generate-timesheet.dto';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: { id: number; companyId: number };
}

@ApiTags('timesheets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('timesheets')
export class TimesheetController {
  constructor(private readonly timesheetService: TimesheetService) {}

  @Get()
  async findAll(@Req() req: AuthenticatedRequest) {
    return this.timesheetService.findAll(req.user.companyId);
  }

  @Post('generate')
  async generate(@Body() dto: GenerateTimesheetDto, @Req() req: AuthenticatedRequest) {
    return this.timesheetService.generateForPeriod(req.user.companyId, dto.payPeriodId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    return this.timesheetService.findOne(id, req.user.companyId);
  }
}
