// deduction.entity.ts
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Employee } from './employee.entity';
import { DeductionType, DeductionCalculationType } from '@/types/enums';

@Entity('deductions')
@Index(['employeeId', 'isActive'])
export class Deduction extends CommonEntity {
  @Column({ name: 'employee_id', type: 'int' })
  employeeId: number;

  @ManyToOne(() => Employee, (employee) => employee.deductions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'enum', enum: DeductionType })
  type: DeductionType;

  @Column({ type: 'varchar', length: 255 })
  label: string;

  @Column({
    name: 'calculation_type',
    type: 'enum',
    enum: DeductionCalculationType,
  })
  calculationType: DeductionCalculationType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'effective_from', type: 'date', nullable: true })
  effectiveFrom?: Date | null;

  @Column({ name: 'effective_until', type: 'date', nullable: true })
  effectiveUntil?: Date | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
