import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Customer } from './Customer';
import { OrderItem } from './OrderItem';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Customer, { nullable: false })
  customer!: Customer;

  @Column({ name: 'order_date', type: 'datetime' })
  orderDate!: Date;

  @Column({ type: 'varchar', length: 50 })
  status!: string;

  @Column({ name: 'payment_method', type: 'varchar', length: 50 })
  paymentMethod!: string;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: string; // decimales como string

  @OneToMany(() => OrderItem, (item) => item.order)
  items!: OrderItem[];
}