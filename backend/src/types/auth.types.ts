import { UserRole } from './enums';

export interface AuthPayload {
  sub: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
