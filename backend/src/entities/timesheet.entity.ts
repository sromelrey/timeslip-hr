// timesheet.entity.ts
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Employee } from './employee.entity';
import { PayPeriod } from './pay-period.entity';
import { User } from './user.entity';
import { TimesheetDay } from './timesheet-day.entity';
import { TimesheetStatus } from '@/types/enums';


@Entity('timesheets')
@Index(['employeeId', 'payPeriodId'], { unique: true, where: 'deleted_at IS NULL' })
export class Timesheet extends CommonEntity {
  @Column({ name: 'employee_id', type: 'int' })
  employeeId: number;

  @ManyToOne(() => Employee, (employee) => employee.timesheets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'pay_period_id', type: 'int' })
  payPeriodId: number;

  @ManyToOne(() => PayPeriod, (pp) => pp.timesheets, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'pay_period_id' })
  payPeriod: PayPeriod;

  @Column({ type: 'enum', enum: TimesheetStatus, default: TimesheetStatus.DRAFT })
  status: TimesheetStatus;

  @Column({ name: 'generated_at', type: 'timestamp without time zone', nullable: true })
  generatedAt?: Date | null;

  @Column({ name: 'reviewed_at', type: 'timestamp without time zone', nullable: true })
  reviewedAt?: Date | null;

  @Column({ name: 'reviewed_by_user_id', type: 'int', nullable: true })
  reviewedByUserId?: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reviewed_by_user_id' })
  reviewedByUser?: User | null;

  @Column({ name: 'approved_at', type: 'timestamp without time zone', nullable: true })
  approvedAt?: Date | null;

  @Column({ name: 'approved_by_user_id', type: 'int', nullable: true })
  approvedByUserId?: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'approved_by_user_id' })
  approvedByUser?: User | null;

  @Column({ name: 'locked_at', type: 'timestamp without time zone', nullable: true })
  lockedAt?: Date | null;

  @Column({ name: 'locked_by_user_id', type: 'int', nullable: true })
  lockedByUserId?: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'locked_by_user_id' })
  lockedByUser?: User | null;

  @OneToMany(() => TimesheetDay, (day) => day.timesheet)
  days: TimesheetDay[];
}
