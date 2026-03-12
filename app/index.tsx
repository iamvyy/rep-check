import { useAuthStore } from '@/features/auth/store/use-auth-store';
import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  const { token } = useAuthStore();
  const hasHydrated = useAuthStore.persist.hasHydrated();

  if (!hasHydrated) return null;

  return <Redirect href={token ? '/(main)/home' : '/(auth)/login'} />;
}
