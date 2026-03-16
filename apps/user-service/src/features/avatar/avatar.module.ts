import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from './entity/avatar.entity.ts';
import { AvatarController } from './avatar.controller.ts';
import { AvatarService } from './avatar.service.ts';
import { FilesModule } from '../../providers/files/files.module.ts';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Avatar]), FilesModule, ConfigModule],
  controllers: [AvatarController],
  providers: [AvatarService],
})
export class AvatarModule {}
