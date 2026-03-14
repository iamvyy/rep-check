import { useLocationStore } from '@/features/location/store/location-store';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

export const useLocation = () => {
  const { coords, address, errorCode, loading, requestLocation } =
    useLocationStore(
      useShallow((s) => ({
        coords: s.coords,
        address: s.address,
        errorCode: s.errorCode,
        loading: s.loading,
        requestLocation: s.requestLocation,
      })),
    );
  const hasAttemptedInitialFetch = useRef(false);

  useEffect(() => {
    if (!coords && !hasAttemptedInitialFetch.current) {
      hasAttemptedInitialFetch.current = true;
      requestLocation();
    }
  }, [coords, requestLocation]);

  return {
    coords,
    address,
    errorCode,
    loading,
    requestLocation,
  };
};
