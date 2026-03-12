import { ScreenWrapper } from '@/core/components/screen-wrapper';
import { LoginForm } from '@/features/auth/ui/login-form';
import { useTheme } from '@/features/theme/hooks/use-theme';
import { StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
  const { colors } = useTheme();

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            WELCOME.
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Please log in to your account.
          </Text>
        </View>

        <LoginForm />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
});
