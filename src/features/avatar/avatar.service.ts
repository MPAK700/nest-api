import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Avatar } from './entity/avatar.entity.ts';
import { Repository } from 'typeorm';
import { Profile } from '../profile/entity/profile.entity.ts';
import { IFileService } from '../../providers/files/files.adapter.ts';

@Injectable()
export class AvatarService {
  private readonly logger = new Logger(AvatarService.name);

  constructor(
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly fileService: IFileService,
  ) {}

  async uploadFile(id: number, file: Express.Multer.File) {
    const currentProfile = await this.profileRepository.findOne({
      where: {
        id,
      },
    });

    if (!currentProfile) {
      return new NotFoundException('Profile not found');
    }

    const [avatars, count] = await this.avatarRepository.findAndCount({
      where: {
        profile: currentProfile,
      },
    });

    if (count > 4 && avatars) {
      return new InternalServerErrorException('Too many avatars');
    }

    const timestamp = Date.now().toString();
    const folder = id.toString();
    await this.fileService.uploadFile({ file, folder, name: timestamp });
    this.avatarRepository.create();
  }
}
