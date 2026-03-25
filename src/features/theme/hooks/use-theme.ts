import { themes } from '@/features/theme/color';
import { useThemeStore } from '@/features/theme/store/theme-store';
import { useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';

export const useTheme = () => {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  const systemScheme = useColorScheme();

  const resolvedMode = mode === 'system' ? (systemScheme ?? 'dark') : mode;

  const colors = useMemo(() => themes[resolvedMode], [resolvedMode]);

  const toggleMode = useCallback(
    () => setMode(resolvedMode === 'dark' ? 'light' : 'dark'),
    [setMode, resolvedMode],
  );

  return {
    mode,
    colors,
    isDark: resolvedMode === 'dark',
    setMode,
    toggleMode,
  };
};
