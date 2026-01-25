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
} from '@nestjs/common';
import { ProfileService } from './profile.service.ts';
import { JwtAccessGuard } from '../../auth/guard/access.guard.ts';
import { GetUser } from '../../common/decorator/get-user.decorator.ts';
import type { BaseUser } from '../../auth/types/base-user.type.ts';
import { PaginationQueryDTO } from './dto/pagination-query.dto.ts';
import { ProfileResponseDTO } from './dto/profile-response.dto.ts';
import { ProfileUpdateDTO } from './dto/profile-update.dto.ts';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedProfileResponseDTO } from './dto/paginated-profile-response.dto.ts';

@ApiTags('Profile')
@ApiBearerAuth('jwt')
@UseGuards(JwtAccessGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Получить профиль текущего пользователя' })
  @ApiOkResponse({ type: ProfileResponseDTO })
  @Get('my')
  async getMyProfile(@GetUser<BaseUser>() user: BaseUser) {
    const profile = await this.profileService.findById(user.id);

    return ProfileResponseDTO.fromEntity(profile);
  }

  @ApiOkResponse({ type: PaginatedProfileResponseDTO })
  @Get('all')
  async getAllProfiles(@Query() query: PaginationQueryDTO) {
    const options = { page: query.page, limit: query.limit };
    const pagination = await this.profileService.paginate(options);
    const result = pagination.items.map((profileEntity) =>
      ProfileResponseDTO.fromEntity(profileEntity),
    );
    return {
      items: result,
      meta: pagination.meta,
    };
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

    return ProfileResponseDTO.fromEntity(updatedProfile);
  }
}
