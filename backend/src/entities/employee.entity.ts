import { CommonEntity } from "./common.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Company } from "./company.entity";

@Entity('employees')
export class Employee extends CommonEntity {
    @Column({ type: 'varchar', length: 150 })
    name: string;

    @Column({ type: 'varchar', length: 150 })
    @OneToMany(() => Company, (company) => company.id)
    company_id: string;

    @Column({ type: 'varchar', length: 150 })
    employee_number: string;
}