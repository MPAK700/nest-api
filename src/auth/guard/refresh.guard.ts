import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const JWT_REFRESH_STRATEGY = 'jwt-refresh';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(JWT_REFRESH_STRATEGY) {
  constructor() {
    super();
  }
}
