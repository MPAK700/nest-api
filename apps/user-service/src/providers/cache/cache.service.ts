import { Inject, Injectable } from '@nestjs/common';
import Keyv from 'keyv';

export const REDIS_CACHE = 'REDIS_CACHE';

@Injectable()
export class CacheService {
  constructor(@Inject(REDIS_CACHE) private readonly keyv: Keyv) {}

  async get<T>(key: string): Promise<T | undefined> {
    return this.keyv.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number) {
    return this.keyv.set(key, value, ttl);
  }

  async delete(key: string) {
    return this.keyv.delete(key);
  }
}
