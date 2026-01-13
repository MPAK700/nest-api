import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import argon from 'argon2';
import ms, { StringValue } from 'ms';
import { SignInResponseDTO } from './dto/sign-in-response.dto.ts';
import { ProfileService } from '../profile/profile.service.ts';
import { ProfileDTO } from '../profile/dto/profile.dto.ts';
import { SignInDTO } from '../profile/dto/sign-in.dto.ts';
import { Profile } from '../profile/entity/profile.entity.ts';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entity/refresh-token.entity.ts';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepository: Repository<RefreshToken>,
        private readonly profileService: ProfileService,
        private readonly jwtService: JwtService,
    ) { }

    async signUp(profileDto: ProfileDTO) {
        const profile = await this.profileService.createProfile(profileDto);

        const accessToken = await this.generateAccessToken(profile);
        const refreshToken = await this.generateRefreshToken(profile);

        await this.saveRefreshToken(profile, refreshToken);
        console.log(profile);
        return new SignInResponseDTO(accessToken, refreshToken);
    }

    async signIn(profileDto: SignInDTO) {
        const profile = await this.profileService.findByLogin(profileDto.login);

        if (!profile) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const pwMatches = await argon.verify(profile.password, profileDto.password);

        if (!pwMatches) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = await this.generateAccessToken(profile);
        const refreshToken = await this.generateRefreshToken(profile);
        return new SignInResponseDTO(accessToken, refreshToken);
    }

    async saveRefreshToken(profile: Profile, token: string) {
        const tokenHash = await argon.hash(token);

        const expiresIn = this.configService.get<StringValue>('JWT_REFRESH_EXPIRES_IN');

        if (!expiresIn) {
            throw new InternalServerErrorException('Server configuration error');
        }

        const expiresAt = ms(expiresIn);
        const expiresDate = new Date(Date.now() + expiresAt);

        return this.refreshTokenRepository.save({
            profile,
            tokenHash,
            expiresAt: expiresDate,
        });
    }

    private async generateAccessToken(profile: Profile) {
        const access_token = this.jwtService.signAsync({
            sub: profile.id,
            login: profile.login,
        },
        {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
        }
        );
        return access_token;
    }

    private async generateRefreshToken(profile: Profile) {
        const refresh_token = this.jwtService.signAsync({
            sub: profile.id,
            login: profile.login,
        },
        {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
        }
        );
        return refresh_token;
    }
}
