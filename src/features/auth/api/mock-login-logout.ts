import { LoginFormData } from '@/features/auth/schemas/login-schema';

export const mockLoginApi = async (data: LoginFormData) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (data.email === 'py@test.com' && data.password === 'password123') {
    return {
      user: { email: data.email, name: 'Phey Ying' },
      token: 'mock_jwt_token_2026', // Mock - Sensitive data is suppose to store in 'expo-secure-store'.
    };
  }

  throw new Error('Invalid credentials');
};

export const mockLogoutApi = async (isSuccess: boolean) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return isSuccess;
};
