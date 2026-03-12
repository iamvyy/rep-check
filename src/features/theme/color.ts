export type ThemeMode = 'dark' | 'light';

export type AppTheme = {
  mode: ThemeMode;
  background: string;
  surface: string;
  surfaceSecondary: string;
  accent: string;
  accentSoft: string;
  textPrimary: string;
  textSecondary: string;
  borderSubtle: string;
  glow: string;
  warning: string;
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  background: '#050816',
  surface: '#0b1020',
  surfaceSecondary: '#13172a',
  accent: '#38bdf8',
  accentSoft: 'rgba(56, 189, 248, 0.16)',
  textPrimary: '#e5f2ff',
  textSecondary: '#94a3b8',
  borderSubtle: 'rgba(148, 163, 184, 0.3)',
  glow: 'rgba(56, 189, 248, 0.75)',
  warning: '#8B0000',
};

export const lightTheme: AppTheme = {
  mode: 'light',
  background: '#f5f5f7',
  surface: '#ffffff',
  surfaceSecondary: '#f1f5f9',
  accent: '#2563eb',
  accentSoft: 'rgba(37, 99, 235, 0.1)',
  textPrimary: '#0f172a',
  textSecondary: '#64748b',
  borderSubtle: 'rgba(148, 163, 184, 0.45)',
  glow: 'rgba(37, 99, 235, 0.75)',
  warning: '#FF0000',
};

export const themes = {
  dark: darkTheme,
  light: lightTheme,
};
