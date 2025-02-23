import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('prices')
export class PriceHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @Column()
    price: number;

    @Column()
    currency: string;

    @ManyToOne(() => Product, product => product.prices)
    product: Product;
}
