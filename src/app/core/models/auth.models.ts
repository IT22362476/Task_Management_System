export type UserRole = 'Admin' | 'Employee';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface GoogleAuthRequest {
  idToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  department?: string;
  provider: string;
  isActive: boolean;
  createdAt: string;
}
