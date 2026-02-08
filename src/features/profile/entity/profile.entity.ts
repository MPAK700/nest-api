import { Avatar } from '../../avatar/entity/avatar.entity.ts';
import { RefreshToken } from '../../../auth/entity/refresh-token.entity.ts';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  age: number;

  @Column({ length: 1000 })
  description: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => RefreshToken, (token) => token.profile)
  refreshToken: Relation<RefreshToken>[];

  @OneToMany(() => Avatar, (avatar) => avatar.profile)
  avatar: Relation<Avatar>[];
}
