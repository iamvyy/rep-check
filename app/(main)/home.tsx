import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ScreenWrapper } from '@/core/components/screen-wrapper';
import { useAuthStore } from '@/features/auth/store/auth-store';
import CurrentLocationCard from '@/features/location/component/current-location-card';
import { useTheme } from '@/features/theme/hooks/use-theme';
import WorkoutLog from '@/features/workout/components/workout-log';

export default function HomeScreen() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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

        <CurrentLocationCard />

        <WorkoutLog />

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
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
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
