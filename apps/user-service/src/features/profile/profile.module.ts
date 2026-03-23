import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entity/profile.entity.ts';
import { ProfileController } from './controllers/profile.controller.ts';
import { ProfileService } from './services/profile.service.ts';
import { ConfigModule } from '@nestjs/config';
import { AvatarModule } from '../avatar/avatar.module.ts';
import { ProfileSearchService } from './services/profile-search.service.ts';
import { CacheModule } from '../../providers/cache/cache.module.ts';
import { ProfileBalanceController } from './controllers/profile-balance.controller.ts';
import { ProfileBalanceService } from './services/profile-balance.service.ts';
import { OutboxModule } from '../outbox/outbox.module.ts';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Profile]),
    AvatarModule,
    CacheModule,
    OutboxModule,
  ],
  controllers: [ProfileController, ProfileBalanceController],
  providers: [ProfileService, ProfileSearchService, ProfileBalanceService],
  exports: [ProfileService],
})
export class ProfileModule {}
