// payslip-item.entity.ts
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Payslip } from './payslip.entity';

export enum PayslipItemType {
  EARNING = 'EARNING',
  DEDUCTION = 'DEDUCTION',
}

@Entity('payslip_items')
@Index(['payslipId', 'type'], { where: 'deleted_at IS NULL' })
export class PayslipItem extends CommonEntity {
  @Column({ name: 'payslip_id', type: 'int' })
  payslipId: number;

  @ManyToOne(() => Payslip, (ps) => ps.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'payslip_id' })
  payslip: Payslip;

  @Column({ type: 'enum', enum: PayslipItemType })
  type: PayslipItemType;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 150 })
  label: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ name: 'meta_json', type: 'text', nullable: true })
  metaJson?: string | null;
}
