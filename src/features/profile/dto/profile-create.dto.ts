import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class ProfileCreateDTO {
  @ApiProperty({ format: 'email', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
    return value;
  })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
    return value;
  })
  login: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 28 })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  age: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
}
