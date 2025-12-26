// employee.entity.ts
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Company } from './company.entity';
import { User } from './user.entity';
import { EmployeeCompensation } from './employee-compensation.entity';
import { TimeEvent } from './time-event.entity';
import { Timesheet } from './timesheet.entity';
import { Payslip } from './payslip.entity';
import { EmploymentType } from '@/types/enums';


@Entity('employees')
@Index(['companyId', 'employeeNumber'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['companyId', 'isActive'], { where: 'deleted_at IS NULL' })
export class Employee extends CommonEntity {
  @Column({ name: 'company_id', type: 'int' })
  companyId: number;

  @ManyToOne(() => Company, (company) => company.employees, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'employee_number', type: 'int' })
  employeeNumber: number;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  department?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  position?: string;

  @Column({ name: 'employment_type', type: 'enum', enum: EmploymentType, default: EmploymentType.HOURLY })
  employmentType: EmploymentType;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'pin_hash', type: 'varchar', length: 255, nullable: true })
  pinHash?: string | null;

  @Column({ name: 'hired_at', type: 'date', nullable: true })
  hiredAt?: string | null;

  @Column({ name: 'terminated_at', type: 'date', nullable: true })
  terminatedAt?: string | null;

  @OneToOne(() => User, (user) => user.employee)
  user: User;

  @OneToMany(() => EmployeeCompensation, (comp) => comp.employee)
  compensations: EmployeeCompensation[];

  @OneToMany(() => TimeEvent, (ev) => ev.employee)
  timeEvents: TimeEvent[];

  @OneToMany(() => Timesheet, (ts) => ts.employee)
  timesheets: Timesheet[];

  @OneToMany(() => Payslip, (ps) => ps.employee)
  payslips: Payslip[];
}
