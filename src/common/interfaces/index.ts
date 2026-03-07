export interface JwtPayload {
  sub: number;
  email: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface UserRow {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: Date;
}

export interface UserPublic {
  id: number;
  email: string;
  name: string;
  created_at: Date;
}
