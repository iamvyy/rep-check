import { useLocation } from '@/features/location/hooks/use-location';
import { LocationError } from '@/features/location/service/location-service';
import { useTheme } from '@/features/theme/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function CurrentLocationCard() {
  const { colors } = useTheme();

  const styles = useMemo(() => createStyles(colors), [colors]);

  const {
    coords,
    address,
    loading: locationLoading,
    errorCode,
    requestLocation,
  } = useLocation();

  const isPermissionDenied =
    errorCode === LocationError.PERMISSION_DENIED ||
    errorCode === LocationError.PERMISSION_PERMANENTLY_DENIED;

  const handleLocationRetry = () => {
    if (errorCode === LocationError.PERMISSION_PERMANENTLY_DENIED) {
      Linking.openSettings();
    } else {
      requestLocation();
    }
  };

  return (
    <View style={styles.content}>
      <View style={styles.statsCard}>
        <View style={styles.cardHeader}>
          <Ionicons
            name={isPermissionDenied ? 'warning' : 'location'}
            size={20}
            color={isPermissionDenied ? colors.warning : colors.accent}
          />
          <Text style={styles.cardTitle}>
            {isPermissionDenied ? 'Action Required' : 'Current Location'}
          </Text>
        </View>

        <View style={styles.locationBody}>
          {locationLoading ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : isPermissionDenied || errorCode ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {isPermissionDenied
                  ? 'Location access is required to proceed using this app.'
                  : 'An error occurred while fetching your location.'}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityHint={
                  errorCode === LocationError.PERMISSION_PERMANENTLY_DENIED
                    ? 'Opens settings to enable location access'
                    : 'Retries requesting location access'
                }
                onPress={handleLocationRetry}
                style={styles.retryButton}
              >
                <Text style={styles.retryText}>
                  {errorCode === LocationError.PERMISSION_PERMANENTLY_DENIED
                    ? 'Open Settings'
                    : 'Enable Location'}
                </Text>
              </Pressable>
            </View>
          ) : !coords ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <>
              <Text style={styles.cityText}>
                {address?.city ?? 'Detecting Location...'}
              </Text>
              <Text style={styles.regionText}>
                {address?.region ? `${address.region}, ` : ''}
                {address?.country ?? 'Global'}
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    content: {
      flex: 1,
    },
    statsCard: {
      padding: 24,
      borderRadius: 24,
      borderWidth: 1,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 15,
      elevation: 4,
      marginBottom: 20,
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.borderSubtle,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    locationBody: {
      marginTop: 12,
      minHeight: 40,
      justifyContent: 'center',
    },
    errorContainer: {
      gap: 12,
      alignItems: 'flex-start',
    },
    errorText: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.textSecondary,
    },
    retryButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: colors.accent,
    },
    retryText: {
      color: colors.textOnAccent || '#fff',
      fontWeight: '600',
      fontSize: 14,
    },
    cityText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    regionText: {
      fontSize: 14,
      marginTop: 2,
      color: colors.textSecondary,
    },
  });
