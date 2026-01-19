import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/guards/roles.decorator';
import { UserRole } from '@/types/enums';
import { SuperAdminService } from './providers/super-admin.service';

@ApiTags('Super Admin - Global Stats')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Controller('super-admin/stats')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Get()
  @ApiOperation({ summary: 'Get global system statistics' })
  getGlobalStats() {
    return this.superAdminService.getGlobalStats();
  }
}
