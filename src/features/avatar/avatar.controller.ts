import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAccessGuard } from '../../auth/guard/access.guard.ts';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from '../../common/decorators/get-user.decorator.ts';
import type { BaseUser } from '../../auth/types/base-user.type.ts';
import { AvatarService } from './avatar.service.ts';
import type { IUploadedMulterFile } from '../../providers/files/s3/interfaces/upload-file.interface.ts';
import { FileValidationPipe } from '../../common/pipes/file-validation.pipe.ts';

@UseGuards(JwtAccessGuard)
@Controller('profile/avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Put()
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @GetUser<BaseUser>() user: BaseUser,
    @UploadedFile(FileValidationPipe) file: IUploadedMulterFile,
  ) {
    return await this.avatarService.uploadFile(user.id, file);
  }

  @Delete(':fileName')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAvatar(
    @GetUser<BaseUser>() user: BaseUser,
    @Param('fileName') fileName: string,
  ) {
    await this.avatarService.deleteAvatar(user.id, fileName);
  }
}
