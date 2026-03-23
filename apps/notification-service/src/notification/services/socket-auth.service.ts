import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { AccessTokenPayload } from '../../../../../libs/contracts/src/auth/jwt-payloads.ts';

@Injectable()
export class SocketAuthService {
  constructor(private readonly jwtService: JwtService) {}

  verifyJwt(authHeader: string): string {
    if (!authHeader) throw new UnauthorizedException('No token provided');

    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = this.jwtService.verify<AccessTokenPayload>(token);
      return String(payload.sub);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown JWT error';
      throw new UnauthorizedException(`Invalid token: ${message}`);
    }
  }
}
