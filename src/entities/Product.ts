import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  sku!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: string; // usar string para decimales en MySQL

  @Column({ type: 'varchar', length: 100 })
  category!: string;
}