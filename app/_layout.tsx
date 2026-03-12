import { useAuthStore } from '@/features/auth/store/auth-store';
import { Slot, useRootNavigationState, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hasHydrated = useAuthStore.persist.hasHydrated();
  const navigationState = useRootNavigationState();
  const segments = useSegments();

  useEffect(() => {
    if (hasHydrated && navigationState?.key) {
      // Delaying by 50ms-100ms can sometimes prevent a single-frame flicker
      const timeout = setTimeout(() => {
        SplashScreen.hideAsync();
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [hasHydrated, navigationState?.key]);

  if (!hasHydrated || !navigationState?.key) return null;

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View
          key={segments[0]}
          entering={FadeIn.duration(400)}
          style={{ flex: 1 }}
        >
          <Slot />
        </Animated.View>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
