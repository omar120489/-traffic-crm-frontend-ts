/**
 * Auth service for login/logout operations
 * Sprint 3: FE-AUTH-01, FE-AUTH-02
 */

import { http } from '@/lib/http';

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface LoginResponse {
  readonly accessToken: string;
  readonly refreshToken?: string;
  readonly expiresIn?: number;
}

export async function login(req: LoginRequest): Promise<LoginResponse> {
  const response = await http.post<LoginResponse>('/api/auth/login', req);
  return response.data;
}

export async function refreshToken(token: string): Promise<LoginResponse> {
  const response = await http.post<LoginResponse>('/api/auth/refresh', { refreshToken: token });
  return response.data;
}

