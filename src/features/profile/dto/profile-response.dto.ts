import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { Profile } from '../entity/profile.entity.ts';

export class ProfileResponseDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  login: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  age: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  static fromEntity(profile: Profile): ProfileResponseDTO {
    return {
      email: profile.email,
      login: profile.login,
      age: profile.age,
      description: profile.description,
    };
  }
}
