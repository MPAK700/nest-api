import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from './entity/avatar.entity.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Avatar])],
})
export class AvatarModule {}
