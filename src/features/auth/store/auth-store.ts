import { storage } from '@/core/storage/mmkv-storage';
import { mockLoginApi, mockLogoutApi } from '@/features/auth/api/mock-login-logout';
import User from '@/features/auth/interfaces/user';
import { LoginFormData } from '@/features/auth/schemas/login-schema';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (data: LoginFormData) => void;
  logout: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (data: LoginFormData) => {
        const response = await mockLoginApi(data);

        set({ user: response.user, token: response.token });
      },
      logout: async () => {
        const response = await mockLogoutApi(true);

        set({ user: null, token: null });

        return response;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => storage.zustandAdapter),
    },
  ),
);
