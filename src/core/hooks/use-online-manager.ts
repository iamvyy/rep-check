import { onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export function useOnlineManager() {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      return onlineManager.setEventListener((setOnline) => {
        let subscription: { remove: () => void } | undefined;

        Network.getNetworkStateAsync().then((state) => {
          setOnline(!!state.isConnected);
        });

        subscription = Network.addNetworkStateListener((state) => {
          setOnline(!!state.isConnected);
        });

        return () => {
          subscription?.remove();
        };
      });
    }
  }, []);
}
