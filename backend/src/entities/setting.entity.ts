// setting.entity.ts
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Company } from './company.entity';

@Entity('settings')
@Index(['companyId'], { unique: true, where: 'deleted_at IS NULL' })
export class Setting extends CommonEntity {
  @Column({ name: 'company_id', type: 'int' })
  companyId: number;

  @ManyToOne(() => Company, (company) => company.settings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'varchar', length: 80, default: 'Asia/Manila' })
  timezone: string;

  @Column({ type: 'varchar', length: 10, default: 'PHP' })
  currency: string;

  @Column({ name: 'rounding_rule', type: 'varchar', length: 30, default: 'NONE' })
  roundingRule: string;

  @Column({ name: 'break_policy', type: 'varchar', length: 30, default: 'UNPAID' })
  breakPolicy: string;

  @Column({ name: 'overtime_rule', type: 'varchar', length: 30, default: 'NONE' })
  overtimeRule: string;

  @Column({ name: 'grace_period_minutes', type: 'int', default: 0 })
  gracePeriodMinutes: number;

  @Column({ name: 'pay_period_type', type: 'varchar', length: 30, default: 'WEEKLY' })
  payPeriodType: string;

  @Column({ name: 'default_hourly_rate', type: 'decimal', precision: 10, scale: 2, nullable: true })
  defaultHourlyRate?: number | null;

  @Column({ name: 'session_duration_minutes', type: 'int', default: 480 })
  sessionDurationMinutes: number;

  @Column({ name: 'password_policy', type: 'text', nullable: true })
  passwordPolicy?: string | null;

  @Column({ name: 'pin_policy', type: 'text', nullable: true })
  pinPolicy?: string | null;

  @Column({ name: 'data_retention_months', type: 'int', nullable: true })
  dataRetentionMonths?: number | null;
}
