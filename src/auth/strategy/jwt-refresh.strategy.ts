import { Injectable, NotFoundException, Req, UnauthorizedException} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express'
import { ProfileService } from '../../profile/profile.service.ts';
import { RefreshToken } from '../entity/refresh-token.entity.ts';
import { AuthService } from '../auth.service.ts';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    private readonly profileService: ProfileService,
    private readonly authService: AuthService,
  ) {
    const secret = configService.get<string>('JWT_REFRESH_SECRET');

    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not set in configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.refreshToken,
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: number; login: string; jti: string }) {
    const refreshToken = req.cookies['refreshToken'];
    const profile = await this.profileService.findById(payload.sub);

    if (!profile) {
      throw new UnauthorizedException();
    }

    await this.authService.validateRefreshToken(profile, refreshToken, payload.jti);

    return {
      id: profile.id,
      login: profile.login,
      refreshToken,
      refreshTokenJti: payload.jti,
    };
  }
}
