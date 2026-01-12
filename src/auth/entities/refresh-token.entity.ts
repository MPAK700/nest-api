import { Profile } from "../../profile/entities/profile.entity.ts";
import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import type { Relation } from "typeorm";

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;   
        
    @ManyToOne(
        () => Profile,
        (profile) => profile.refreshToken,
    )
    profile: Relation<Profile>;

}