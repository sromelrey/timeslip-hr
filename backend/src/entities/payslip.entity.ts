// payslip.entity.ts
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Employee } from './employee.entity';
import { PayPeriod } from './pay-period.entity';
import { User } from './user.entity';
import { PayslipItem } from './payslip-item.entity';

export enum PayslipStatus {
  DRAFT = 'DRAFT',
  FINALIZED = 'FINALIZED',
  VOID = 'VOID',
}

@Entity('payslips')
@Index(['employeeId', 'payPeriodId'], { unique: true, where: 'deleted_at IS NULL' })
export class Payslip extends CommonEntity {
  @Column({ name: 'employee_id', type: 'int' })
  employeeId: number;

  @ManyToOne(() => Employee, (employee) => employee.payslips, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'pay_period_id', type: 'int' })
  payPeriodId: number;

  @ManyToOne(() => PayPeriod, (pp) => pp.payslips, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'pay_period_id' })
  payPeriod: PayPeriod;

  @Column({ type: 'enum', enum: PayslipStatus, default: PayslipStatus.DRAFT })
  status: PayslipStatus;

  @Column({ type: 'varchar', length: 10, nullable: true })
  currency?: string | null;

  @Column({ name: 'total_regular_minutes', type: 'int', default: 0 })
  totalRegularMinutes: number;

  @Column({ name: 'total_overtime_minutes', type: 'int', default: 0 })
  totalOvertimeMinutes: number;

  @Column({ name: 'gross_pay', type: 'decimal', precision: 12, scale: 2, default: 0 })
  grossPay: number;

  @Column({ name: 'total_deductions', type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalDeductions: number;

  @Column({ name: 'net_pay', type: 'decimal', precision: 12, scale: 2, default: 0 })
  netPay: number;

  @Column({ name: 'snapshot_json', type: 'text', nullable: true })
  snapshotJson?: string | null;

  @Column({ name: 'generated_by_user_id', type: 'int', nullable: true })
  generatedByUserId?: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'generated_by_user_id' })
  generatedByUser?: User | null;

  @Column({ name: 'generated_at', type: 'timestamp without time zone', nullable: true })
  generatedAt?: Date | null;

  @Column({ name: 'finalized_at', type: 'timestamp without time zone', nullable: true })
  finalizedAt?: Date | null;

  @Column({ name: 'voided_at', type: 'timestamp without time zone', nullable: true })
  voidedAt?: Date | null;

  @Column({ name: 'voided_by_user_id', type: 'int', nullable: true })
  voidedByUserId?: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'voided_by_user_id' })
  voidedByUser?: User | null;

  @OneToMany(() => PayslipItem, (item) => item.payslip)
  items: PayslipItem[];
}
