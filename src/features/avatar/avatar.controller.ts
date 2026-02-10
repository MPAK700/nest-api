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
import type { IUploadedMulterFile } from '../../providers/files/s3/interfaces/upload-file.interface.ts';

@UseGuards(JwtAccessGuard)
@Controller('profile/avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Put()
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @GetUser<BaseUser>() user: BaseUser,
    @UploadedFile() file: IUploadedMulterFile,
  ) {
    return this.avatarService.uploadFile(user.id, file);
  }

  @Delete()
  deleteAvatar(@GetUser<BaseUser>() user: BaseUser) {
    console.log(user);
    //return this.avatarService.deleteAvatar();
  }
}
