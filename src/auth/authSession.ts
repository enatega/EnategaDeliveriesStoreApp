import * as SecureStore from 'expo-secure-store';
import { tokenManager } from '../api/apiClient';
import type { AuthSessionResponse, AuthUser, ProfileEntry } from '../api/authTypes';

const USER_KEY = 'deliveries_store_app_auth_user';
const PROFILES_KEY = 'deliveries_store_app_auth_profiles';

export type AuthSession = {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  profiles: ProfileEntry[] | null;
};

const getUser = async (): Promise<AuthUser | null> => {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
};

const getProfiles = async (): Promise<ProfileEntry[] | null> => {
  const raw = await SecureStore.getItemAsync(PROFILES_KEY);
  return raw ? (JSON.parse(raw) as ProfileEntry[]) : null;
};

export const authSession = {
  setSession: async (payload: AuthSessionResponse) => {
    await tokenManager.setToken(payload.accessToken);

    if (payload.refreshToken) {
      await tokenManager.setRefreshToken(payload.refreshToken);
    } else {
      await tokenManager.removeRefreshToken();
    }

    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(payload.user));

    if (payload.profiles) {
      await SecureStore.setItemAsync(PROFILES_KEY, JSON.stringify(payload.profiles));
    } else {
      await SecureStore.deleteItemAsync(PROFILES_KEY);
    }

    return payload;
  },

  getSession: async (): Promise<AuthSession> => {
    const [token, refreshToken, user, profiles] = await Promise.all([
      tokenManager.getToken(),
      tokenManager.getRefreshToken(),
      getUser(),
      getProfiles(),
    ]);

    return { token, refreshToken, user, profiles };
  },

  clearSession: async () => {
    await tokenManager.clearAll();
    await SecureStore.deleteItemAsync(USER_KEY);
    await SecureStore.deleteItemAsync(PROFILES_KEY);
  },
};
