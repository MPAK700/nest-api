import { Profile } from '../../profile/entity/profile.entity.ts';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';

@Entity()
export class Avatar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isCurrent: boolean;

  @ManyToOne(() => Profile, (profile) => profile.avatar, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Relation<Profile>;
}
