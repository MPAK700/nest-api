import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const JWT_ACCESS_STRATEGY = 'jwt-access';

@Injectable()
export class JwtAccessGuard extends AuthGuard(JWT_ACCESS_STRATEGY) {
  constructor() {
    super();
  }
}
