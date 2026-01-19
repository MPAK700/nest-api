import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ProfileService } from '../../features/profile/profile.service.ts';
import { AuthService } from '../auth.service.ts';
import { RequestWithCookies } from '../types/request-with-cookies.type.ts';

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
        (req: RequestWithCookies) => req?.cookies?.refreshToken,
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  async validate(
    req: RequestWithCookies,
    payload: { sub: number; login: string; jti: string },
  ) {
    const refreshToken: string = req.cookies['refreshToken'];
    const profile = await this.profileService.findById(payload.sub);

    if (!profile) {
      throw new UnauthorizedException();
    }

    await this.authService.validateRefreshToken(
      profile,
      refreshToken,
      payload.jti,
    );

    return {
      id: profile.id,
      login: profile.login,
      refreshToken,
      refreshTokenJti: payload.jti,
    };
  }
}
