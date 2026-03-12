import { useAuthStore } from '@/features/auth/store/use-auth-store';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { token } = useAuthStore();

  if (token) {
    return <Redirect href="/(main)/home" />;
  }

  return <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />;
}
