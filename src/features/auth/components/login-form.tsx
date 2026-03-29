import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  LoginFormData,
  loginSchema,
} from '@/features/auth/schemas/login-schema';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { useTheme } from '@/features/theme/hooks/use-theme';

export const LoginForm = () => {
  const login = useAuthStore((s) => s.login);

  const { colors, isDark } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onLogin = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Something went wrong');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Email
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="py@test.com"
              placeholderTextColor={isDark ? '#666' : '#999'}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.textPrimary,
                  borderColor: colors.borderSubtle,
                },
                errors.email && { borderColor: colors.warning },
              ]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />
          )}
        />
        {errors.email && (
          <Text style={[styles.errorText, { color: colors.warning }]}>
            {errors.email.message}
          </Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Password
        </Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="••••••••"
              placeholderTextColor={isDark ? '#666' : '#999'}
              secureTextEntry
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.textPrimary,
                  borderColor: colors.borderSubtle,
                },
                errors.password && { borderColor: colors.warning },
              ]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        {errors.password && (
          <Text style={[styles.errorText, { color: colors.warning }]}>
            {errors.password.message}
          </Text>
        )}
      </View>

      <Pressable
        onPress={handleSubmit(onLogin)}
        disabled={isSubmitting}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.accent },
          (pressed || isSubmitting) && {
            opacity: 0.8,
            backgroundColor: colors.glow,
          },
        ]}
      >
        {isSubmitting ? (
          <ActivityIndicator color={isDark ? '#000' : '#fff'} />
        ) : (
          <Text
            style={[
              styles.buttonText,
              { color: isDark ? colors.background : '#fff' },
            ]}
          >
            Sign In
          </Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    gap: 20,
  },
  inputContainer: { gap: 8 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginLeft: 4,
  },
  button: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 16,
  },
});
