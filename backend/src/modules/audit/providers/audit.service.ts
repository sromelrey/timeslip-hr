import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, AuditAction } from '@/entities/audit-log.entity';

export interface CreateAuditLogDto {
  userId: number;
  action: AuditAction;
  entityType: string;
  entityId: number;
  description?: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
  ipAddress?: string;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepo: Repository<AuditLog>,
  ) {}

  /**
   * Log an admin action.
   */
  async log(dto: CreateAuditLogDto): Promise<AuditLog> {
    const log = this.auditLogRepo.create({
      userId: dto.userId,
      action: dto.action,
      entityType: dto.entityType,
      entityId: dto.entityId,
      description: dto.description,
      changesJson: dto.changes ? JSON.stringify(dto.changes) : undefined,
      ipAddress: dto.ipAddress,
    });

    return this.auditLogRepo.save(log);
  }

  /**
   * Get audit logs for a specific entity.
   */
  async getLogsForEntity(entityType: string, entityId: number): Promise<AuditLog[]> {
    return this.auditLogRepo.find({
      where: { entityType, entityId },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  /**
   * Get recent audit logs (for admin dashboard).
   */
  async getRecentLogs(limit = 50): Promise<AuditLog[]> {
    return this.auditLogRepo.find({
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['user'],
    });
  }
}
