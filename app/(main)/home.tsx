import { ScreenWrapper } from '@/core/components/screen-wrapper';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { useTheme } from '@/features/theme/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const { colors, isDark, toggleMode } = useTheme();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (_) {
      alert('Logout failed');
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
                backgroundColor: colors.surface,
                borderColor: colors.borderSubtle,
                shadowColor: colors.glow,
              },
            ]}
          >
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              System Status
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: colors.accentSoft },
              ]}
            >
              <View style={[styles.dot, { backgroundColor: colors.accent }]} />
              <Text style={[styles.statusText, { color: colors.accent }]}>
                Secure & Connected
              </Text>
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
              pressed && { backgroundColor: colors.warning + '15' },
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
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
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
