import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ProfileService } from '../../profile/profile.service.ts';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
  ) 
{
  constructor(
    configService: ConfigService,
    private readonly profileService: ProfileService,
  ) {
    const secret = configService.get<string>('JWT_REFRESH_SECRET');
    
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not set in configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(req: Request, payload: { sub: number; login: string }) {
    const profile = await this.profileService.findById(payload.sub);
    
    if (!profile) {
      throw new NotFoundException('User not found');
    }

    const { password, ...profileSafe } = profile;
    return profileSafe;
  }
}
