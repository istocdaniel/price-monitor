import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { PriceHistory } from './price-history.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    url: string;

    @Column({ default: 0})
    threshold: number;

    @ManyToOne(() => User, user => user.products)
    user: User;

    @OneToMany(() => PriceHistory, price => price.product)
    prices: PriceHistory[];
}
