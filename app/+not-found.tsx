import { Ionicons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/features/theme/hooks/use-theme';

export default function NotFoundPage() {
  const { colors } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerShown: false }} />
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.content}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: colors.surfaceSecondary },
            ]}
          >
            <Ionicons
              name="search"
              size={48}
              color={colors.accent || '#8b5cf6'}
            />
          </View>

          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Page Not Found
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            The screen you are looking for doesn&apos;t exist or has been moved.
          </Text>

          <Link href="/" asChild>
            <View
              style={[
                styles.button,
                { backgroundColor: colors.accent || '#8b5cf6' },
              ]}
            >
              <Ionicons name="home" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Return Home</Text>
            </View>
          </Link>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
