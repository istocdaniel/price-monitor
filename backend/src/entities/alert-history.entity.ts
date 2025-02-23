import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('alerts')
export class AlertHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @Column()
    email: string;

    @Column()
    email_body: string;
}
