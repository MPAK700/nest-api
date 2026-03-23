import { ProfileCreateDTO } from './profile-create.dto.ts';
import { PartialType } from '@nestjs/mapped-types';

export class ProfileUpdateDTO extends PartialType(ProfileCreateDTO) {}
