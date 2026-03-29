import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export function useOnlineManager() {
  useEffect(() => {
    if (Platform.OS === 'web') return;

    onlineManager.setOnline(true);

    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline =
        state.isConnected != null && state.isInternetReachable != null
          ? state.isConnected && state.isInternetReachable
          : true;

      onlineManager.setOnline(isOnline);
    });

    return () => unsubscribe();
  }, []);
}
