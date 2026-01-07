import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '@/entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingsRepo: Repository<Setting>,
  ) {}

  async getSettings(companyId: number): Promise<Setting> {
    const settings = await this.settingsRepo.findOne({
      where: { companyId },
    });

    if (!settings) {
      // Create default settings if they don't exist
      const newSettings = this.settingsRepo.create({
        companyId,
      });
      return await this.settingsRepo.save(newSettings);
    }

    return settings;
  }

  async updateSettings(companyId: number, updateData: Partial<Setting>): Promise<Setting> {
    const settings = await this.getSettings(companyId);
    
    // Merge updates
    Object.assign(settings, updateData);
    
    return await this.settingsRepo.save(settings);
  }
}
