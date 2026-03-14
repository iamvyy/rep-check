import { useAuthStore } from '@/features/auth/store/auth-store';
import { Redirect, Stack } from 'expo-router';

export default function MainLayout() {
  const { token } = useAuthStore();

  if (!token) return <Redirect href="/(auth)/login" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="workout" />
    </Stack>
  );
}
