import { Controller, Post, Body, Req, UseGuards, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { ReportsService } from './providers/reports.service';
import { TimesheetExportDto } from './dtos/timesheet-export.dto';
import { AttendanceSummaryDto } from './dtos/attendance-summary.dto';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: { id: number; companyId: number; employeeId?: number };
}

@ApiTags('Reports')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('timesheet-export')
  @ApiOperation({ summary: 'Generate CSV export of timesheets with optional filters' })
  @ApiResponse({ status: 200, description: 'CSV file generated successfully' })
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="timesheets-export.csv"')
  async exportTimesheets(
    @Body() dto: TimesheetExportDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<string> {
    return this.reportsService.generateTimesheetExport(dto, req.user.companyId);
  }

  @Post('attendance-summary')
  @ApiOperation({ summary: 'Generate attendance summary report with anomaly detection' })
  @ApiResponse({ status: 200, description: 'CSV report generated successfully' })
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="attendance-summary.csv"')
  async generateAttendanceSummary(
    @Body() dto: AttendanceSummaryDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<string> {
    return this.reportsService.generateAttendanceSummary(dto, req.user.companyId);
  }
}
