import { Column, Entity, Index } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity('products')
@Index(['sku'], { unique: true, where: 'deleted_at IS NULL' })
export class Product extends CommonEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  sku: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;
}
