import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Profile } from './entity/profile.entity.ts';
import { ProfileDTO } from './dto/profile.dto.ts';
import { hash } from '../common/utils/hash.ts';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async createProfile(profileDto: ProfileDTO): Promise<Profile> {
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
        if (driverError.code  === '23505') {
          throw new ConflictException('User already exists');
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async findByLogin(login: string): Promise<Profile | null> {
    return this.profileRepository.findOne({
      where: { login },
    });
  }

  async findById(id: number): Promise<Profile | null> {
    return this.profileRepository.findOne({
      where: { id },
    });
  }
}
