import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { CacheService } from '../cache.service.ts';
import { of, tap } from 'rxjs';
import { buildProfilesListKey } from '../keys/profiles-list-cache.keys.ts';
import { PaginatedResultDTO } from '../../../common/pagiantion/paginated.dto.ts';
import { ProfileResponseDTO } from '../../../features/profile/dto/profile-response.dto.ts';

@Injectable()
export class ProfilesListCacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ProfilesListCacheInterceptor.name);
  constructor(private readonly cache: CacheService) {}

  async intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx
      .switchToHttp()
      .getRequest<Request & { query: { page?: number; limit?: number } }>();
    if (!req) {
      return next.handle();
    }
    const { page, limit } = req.query;

    if (!page || !limit) {
      return next.handle();
    }
    const key = buildProfilesListKey({ page, limit });

    const cached =
      await this.cache.get<PaginatedResultDTO<ProfileResponseDTO>>(key);
    if (cached) {
      this.logger.debug(`CACHE HIT for key=${key}`);
      return of(cached);
    }

    return next.handle().pipe(
      tap((result) => {
        this.logger.debug(`CACHE SET for key=${key}`);
        this.cache
          .set(key, result)
          .catch((err) => this.logger.error('Cache error', err));
      }),
    );
  }
}
