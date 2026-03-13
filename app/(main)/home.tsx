import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ScreenWrapper } from '@/core/components/screen-wrapper';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { useLocation } from '@/features/location/hooks/use-location';
import { useTheme } from '@/features/theme/hooks/use-theme';

export default function HomeScreen() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { coords, address, loading: locationLoading } = useLocation();
  const { colors, isDark, toggleMode } = useTheme();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (_) {
      Alert.alert('Logout Failed', 'Please try again later.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <ScreenWrapper backgroundColor={colors.background} withKeyboard={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
              Welcome back,
            </Text>
            <Text style={[styles.nameText, { color: colors.textPrimary }]}>
              {user?.name ?? 'Developer'}
            </Text>
          </View>

          <Pressable
            onPress={toggleMode}
            style={[
              styles.iconButton,
              {
                backgroundColor: colors.surfaceSecondary,
                borderColor: colors.borderSubtle,
              },
            ]}
          >
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={22}
              color={isDark ? colors.accent : '#f59e0b'}
            />
          </Pressable>
        </View>

        <View style={styles.content}>
          <View
            style={[
              styles.statsCard,
              {
                backgroundColor: colors.surfaceSecondary,
                borderColor: colors.borderSubtle,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <Ionicons name="location" size={20} color={colors.accent} />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Current Location
              </Text>
            </View>

            <View style={styles.locationBody}>
              {locationLoading ? (
                <ActivityIndicator size="small" color={colors.accent} />
              ) : !coords ? (
                <Text style={{ color: colors.warning, fontSize: 14 }}>
                  Unable to Detect Location
                </Text>
              ) : (
                <>
                  <Text
                    style={[styles.cityText, { color: colors.textPrimary }]}
                  >
                    {address?.city ?? 'Detecting Location...'}
                  </Text>
                  <Text
                    style={[styles.regionText, { color: colors.textSecondary }]}
                  >
                    {address?.region ? `${address.region}, ` : ''}
                    {address?.country ?? 'Global'}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            onPress={handleLogout}
            disabled={isLoggingOut}
            style={({ pressed }) => [
              styles.logoutButton,
              { borderColor: colors.warning },
              pressed && { backgroundColor: `${colors.warning}15` },
            ]}
          >
            {isLoggingOut ? (
              <ActivityIndicator color={colors.warning} />
            ) : (
              <>
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color={colors.warning}
                />
                <Text style={[styles.logoutText, { color: colors.warning }]}>
                  Sign Out
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '400',
  },
  nameText: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  locationBody: {
    marginTop: 12,
    minHeight: 40,
    justifyContent: 'center',
  },
  cityText: {
    fontSize: 16,
    fontWeight: '600',
  },
  regionText: {
    fontSize: 14,
    marginTop: 2,
  },
  footer: {
    paddingBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 10,
  },
  logoutText: {
    fontWeight: '700',
    fontSize: 16,
  },
});
