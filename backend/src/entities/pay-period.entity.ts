// pay-period.entity.ts
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Company } from './company.entity';
import { User } from './user.entity';
import { Timesheet } from './timesheet.entity';
import { Payslip } from './payslip.entity';
import { PayPeriodStatus } from '@/types/enums';


@Entity('pay_periods')
@Index(['companyId', 'startDate', 'endDate'], { unique: true, where: 'deleted_at IS NULL' })
export class PayPeriod extends CommonEntity {
  @Column({ name: 'company_id', type: 'int' })
  companyId: number;

  @ManyToOne(() => Company, (company) => company.payPeriods, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date' })
  endDate: string;

  @Column({ type: 'enum', enum: PayPeriodStatus, default: PayPeriodStatus.OPEN })
  status: PayPeriodStatus;

  @Column({ name: 'closed_at', type: 'timestamp without time zone', nullable: true })
  closedAt?: Date | null;

  @Column({ name: 'closed_by_user_id', type: 'int', nullable: true })
  closedByUserId?: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'closed_by_user_id' })
  closedByUser?: User | null;

  @OneToMany(() => Timesheet, (ts) => ts.payPeriod)
  timesheets: Timesheet[];

  @OneToMany(() => Payslip, (ps) => ps.payPeriod)
  payslips: Payslip[];
}
