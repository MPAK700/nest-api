import { Controller, Delete, Get, Patch, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service.ts';
import { JwtAccessGuard } from '../auth/guard/access.guard.ts';
import { GetUser } from '../common/decorator/get-user.decorator.ts';
import type { BaseUser } from '../auth/types/base-user.type.ts';


@UseGuards(JwtAccessGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('my')
  getMyProfile(@GetUser<BaseUser>() user: BaseUser) {
    return this.profileService.findByLogin(user.login);
  }

  @Delete('my')
  deleteMyProfile() {}

  @Patch('my')
  updateMyProfile() {}
}
