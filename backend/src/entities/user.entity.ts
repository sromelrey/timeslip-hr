// user.entity.ts
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Company } from './company.entity';
import { Employee } from './employee.entity';
import { UserRole } from '@/types/enums';


@Entity('users')
@Index(['email'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['companyId', 'role'], { where: 'deleted_at IS NULL' })
export class User extends CommonEntity {
  @Column({ name: 'company_id', type: 'int' })
  companyId: number;

  @ManyToOne(() => Company, (company) => company.users, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'varchar', length: 150, name: 'display_name' })
  displayName: string;

  @Column({ type: 'varchar', length: 100, name: 'first_name', nullable: true })
  firstName?: string | null;

  @Column({ type: 'varchar', length: 100, name: 'last_name', nullable: true })
  lastName?: string | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.EMPLOYEE })
  role: UserRole;

  @Column({ name: 'employee_id', type: 'int', nullable: true })
  employeeId?: number | null;

  @OneToOne(() => Employee, (employee) => employee.user, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'employee_id' })
  employee?: Employee | null;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 500, name: 'refresh_token', nullable: true })
  refreshToken?: string | null;

  @Column({ name: 'last_login_at', type: 'timestamp without time zone', nullable: true })
  lastLoginAt?: Date | null;
}
