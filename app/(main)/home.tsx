import { ScreenWrapper } from '@/core/components/screen-wrapper';
import { useAuthStore } from '@/features/auth/store/use-auth-store';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

export default function HomeScreen() {
  const { user, logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    <ScreenWrapper backgroundColor="#000" withKeyboard={false}>
      {isLoggingOut ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          <Text style={styles.welcomeText}>
            Hello, <Text style={styles.nameText}>{user?.name ?? 'User'}</Text>
          </Text>

          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  welcomeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
  },
  nameText: {
    fontWeight: '700',
  },
  logoutButton: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  logoutText: {
    color: '#ff4b4b',
    fontWeight: '600',
    fontSize: 16,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: '#111',
  },
});
