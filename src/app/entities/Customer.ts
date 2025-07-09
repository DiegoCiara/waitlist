import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './User';
import Product from './Product';

@Entity({ name: 'customers' })
class Customer extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column({ type: 'jsonb', nullable: true})
  metadata!: any;

  @Column({ default: 'waiting' })
  status!: string;

  @ManyToOne(() => Product, (token) => token.customers)
  @JoinColumn([{ name: 'product', referencedColumnName: 'id' }])
  product!: Product;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date;
}

export default Customer;
