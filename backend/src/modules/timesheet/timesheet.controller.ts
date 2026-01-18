import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { TimesheetService } from './providers/timesheet.service';
import { GenerateTimesheetDto } from './dtos/generate-timesheet.dto';
import { UpdateTimesheetStatusDto } from './dtos/update-timesheet-status.dto';
import { CreateAdjustmentDto } from './dtos/create-adjustment.dto';
import { Request } from 'express';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/guards/roles.decorator';
import { UserRole } from '@/types/enums';
import { CreateManualEntryDto } from './dtos/create-manual-entry.dto';
import { GenerateCustomTimesheetDto } from './dtos/generate-custom-timesheet.dto';

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

  @Get('pay-periods')
  @ApiOperation({ summary: 'List all pay periods for the company' })
  async getPayPeriods(@Req() req: AuthenticatedRequest) {
    return this.timesheetService.getPayPeriods(req.user.companyId);
  }

  @Post('generate-custom')
  @ApiOperation({ summary: 'Generate timesheets for a custom date range' })
  async generateCustom(@Body() dto: GenerateCustomTimesheetDto, @Req() req: AuthenticatedRequest) {
    return this.timesheetService.generateCustom(req.user.companyId, dto, req.user.id);
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

  @Post(':id/manual-entry')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Manually add a daily entry to a timesheet' })
  async addManualEntry(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateManualEntryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.timesheetService.addManualEntry(id, dto, req.user.id, req.user.companyId);
  }

  @Post('days/:dayId/adjustments')
  @ApiOperation({ summary: 'Create a manual adjustment for a timesheet day' })
  async createAdjustment(
    @Param('dayId', ParseIntPipe) dayId: number,
    @Body() dto: CreateAdjustmentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.timesheetService.createAdjustment(dayId, dto, req.user.id, req.user.companyId);
  }

  @Get('days/:dayId/adjustments')
  @ApiOperation({ summary: 'Get adjustment history for a timesheet day' })
  async getAdjustments(
    @Param('dayId', ParseIntPipe) dayId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.timesheetService.getAdjustmentsForDay(dayId, req.user.companyId);
  }

  @Get(':id/events')
  @ApiOperation({ summary: 'Get raw time events for a timesheet' })
  async getRawEvents(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.timesheetService.getRawEventsForTimesheet(id, req.user.companyId);
  }
}

