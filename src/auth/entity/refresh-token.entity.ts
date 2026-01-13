import { Profile } from '../../profile/entity/profile.entity.ts';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tokenHash: string;

    @Column()
    expiresAt: Date;

    @ManyToOne(() => Profile, (profile) => profile.refreshToken)
    @JoinColumn({ name: 'profile_id' })
    profile: Relation<Profile>;
}
