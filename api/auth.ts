// src/api/auth.ts
import apiClient from './client';

export interface AuthResponse {
  token: string;
  userId: string;
  fullName: string;
  email: string;
  role: string;
}

export const authApi = {
  register: (fullName: string, email: string, password: string) =>
    apiClient
      .post<AuthResponse>('/auth/register', { fullName, email, password })
      .then((r) => r.data),

  login: (email: string, password: string) =>
    apiClient
      .post<AuthResponse>('/auth/login', { email, password })
      .then((r) => r.data),

  me: () => apiClient.get<AuthResponse>('/auth/me').then((r) => r.data),
};
