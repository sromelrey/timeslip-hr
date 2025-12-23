// time-event.entity.ts
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Employee } from './employee.entity';
import { User } from './user.entity';
import { TimeEventSource, TimeEventType } from '@/types/enums';


@Entity('time_events')
@Index(['employeeId', 'happenedAt'], { where: 'deleted_at IS NULL' })
@Index(['requestId'], { unique: true, where: 'deleted_at IS NULL' })
export class TimeEvent extends CommonEntity {
  @Column({ name: 'employee_id', type: 'int' })
  employeeId: number;

  @ManyToOne(() => Employee, (employee) => employee.timeEvents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'enum', enum: TimeEventType })
  type: TimeEventType;

  @Column({ name: 'happened_at', type: 'timestamp without time zone' })
  happenedAt: Date;

  @Column({ type: 'enum', enum: TimeEventSource, default: TimeEventSource.WEB })
  source: TimeEventSource;

  @Column({ name: 'request_id', type: 'varchar', length: 100 })
  requestId: string;

  @Column({ name: 'device_id', type: 'varchar', length: 150, nullable: true })
  deviceId?: string | null;

  @Column({ name: 'ip_address', type: 'varchar', length: 80, nullable: true })
  ipAddress?: string | null;

  @Column({ name: 'created_by_user_id', type: 'int', nullable: true })
  createdByUserId?: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser?: User | null;

  @Column({ name: 'meta_json', type: 'text', nullable: true })
  metaJson?: string | null;
}
