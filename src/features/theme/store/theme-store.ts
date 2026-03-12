import { storage } from '@/core/storage/mmkv-storage';
import { z } from 'zod';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const ThemeSchema = z.object({
  mode: z.enum(['light', 'dark', 'system']),
});

export type ThemePreference = z.infer<typeof ThemeSchema>['mode'];

interface ThemeState {
  mode: ThemePreference;
  setMode: (mode: ThemePreference) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'user-theme-pref',
      storage: createJSONStorage(() => storage.zustandAdapter),
      merge: (persistedState, currentState) => {
        const result = ThemeSchema.safeParse(persistedState);
        return result.success
          ? { ...currentState, ...result.data }
          : currentState;
      },
    },
  ),
);
