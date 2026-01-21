import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_ACCESS_STRATEGY } from '../auth.constants.ts';

@Injectable()
export class JwtAccessGuard extends AuthGuard(JWT_ACCESS_STRATEGY) {
  constructor() {
    super();
  }
}
