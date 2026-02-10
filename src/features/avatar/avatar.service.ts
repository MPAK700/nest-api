import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Avatar } from './entity/avatar.entity.ts';
import { Repository } from 'typeorm';
import { IFileService } from '../../providers/files/files.adapter.ts';
import { IUploadedMulterFile } from '../../providers/files/s3/interfaces/upload-file.interface.ts';
import { ProfileService } from '../profile/profile.service.ts';

@Injectable()
export class AvatarService {
  private readonly logger = new Logger(AvatarService.name);

  constructor(
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,
    private readonly profileService: ProfileService,
    private readonly fileService: IFileService,
  ) {}

  async uploadFile(profileId: number, file: IUploadedMulterFile) {
    const profile = await this.profileService.findById(profileId);

    if (!profile) {
      return new NotFoundException('Profile not found');
    }

    const count = await this.avatarRepository.count({
      where: {
        profile: { id: profileId },
      },
    });

    if (count > 4) {
      return new InternalServerErrorException('Too many avatars');
    }

    const timestamp = Date.now().toString();
    const folder = profileId.toString();
    await this.fileService.uploadFile({ file, folder, name: timestamp });
    const avatarEntity = this.avatarRepository.create({
      fileName: timestamp,
      isCurrent: true,
      profile: { id: profileId },
    });

    return this.avatarRepository.save(avatarEntity);
  }

  deleteAvatar(profileId: number, fileName: string) {
    return this.avatarRepository.softDelete(fileName);
  }
}
