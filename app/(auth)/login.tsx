import { ScreenWrapper } from '@/core/components/screen-wrapper';
import { LoginForm } from '@/features/auth/ui/login-form';
import { Text, View } from 'react-native';

export default function LoginScreen() {
  return (
    <ScreenWrapper>
      <View
        style={{
          flex: 1,
          backgroundColor: '#000',
          padding: 24,
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 48,
            fontWeight: '900',
            letterSpacing: -2,
            marginBottom: 8,
          }}
        >
          WELCOME.
        </Text>
        <Text style={{ color: '#666', fontSize: 16, marginBottom: 40 }}>
          Please log in to your account.
        </Text>

        <LoginForm />
      </View>
    </ScreenWrapper>
  );
}
