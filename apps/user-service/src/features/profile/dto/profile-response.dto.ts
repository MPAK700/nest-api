import { IsEmail, IsNumber, IsPositive, IsString } from 'class-validator';
import { Profile } from '../entity/profile.entity.ts';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDTO {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  login: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  age: number;

  @ApiProperty()
  @IsString()
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
