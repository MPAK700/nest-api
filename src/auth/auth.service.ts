import { Injectable, UnauthorizedException } from '@nestjs/common';
import argon from 'argon2';
import { SignInResponseDTO } from './dto/sign-in-response.dto.ts';
import { ProfileService } from '../profile/profile.service.ts';
import { ProfileDTO } from '../profile/dto/profile.dto.ts';
import { SignInDTO } from '../profile/dto/sign-in.dto.ts';
import { JwtService } from '@nestjs/jwt';
import { Profile } from '../profile/entities/profile.entity.ts';

@Injectable()
export class AuthService {
    constructor(
        private readonly profileService: ProfileService,
        private readonly jwtService: JwtService
    ) { }

    async signUp(profileDto: ProfileDTO) {
        const createdProfile = await this.profileService.createProfile(profileDto);
        
        const access_token = await this.generateAccessToken(createdProfile);

        return new SignInResponseDTO(access_token, '');
    }

    async signIn(profileDto: SignInDTO): Promise<SignInResponseDTO> {
        const profile = await this.profileService.findByLogin(profileDto.login);

        if (!profile) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const pwMatches = await argon.verify(
            profile.password,
            profileDto.password
        );

        if (!pwMatches) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const access_token = await this.generateAccessToken(profile);
        return new SignInResponseDTO(access_token, 'refresh_token');
    }

    private async generateAccessToken(profile: Profile) {
        return this.jwtService.signAsync({
            sub: profile.id,
            login: profile.login,
        });
    }

    private async generateRefreshToken(profile: Profile) {
        return this.jwtService.signAsync({
            sub: profile.id,
            login: profile.login,
        });
    }
}
