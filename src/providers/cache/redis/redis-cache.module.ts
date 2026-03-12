import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import { REDIS_CACHE } from '../cache.service.ts';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CACHE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.getOrThrow<string>(
          'REDIS_HOST',
          'localhost',
        );
        const port = configService.getOrThrow<number>('REDIS_PORT', 6379);
        const password = configService.getOrThrow<string>('REDIS_PASSWORD');
        const ttl = configService.getOrThrow<number>('CACHE_TTL_MS');
        const keyv = new Keyv({
          store: new KeyvRedis({
            url: `redis://${host}:${port}`,
            password,
          }),
          ttl,
        });

        keyv.on('error', (err) =>
          console.error('Redis connection error:', err),
        );

        return keyv;
      },
    },
  ],
  exports: [REDIS_CACHE],
})
export class RedisCacheModule {}
