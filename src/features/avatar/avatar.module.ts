import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from './entity/avatar.entity.ts';
import { AvatarController } from '../avatar/avatar.controller.ts';
import { AvatarService } from '../avatar/avatar.service.ts';
import { FilesModule } from '../../providers/files/files.module.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Avatar]), FilesModule],
  controllers: [AvatarController],
  providers: [Avatar, AvatarService],
})
export class AvatarModule {}
