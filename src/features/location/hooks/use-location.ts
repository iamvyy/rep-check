import { useLocationStore } from '@/features/location/store/location-store';
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';

export const useLocation = () => {
  const { coords, address, setCoords, setAddress, setError } =
    useLocationStore();
  const [loading, setLoading] = useState(false);

  const requestLocation = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      const { status: existingStatus } =
        await Location.getForegroundPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
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

        if (reverse && reverse.length > 0) {
          setAddress(reverse[0]);
        }
      } catch (geocodeError) {
        if (__DEV__) {
          console.warn('[Location Feature] Geocoding failed:', geocodeError);
        }
      }
    } catch (e: any) {
      setError(
        e.message || 'An unexpected error occurred while fetching location',
      );
    } finally {
      setLoading(false);
    }
  }, [setCoords, setAddress, setError, loading]);

  useEffect(() => {
    if (!coords) {
      requestLocation();
    }
  }, [coords, requestLocation]);

  return {
    coords,
    address,
    requestLocation,
    loading,
  };
};
