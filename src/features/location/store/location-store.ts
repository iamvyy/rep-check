import * as Location from 'expo-location';
import { create } from 'zustand';

interface LocationState {
  coords: Location.LocationObjectCoords | null;
  address: Location.LocationGeocodedAddress | null;
  errorMsg: string | null;
  setCoords: (coords: Location.LocationObjectCoords) => void;
  setAddress: (address: Location.LocationGeocodedAddress) => void;
  setError: (msg: string | null) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  coords: null,
  address: null,
  errorMsg: null,
  setCoords: (coords) => set({ coords, errorMsg: null }),
  setAddress: (address) => set({ address }),
  setError: (msg) => set({ errorMsg: msg }),
}));
