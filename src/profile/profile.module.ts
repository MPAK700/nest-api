import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entity/profile.entity.ts';
import { ProfileController } from './profile.controller.ts';
import { ProfileService } from './profile.service.ts';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Profile])],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
