import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Profile } from '../entity/profile.entity.ts';
import { ProfileCreateDTO } from '../dto/profile-create.dto.ts';
import { hash } from '../../../common/utils/hash.ts';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ProfileUpdateDTO } from '../dto/profile-update.dto.ts';
import { ProfileMapper } from '../mapper/profile.mapper.ts';
import { PaginationMapper } from '../../../common/pagiantion/pagination.mapper.ts';
import { ProfileResponseDTO } from '../dto/profile-response.dto.ts';
import { PaginatedResultDTO } from '../../../common/pagiantion/paginated.dto.ts';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async getMyProfile(id: number) {
    const profile = await this.findById(id);
    this.logger.log(`Get user profile with id=${id}`);
    return ProfileMapper.toDTO(profile);
  }

  async createProfile(profileDto: ProfileCreateDTO): Promise<Profile> {
    const passwordHash = hash(profileDto.password);
    const entity = this.profileRepository.create({
      ...profileDto,
      password: passwordHash,
    });

    try {
      const savedProfile = await this.profileRepository.save(entity);
      this.logger.log(`Saved profile for login=${savedProfile.login}`);
      return savedProfile;
    } catch (err) {
      if (err instanceof QueryFailedError) {
        const driverError = err.driverError as { code?: string };
        if (driverError.code === '23505') {
          this.logger.warn(`User already exists`);
          throw new ConflictException('User already exists');
        }
      }
      this.logger.error(`Database error: ${JSON.stringify(err)}}`);
      throw new InternalServerErrorException();
    }
  }

  async getAllProfiles(
    options: IPaginationOptions,
  ): Promise<PaginatedResultDTO<ProfileResponseDTO>> {
    const pagination = await paginate<Profile>(this.profileRepository, options);
    const paginatedResult: PaginatedResultDTO<Profile> = {
      items: pagination.items,
      meta: {
        itemCount: pagination.meta.itemCount,
        itemsPerPage: pagination.meta.itemsPerPage,
        currentPage: pagination.meta.currentPage,
        totalItems: pagination.meta.totalItems,
        totalPages: pagination.meta.totalPages,
      },
    };
    return PaginationMapper.mapItems(paginatedResult, (profile) =>
      ProfileMapper.toDTO(profile),
    );
  }

  async updateProfile(id: number, updatedProfile: ProfileUpdateDTO) {
    const profile = await this.findById(id);
    Object.assign(profile, updatedProfile);

    const savedProfile = await this.profileRepository.save(profile);
    this.logger.log(`Profile with id=${savedProfile.id} was updated`);
    return ProfileMapper.toDTO(profile);
  }

  async deleteProfile(id: number) {
    const result = await this.profileRepository.softDelete(id);

    if (!result.affected) {
      this.logger.warn(`Profile with id=${id} not found`);
      throw new NotFoundException('Profile not found');
    }
    this.logger.log(`Profile with id=${id} was deleted`);
  }

  async findByLogin(login: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: {
        login,
      },
    });
    if (!profile) {
      this.logger.warn(`Profile with login=${login} not found`);
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
      this.logger.warn(`Profile with id=${id} not found`);
      throw new NotFoundException();
    }
    return profile;
  }
}
