import { QueryClientProvider } from '@tanstack/react-query';
import { Slot, useRootNavigationState } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GlobalErrorFallback } from '@/core/components/global-error-fallback';
import { useAppStateFocus } from '@/core/hooks/use-app-state-focus';
import { useOnlineManager } from '@/core/hooks/use-online-manager';
import { queryClient } from '@/core/lib/react-query';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { ErrorBoundary } from 'react-error-boundary';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useOnlineManager();
  useAppStateFocus();

  const hasHydrated = useAuthStore.persist.hasHydrated();
  const navigationState = useRootNavigationState();

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
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary
            FallbackComponent={GlobalErrorFallback}
            onReset={() => queryClient.resetQueries()}
          >
            <Animated.View entering={FadeIn.duration(400)} style={{ flex: 1 }}>
              <Slot />
            </Animated.View>
          </ErrorBoundary>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
