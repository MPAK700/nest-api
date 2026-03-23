import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { CacheService } from '../cache.service.ts';
import { of, tap } from 'rxjs';
import { buildMyProfileKey } from '../keys/my-profile-cache.interceptor.ts';
import { ProfileResponseDTO } from '../../../features/profile/dto/profile-response.dto.ts';

@Injectable()
export class MyProfileCacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MyProfileCacheInterceptor.name);
  constructor(private readonly cache: CacheService) {}

  async intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx
      .switchToHttp()
      .getRequest<Request & { user?: { id: number } }>();

    if (!req.user?.id) {
      return next.handle();
    }
    const key = buildMyProfileKey(req.user.id);

    const cached = await this.cache.get<ProfileResponseDTO>(key);
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
