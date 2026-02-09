import {
  Controller,
  Delete,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAccessGuard } from '../../auth/guard/access.guard.ts';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from '../../common/decorator/get-user.decorator.ts';
import type { BaseUser } from '../../auth/types/base-user.type.ts';
import { AvatarService } from './avatar.service.ts';

@UseGuards(JwtAccessGuard)
@Controller('profile/avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Put()
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @GetUser<BaseUser>() user: BaseUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.avatarService.uploadFile(user.id, file);
  }

  @Delete()
  deleteAvatar(@GetUser<BaseUser>() user: BaseUser) {
    return user;
  }
}
