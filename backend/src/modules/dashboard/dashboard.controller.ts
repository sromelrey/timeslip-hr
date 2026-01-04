import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: { id: number; companyId: number; employeeId?: number };
}

@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics for admin' })
  async getStats(@Req() req: AuthenticatedRequest) {
    return this.dashboardService.getStats(req.user.companyId);
  }
}
