import { IsString } from 'class-validator';

export class SignInResponseDTO {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  constructor(access_token: string, refresh_token: string) {
    this.accessToken = access_token;
    this.refreshToken = refresh_token;
  }
}
