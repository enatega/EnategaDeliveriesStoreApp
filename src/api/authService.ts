import apiClient from './apiClient';
import { AuthSessionResponse, AuthUser, LoginPayload } from './authTypes';

const AUTH_BASE = '/api/v1/auth';

export const authService = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthSessionResponse>(AUTH_BASE + '/login', payload, { skipAuth: true }),

  me: () => apiClient.get<AuthUser>(AUTH_BASE + '/me'),

  // Useful for local app wiring before backend auth endpoints are ready.
  createDemoSession: async (appTag: 'store' | 'rider'): Promise<AuthSessionResponse> => ({
    accessToken: appTag + '-demo-token',
    refreshToken: null,
    user: {
      id: appTag + '-demo-user',
      name: appTag === 'store' ? 'Store Demo User' : 'Rider Demo User',
      email: appTag + '@demo.enatega.app',
    },
  }),
};
