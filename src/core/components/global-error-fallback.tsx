import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/features/theme/hooks/use-theme';
import { FallbackProps } from 'react-error-boundary';

export function GlobalErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const { colors } = useTheme();

  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: '#fef2f2' }]}>
          <Ionicons name="warning" size={48} color="#ef4444" />
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Oops! Something went wrong
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          An unexpected error occurred. Our team has been notified.
        </Text>

        {process.env.NODE_ENV === 'development' && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText} numberOfLines={4}>
              {errorMessage}
            </Text>
          </View>
        )}

        <Pressable
          style={[styles.button, { backgroundColor: colors.accent }]}
          onPress={resetErrorBoundary}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </Pressable>
      </View>
    </SafeAreaView>
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
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  errorBox: {
    backgroundColor: '#fff1f2',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#fecdd3',
  },
  errorText: {
    color: '#be123c',
    fontSize: 14,
    fontFamily: 'Courier',
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
