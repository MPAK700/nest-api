import { Controller, Delete, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service.ts';
import { JwtAccessGuard } from '../auth/auth.guard.ts';

@UseGuards(JwtAccessGuard)
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get('my')
    getMyProfile(@Req() request: any) {
        return request.user;
    }

    @Delete('my')
    deleteMyProfile(
    ) {
    }

    @Patch('my')
    updateMyProfile(
    ) {
    }
}
