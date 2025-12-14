// timesheet-day.entity.ts
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Timesheet } from './timesheet.entity';
import { TimesheetAnomaly } from './timesheet-anomaly.entity';
import { TimesheetAdjustment } from './timesheet-adjustment.entity';

@Entity('timesheet_days')
@Index(['timesheetId', 'workDate'], { unique: true, where: 'deleted_at IS NULL' })
export class TimesheetDay extends CommonEntity {
  @Column({ name: 'timesheet_id', type: 'int' })
  timesheetId: number;

  @ManyToOne(() => Timesheet, (ts) => ts.days, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'timesheet_id' })
  timesheet: Timesheet;

  @Column({ name: 'work_date', type: 'date' })
  workDate: string;

  @Column({ name: 'regular_minutes', type: 'int', default: 0 })
  regularMinutes: number;

  @Column({ name: 'break_minutes', type: 'int', default: 0 })
  breakMinutes: number;

  @Column({ name: 'overtime_minutes', type: 'int', default: 0 })
  overtimeMinutes: number;

  @Column({ name: 'anomalies_json', type: 'text', nullable: true })
  anomaliesJson?: string | null;

  @OneToMany(() => TimesheetAnomaly, (a) => a.timesheetDay)
  anomalies: TimesheetAnomaly[];

  @OneToMany(() => TimesheetAdjustment, (adj) => adj.timesheetDay)
  adjustments: TimesheetAdjustment[];
}
