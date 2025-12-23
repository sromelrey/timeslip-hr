// timesheet-adjustment.entity.ts
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { TimesheetDay } from './timesheet-day.entity';
import { User } from './user.entity';
import { TimesheetAdjustmentField, TimesheetAdjustmentMode } from '@/types/enums';


@Entity('timesheet_adjustments')
@Index(['timesheetDayId', 'createdAt'], { where: 'deleted_at IS NULL' })
export class TimesheetAdjustment extends CommonEntity {
  @Column({ name: 'timesheet_day_id', type: 'int' })
  timesheetDayId: number;

  @ManyToOne(() => TimesheetDay, (day) => day.adjustments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'timesheet_day_id' })
  timesheetDay: TimesheetDay;

  @Column({ type: 'enum', enum: TimesheetAdjustmentField })
  field: TimesheetAdjustmentField;

  @Column({ type: 'enum', enum: TimesheetAdjustmentMode, default: TimesheetAdjustmentMode.DELTA })
  mode: TimesheetAdjustmentMode;

  @Column({ name: 'delta_minutes', type: 'int', nullable: true })
  deltaMinutes?: number | null;

  @Column({ name: 'override_minutes', type: 'int', nullable: true })
  overrideMinutes?: number | null;

  @Column({ type: 'varchar', length: 500 })
  reason: string;

  @Column({ name: 'created_by_user_id', type: 'int' })
  createdByUserId: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;
}
