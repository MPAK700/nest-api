import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from '../services/profile.service.ts';
import { JwtAccessGuard } from '../../../auth/guard/access.guard.ts';
import { GetUser } from '../../../common/decorators/get-user.decorator.ts';
import type { BaseUser } from '../../../auth/types/base-user.type.ts';
import { PaginationQueryDTO } from '../../../common/pagiantion/pagination-query.dto.ts';
import { ProfileResponseDTO } from '../dto/profile-response.dto.ts';
import { ProfileUpdateDTO } from '../dto/profile-update.dto.ts';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProfileSearchService } from '../services/profile-search.service.ts';
import { PaginatedResultDTO } from '../../../common/pagiantion/paginated.dto.ts';
import { ActiveProfilesQueryDTO } from '../dto/active-profiles-query.dto.ts';
import { MyProfileCacheInterceptor } from '../../../providers/cache/interceptor/my-profile-cache.interceptor.ts';
import { ProfilesListCacheInterceptor } from '../../../providers/cache/interceptor/profiles-list-cache.interceptor.ts';
import { ProfileAvatarResponseDTO } from '../dto/profile-avatar-response.dto.ts';

@ApiTags('Profile')
@ApiBearerAuth('jwt')
@UseGuards(JwtAccessGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly profileSearchService: ProfileSearchService,
  ) {}

  @ApiOperation({ summary: 'Получить профиль текущего пользователя' })
  @ApiOkResponse({ type: ProfileResponseDTO })
  @Get('my')
  @UseInterceptors(MyProfileCacheInterceptor)
  async getMyProfile(@GetUser<BaseUser>() user: BaseUser) {
    return this.profileService.getMyProfile(user.id);
  }

  @ApiOkResponse({ type: PaginatedResultDTO<ProfileResponseDTO> })
  @Get('all')
  @UseInterceptors(ProfilesListCacheInterceptor)
  async getAllProfiles(@Query() query: PaginationQueryDTO) {
    return this.profileService.getAllProfiles({
      page: query.page,
      limit: query.limit,
    });
  }

  @ApiOkResponse({ type: PaginatedResultDTO<ProfileAvatarResponseDTO> })
  @Get('active-profiles')
  async getActiveProfiles(@Query() query: ActiveProfilesQueryDTO) {
    const result = await this.profileSearchService.getActiveProfiles(
      query.minAge,
      query.maxAge,
      query.limit,
      query.page,
    );
    return result;
  }

  @Delete('delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProfile(@GetUser() user: BaseUser) {
    await this.profileService.deleteProfile(user.id);
  }

  @Patch('update')
  async updateProfile(
    @GetUser() user: BaseUser,
    @Body() profileDTO: ProfileUpdateDTO,
  ) {
    const updatedProfile = await this.profileService.updateProfile(
      user.id,
      profileDTO,
    );

    return updatedProfile;
  }
}
