import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDTO {
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
}
