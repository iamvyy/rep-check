import {
  getLocationFullData,
  LocationError,
  LocationServiceError,
} from '@/features/location/service/location-service';
import * as Location from 'expo-location';
import { create } from 'zustand';

interface LocationState {
  coords: Location.LocationObjectCoords | null;
  address: Location.LocationGeocodedAddress | null;
  errorCode: LocationError | null;
  loading: boolean;
  requestLocation: (force?: boolean) => Promise<void>;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  coords: null,
  address: null,
  errorCode: null,
  loading: false,

  requestLocation: async (force = false) => {
    if (get().loading) return;

    try {
      set({ loading: true, errorCode: null });

      const data = await getLocationFullData(force);

      set({
        coords: data.coords,
        address: data.address,
        errorCode: null,
      });
    } catch (error: unknown) {
      if (error instanceof LocationServiceError) {
        set({ errorCode: error.code });
      } else {
        set({ errorCode: LocationError.UNEXPECTED });
      }
    } finally {
      set({ loading: false });
    }
  },

  clearLocation: () => set({ coords: null, address: null, errorCode: null }),
}));
