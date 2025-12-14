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
}
