import { Controller, Delete, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service.ts';
import { JwtAccessGuard } from '../auth/guard/access.guard.ts';
import { GetCurrentUser } from '../common/decorator/get-current-user.decorator.ts';
import type { BaseUser } from '../auth/types/base-user.type.ts';

@UseGuards(JwtAccessGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('my')
  getMyProfile(@GetCurrentUser() user: BaseUser) {
    return user;
  }

  @Delete('my')
  deleteMyProfile() {}

  @Patch('my')
  updateMyProfile() {}
}
