import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MoreThan, Repository } from 'typeorm';
import ms, { StringValue } from 'ms';
import { SignInResponseDTO } from './dto/sign-in-response.dto.ts';
import { ProfileService } from '../features/profile/profile.service.ts';
import { ProfileCreateDTO } from '../features/profile/dto/profile-create.dto.ts';
import { SignInDTO } from '../features/profile/dto/sign-in.dto.ts';
import { Profile } from '../features/profile/entity/profile.entity.ts';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entity/refresh-token.entity.ts';
import { ConfigService } from '@nestjs/config';
import { RefreshUser } from './types/refresh-user.type.ts';
import { hash } from '../common/utils/hash.ts';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly profileService: ProfileService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(profileDto: ProfileCreateDTO) {
    const profile = await this.profileService.createProfile(profileDto);

    const accessToken = await this.generateAccessToken(
      profile.id,
      profile.login,
    );
    const { refreshToken, jti } = await this.generateRefreshToken(
      profile.id,
      profile.login,
    );

    const refreshTokenEntity = this.createRefreshToken(
      profile.id,
      refreshToken,
      jti,
    );

    await this.refreshTokenRepository.save(refreshTokenEntity);
    return new SignInResponseDTO(accessToken, refreshToken);
  }

  async signIn(profileDto: SignInDTO) {
    const profile = await this.profileService.findByLogin(profileDto.login);

    if (!profile) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (profile.password != hash(profileDto.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.generateAccessToken(
      profile.id,
      profile.login,
    );

    const { refreshToken, jti } = await this.generateRefreshToken(
      profile.id,
      profile.login,
    );

    const refreshTokenEntity = this.createRefreshToken(
      profile.id,
      refreshToken,
      jti,
    );

    await this.refreshTokenRepository.save(refreshTokenEntity);
    return new SignInResponseDTO(accessToken, refreshToken);
  }

  async rotateTokens(refreshUser: RefreshUser) {
    const oldToken = await this.refreshTokenRepository.findOne({
      where: {
        jti: refreshUser.refreshTokenJti,
        profile: { id: refreshUser.id },
        revoked: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!oldToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    oldToken.revoked = true;

    const { refreshToken: newRefreshToken, jti: newJti } =
      await this.generateRefreshToken(refreshUser.id, refreshUser.login);
    const accessToken = await this.generateAccessToken(
      refreshUser.id,
      refreshUser.login,
    );

    const newTokenEntity = this.createRefreshToken(
      refreshUser.id,
      newRefreshToken,
      newJti,
    );
    await this.refreshTokenRepository.save([oldToken, newTokenEntity]);

    return new SignInResponseDTO(accessToken, newRefreshToken);
  }

  async validateRefreshToken(
    profile: Profile,
    refreshToken: string,
    jti: string,
  ) {
    const now = new Date();

    const tokenEntity = await this.refreshTokenRepository.findOne({
      relations: ['profile'],
      where: {
        jti,
        profile: { id: profile.id },
        expiresAt: MoreThan(now),
        revoked: false,
      },
    });

    if (!tokenEntity) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = tokenEntity.tokenHash === hash(refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Refresh token invalid');
    }

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return tokenEntity;
  }

  private createRefreshToken(profileId: number, token: string, jti: string) {
    const tokenHash = hash(token);

    const expiresIn = this.configService.get<StringValue>(
      'JWT_REFRESH_EXPIRES_IN',
    );

    if (!expiresIn) {
      throw new InternalServerErrorException('Server configuration error');
    }

    const expiresAt = ms(expiresIn);
    const expiresDate = new Date(Date.now() + expiresAt);

    return this.refreshTokenRepository.create({
      profile: { id: profileId },
      jti,
      tokenHash,
      expiresAt: expiresDate,
      revoked: false,
    });
  }

  private async generateAccessToken(id: number, login: string) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: id,
        login: login,
      },
      {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
      },
    );
    return accessToken;
  }

  private async generateRefreshToken(id: number, login: string) {
    const jti = randomUUID();
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: id,
        login: login,
        jti,
      },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      },
    );
    return { refreshToken, jti };
  }
}
