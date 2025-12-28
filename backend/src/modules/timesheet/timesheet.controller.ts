import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { TimesheetService } from './timesheet.service';
import { GenerateTimesheetDto } from './dtos/generate-timesheet.dto';
import { UpdateTimesheetStatusDto } from './dtos/update-timesheet-status.dto';
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
  @ApiOperation({ summary: 'List all timesheets for the company' })
  async findAll(@Req() req: AuthenticatedRequest) {
    return this.timesheetService.findAll(req.user.companyId);
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate empty timesheets for a pay period' })
  async generate(@Body() dto: GenerateTimesheetDto, @Req() req: AuthenticatedRequest) {
    return this.timesheetService.generateForPeriod(req.user.companyId, dto.payPeriodId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single timesheet with days' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    return this.timesheetService.findOne(id, req.user.companyId);
  }

  @Post(':id/populate')
  @ApiOperation({ summary: 'Populate timesheet days by aggregating time events' })
  async populateDays(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    return this.timesheetService.populateDaysForTimesheet(id, req.user.companyId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update timesheet status (Review, Approve, Lock)' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTimesheetStatusDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.timesheetService.updateStatus(id, dto.status, req.user.id, req.user.companyId);
  }
}

