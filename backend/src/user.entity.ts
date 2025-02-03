import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Product } from './product.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Product, product => product.user)
    products: Product[];
}
