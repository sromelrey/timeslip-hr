import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { SettingsService } from './providers/settings.service';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { UpdateSettingsDto } from './dtos/update-settings.dto';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(@Request() req) {
    return this.settingsService.getSettings(req.user.companyId);
  }

  @Patch()
  async updateSettings(@Request() req, @Body() updateData: UpdateSettingsDto) {
    return this.settingsService.updateSettings(req.user.companyId, updateData);
  }
}
