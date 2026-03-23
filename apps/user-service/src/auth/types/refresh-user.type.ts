import { BaseUser } from './base-user.type.ts';

export interface RefreshUser extends BaseUser {
  refreshToken: string;
  refreshTokenJti: string;
}
