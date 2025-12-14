// company.entity.ts
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { User } from './user.entity';
import { Employee } from './employee.entity';
import { Setting } from './setting.entity';
import { PayPeriod } from './pay-period.entity';

@Entity('companies')
@Index(['name'], { unique: true, where: 'deleted_at IS NULL' })
export class Company extends CommonEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Employee, (employee) => employee.company)
  employees: Employee[];

  @OneToMany(() => PayPeriod, (pp) => pp.company)
  payPeriods: PayPeriod[];

  @OneToMany(() => Setting, (setting) => setting.company)
  settings: Setting[];
}
