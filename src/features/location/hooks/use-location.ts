import { useLocationStore } from '@/features/location/store/location-store';
import * as Location from 'expo-location';
import { useState } from 'react';

export const useLocation = () => {
  const { coords, address, setCoords, setAddress, setError } =
    useLocationStore();

  const [loading, setLoading] = useState(false);

  const requestLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.getForegroundPermissionsAsync();

      let finalStatus = status;

      if (status !== 'granted') {
        const { status: requestedStatus } =
          await Location.requestForegroundPermissionsAsync();
        finalStatus = requestedStatus;
      }

      if (finalStatus !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setCoords(location.coords);

      try {
        const reverse = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverse?.length) {
          setAddress(reverse[0]);
        }
      } catch {}
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { coords, address, requestLocation, loading };
};
