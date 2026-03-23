export interface AccessTokenPayload {
  sub: number;
  login: string;
}

export interface RefreshTokenPayload extends AccessTokenPayload {
  jti: string;
}
