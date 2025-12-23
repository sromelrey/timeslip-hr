export interface AuthPayload {
  sub: number;
  email: string;
  name: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
