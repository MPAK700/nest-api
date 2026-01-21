import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SignInResponseDTO {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
