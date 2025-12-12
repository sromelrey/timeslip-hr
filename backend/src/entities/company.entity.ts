import { Column, Entity, PrimaryColumn } from "typeorm";
import { CommonEntity } from "./common.entity";

@Entity('companies')
export class Company extends CommonEntity {

    @Column({ type: 'varchar', length: 150 })
    name: string;

}