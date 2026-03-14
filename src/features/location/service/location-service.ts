import * as Location from 'expo-location';

export class LocationServiceError extends Error {
  code: LocationError;

  constructor(code: LocationError) {
    super(code);
    this.code = code;
    this.name = 'LocationServiceError';
  }
}

export enum LocationError {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  PERMISSION_PERMANENTLY_DENIED = 'PERMISSION_PERMANENTLY_DENIED',
  TIMEOUT = 'TIMEOUT',
  GEOCODE_FAILED = 'GEOCODE_FAILED',
  UNEXPECTED = 'UNEXPECTED',
}

export interface LocationResult {
  coords: Location.LocationObjectCoords;
  address: Location.LocationGeocodedAddress | null;
}

let memoryCache: { data: LocationResult; timestamp: number } | null = null;
let pendingRequest: Promise<LocationResult> | null = null;

const CACHE_TTL = 5 * 60 * 1000;
const TIMEOUT_MS = 10000;

export const getLocationFullData = async (
  forceRefresh = false,
): Promise<LocationResult> => {
  if (
    !forceRefresh &&
    memoryCache &&
    Date.now() - memoryCache.timestamp < CACHE_TTL
  ) {
    return memoryCache.data;
  }

  if (!forceRefresh && pendingRequest) {
    return pendingRequest;
  }

  pendingRequest = (async () => {
    try {
      const { status: existingStatus } =
        await Location.getForegroundPermissionsAsync();

      if (existingStatus !== 'granted') {
        const { status, canAskAgain } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          throw new LocationServiceError(
            canAskAgain
              ? LocationError.PERMISSION_DENIED
              : LocationError.PERMISSION_PERMANENTLY_DENIED,
          );
        }
      }

      const lastKnown = await Location.getLastKnownPositionAsync();

      const fetchLocationWithTimeout = (
        accuracy: Location.Accuracy,
      ): Promise<Location.LocationObject> => {
        let timeoutId: ReturnType<typeof setTimeout>;
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(
            () => reject(new LocationServiceError(LocationError.TIMEOUT)),
            TIMEOUT_MS,
          );
        });

        const locationPromise = Location.getCurrentPositionAsync({ accuracy });

        return Promise.race([locationPromise, timeoutPromise]).finally(() =>
          clearTimeout(timeoutId!),
        );
      };

      let coords: Location.LocationObjectCoords | null = null;
      const ACCURACY_THRESHOLD = 100;

      try {
        const balancedLocation = await fetchLocationWithTimeout(
          Location.Accuracy.Balanced,
        );

        if (
          balancedLocation.coords.accuracy &&
          balancedLocation.coords.accuracy <= ACCURACY_THRESHOLD
        ) {
          coords = balancedLocation.coords;
        } else {
          const highLocation = await fetchLocationWithTimeout(
            Location.Accuracy.High,
          );
          coords = highLocation.coords;
        }
      } catch (err) {
        try {
          const highLocation = await fetchLocationWithTimeout(
            Location.Accuracy.High,
          );
          coords = highLocation.coords;
        } catch (innerErr) {
          if (lastKnown?.coords) {
            coords = lastKnown.coords;
          } else {
            throw innerErr;
          }
        }
      }

      if (!coords) {
        if (lastKnown?.coords) {
          coords = lastKnown.coords;
        } else {
          throw new LocationServiceError(LocationError.UNEXPECTED);
        }
      }

      let address: Location.LocationGeocodedAddress | null = null;

      try {
        const reverse = await Location.reverseGeocodeAsync({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });

        address = reverse?.[0] || null;
      } catch {
        if (__DEV__) console.warn(LocationError.GEOCODE_FAILED);
      }

      const result: LocationResult = { coords, address };
      memoryCache = { data: result, timestamp: Date.now() };

      return result;
    } finally {
      pendingRequest = null;
    }
  })();

  return pendingRequest;
};
