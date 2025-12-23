// timesheet-anomaly.entity.ts
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { TimesheetDay } from './timesheet-day.entity';
import { TimesheetAnomalySeverity } from '@/types/enums';


@Entity('timesheet_anomalies')
@Index(['timesheetDayId', 'code'], { where: 'deleted_at IS NULL' })
export class TimesheetAnomaly extends CommonEntity {
  @Column({ name: 'timesheet_day_id', type: 'int' })
  timesheetDayId: number;

  @ManyToOne(() => TimesheetDay, (day) => day.anomalies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'timesheet_day_id' })
  timesheetDay: TimesheetDay;

  @Column({ type: 'varchar', length: 80 })
  code: string;

  @Column({ type: 'enum', enum: TimesheetAnomalySeverity, default: TimesheetAnomalySeverity.WARN })
  severity: TimesheetAnomalySeverity;

  @Column({ type: 'varchar', length: 400 })
  message: string;

  @Column({ name: 'meta_json', type: 'text', nullable: true })
  metaJson?: string | null;
}
