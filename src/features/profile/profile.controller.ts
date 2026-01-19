import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Patch, Query, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service.ts';
import { JwtAccessGuard } from '../../auth/guard/access.guard.ts';
import { GetUser } from '../../common/decorator/get-user.decorator.ts';
import type { BaseUser } from '../../auth/types/base-user.type.ts';
import { PaginationQueryDTO } from './dto/pagination-query.dto.ts';
import { ProfileResponseDTO } from './dto/profile-response.dto.ts';
import { ProfileUpdateDTO } from './dto/profile-edit.dto.ts';

@UseGuards(JwtAccessGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('my')
  async getMyProfile(@GetUser<BaseUser>() user: BaseUser) {
    const profile = await this.profileService.findById(user.id);

    return ProfileResponseDTO.fromEntity(profile);
  }

  @Get('all')
  async getAllProfiles(@Query() query: PaginationQueryDTO ) {
    const options = {page: query.page, limit: query.limit};

    return this.profileService.paginate(options);
  }

  @Delete('delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProfile(@GetUser() user: BaseUser) {
    await this.profileService.deleteProfile(user.id);
    return 'Deleted succesfully'
  }

  @Patch('edit')
  async updateProfile(@GetUser() user: BaseUser, @Body() profileDTO: ProfileUpdateDTO) {
    const updatedProfile = await this.profileService.updateProfile(user.id, profileDTO);
  
    return ProfileResponseDTO.fromEntity(updatedProfile);
  }
}
