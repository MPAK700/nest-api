import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Avatar } from './entity/avatar.entity.ts';
import { Repository } from 'typeorm';
import { IFileService } from '../../providers/files/files.adapter.ts';
import { IUploadedMulterFile } from '../../providers/files/s3/interfaces/upload-file.interface.ts';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AvatarService {
  private readonly logger = new Logger(AvatarService.name);
  private readonly AVATAR_MAX_LIMIT: number;

  constructor(
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,
    private readonly configService: ConfigService,
    private readonly fileService: IFileService,
  ) {
    this.AVATAR_MAX_LIMIT = parseInt(
      this.configService.get<string>('AVATAR_MAX_LIMIT', '5'),
      10,
    );
  }

  async uploadFile(profileId: number, file: IUploadedMulterFile) {
    const count = await this.avatarRepository.count({
      where: {
        profile: { id: profileId },
      },
    });

    if (count >= this.AVATAR_MAX_LIMIT) {
      this.logger.warn(
        `Avatar limit exceeded for profileId=${profileId}, count=${count}`,
      );
      throw new BadRequestException('Too many active avatars');
    }

    const { folder, fileName } = this.generateAvatarFileName(
      profileId,
      file.originalname,
    );

    await this.fileService.uploadFile({ file, folder, name: fileName });

    const avatarEntity = this.avatarRepository.create({
      fileName,
      profile: { id: profileId },
    });

    const savedAvatar = this.avatarRepository.save(avatarEntity);
    this.logger.log(
      `Avatar saved for profileId=${profileId}, fileName=${fileName}`,
    );

    return savedAvatar;
  }

  async deleteAvatar(profileId: number, fileName: string) {
    const result = await this.avatarRepository.softDelete({
      profile: { id: profileId },
      fileName,
    });

    if (!result.affected) {
      this.logger.warn(
        `Avatar not found for profileId=${profileId}, fileName=${fileName}`,
      );
      throw new NotFoundException('Avatar not found');
    }
    const path = `avatars/${profileId}/${fileName}`;

    await this.fileService.removeFile({ path });
    this.logger.log(
      `Avatar deleted: profileId=${profileId}, fileName=${fileName}`,
    );
  }

  async countActiveAvatarsForProfile(profileId: number) {
    const count = await this.avatarRepository
      .createQueryBuilder('avatar')
      .where('avatar.profileId = :profileId', { profileId })
      .andWhere('avatar.deletedAt IS NULL')
      .getCount();

    return count;
  }
  private generateAvatarFileName(profileId: number, originalName: string) {
    const timestamp = Date.now().toString();
    const folder = profileId.toString();
    const extension = originalName.split('.').pop();
    const fileName = `${timestamp}.${extension}`;
    this.logger.log(`Generated avatar fileName=${fileName}, folder=${folder}`);
    return { folder, fileName };
  }
}
