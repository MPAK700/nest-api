import { Module } from '@nestjs/common';
import { RedisCacheModule } from './redis/redis-cache.module.ts';
import { CacheService } from './cache.service.ts';

@Module({
  imports: [RedisCacheModule],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
