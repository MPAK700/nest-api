import {
    Column,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";


@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    login: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string

    @Column()
    age: number

    @Column({length: 1000})
    description: string
}