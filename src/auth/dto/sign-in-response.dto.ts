export class SignInResponseDTO {
  accessToken: string;
  refreshToken: string;

  constructor(access_token: string, refresh_token: string) {
    this.accessToken = access_token;
    this.refreshToken = refresh_token;
  }
}
