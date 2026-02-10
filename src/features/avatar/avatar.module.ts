import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from './entity/avatar.entity.ts';
import { AvatarController } from '../avatar/avatar.controller.ts';
import { AvatarService } from '../avatar/avatar.service.ts';
import { FilesModule } from '../../providers/files/files.module.ts';
import { ProfileModule } from '../profile/profile.module.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Avatar]), FilesModule, ProfileModule],
  controllers: [AvatarController],
  providers: [AvatarService],
})
export class AvatarModule {}
