// employee-compensation.entity.ts
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Employee } from './employee.entity';
import { User } from './user.entity';

export enum CompensationType {
  HOURLY = 'HOURLY',
  SALARIED = 'SALARIED',
}

@Entity('employee_compensation')
@Index(['employeeId', 'effectiveFrom'], { where: 'deleted_at IS NULL' })
export class EmployeeCompensation extends CommonEntity {
  @Column({ name: 'employee_id', type: 'int' })
  employeeId: number;

  @ManyToOne(() => Employee, (employee) => employee.compensations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'enum', enum: CompensationType })
  type: CompensationType;

  @Column({ name: 'hourly_rate', type: 'decimal', precision: 12, scale: 2, nullable: true })
  hourlyRate?: number | null;

  @Column({ name: 'monthly_salary', type: 'decimal', precision: 12, scale: 2, nullable: true })
  monthlySalary?: number | null;

  @Column({ name: 'effective_from', type: 'date' })
  effectiveFrom: string;

  @Column({ name: 'effective_to', type: 'date', nullable: true })
  effectiveTo?: string | null;

  @Column({ name: 'created_by_user_id', type: 'int', nullable: true })
  createdByUserId?: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser?: User | null;
}
