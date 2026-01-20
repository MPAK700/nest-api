import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Profile } from './entity/profile.entity.ts';
import { ProfileCreateDTO } from './dto/profile-create.dto.ts';
import { hash } from '../../common/utils/hash.ts';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { ProfileUpdateDTO } from './dto/profile-update.dto.ts';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async createProfile(profileDto: ProfileCreateDTO): Promise<Profile> {
    const passwordHash = hash(profileDto.password);
    const entity = this.profileRepository.create({
      ...profileDto,
      password: passwordHash,
    });

    try {
      return await this.profileRepository.save(entity);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        const driverError = err.driverError as { code?: string };
        if (driverError.code === '23505') {
          throw new ConflictException('User already exists');
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Profile>> {
    return paginate<Profile>(this.profileRepository, options);
  }

  async updateProfile(id: number, updatedProfile: ProfileUpdateDTO) {
    const profile = await this.findById(id);
    Object.assign(profile, updatedProfile);

    await this.profileRepository.save(profile);
    return profile;
  }

  async deleteProfile(id: number) {
    const result = await this.profileRepository.softDelete(id);

    if (!result.affected) {
      throw new NotFoundException('Profile not found');
    }
  }

  async findByLogin(login: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: {
        login,
      },
    });
    if (!profile) {
      throw new NotFoundException();
    }
    return profile;
  }

  async findById(id: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: {
        id,
      },
    });
    if (!profile) {
      throw new NotFoundException();
    }
    return profile;
  }
}
