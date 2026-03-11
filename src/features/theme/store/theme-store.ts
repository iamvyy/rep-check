import { storage } from '@/core/storage/mmkv-storage';
import { z } from 'zod';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const ThemeSchema = z.object({
  mode: z.enum(['light', 'dark', 'system']),
});

type ThemeMode = z.infer<typeof ThemeSchema>['mode'];

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',

      setMode: (mode) => {
        set({ mode });
      },
    }),
    {
      name: 'user-theme-pref',
      storage: createJSONStorage(() => storage.zustandAdapter),
      version: 1,
      partialize: (state) => ({
        mode: state.mode,
      }),
      migrate: (persistedState: unknown) => {
        const result = ThemeSchema.safeParse(persistedState);

        if (!result.success) {
          if (__DEV__) {
            console.warn('[ThemeStore] Invalid persisted theme state');
          }

          return { mode: 'system' };
        }

        return result.data;
      },
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('[ThemeStore] Hydration error:', error);
            return;
          }

          if (__DEV__) {
            console.log('[ThemeStore] Hydrated:', state);
          }
        };
      },
    },
  ),
);
