import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import {User} from './user.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    url: string;

    @ManyToOne(() => User, user => user.products)
    user: User;
}
