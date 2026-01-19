import { useState } from 'react';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const { setAuth, logout: storeLogout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: {
    email: string;
    password: string;
    name?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(data);
      const { user, accessToken, refreshToken } = response.data;
      setAuth(user, accessToken, refreshToken);
      router.push('/app');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(data);
      const { user, accessToken, refreshToken } = response.data;
      setAuth(user, accessToken, refreshToken);
      
      // Redirect based on role
      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/app');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    storeLogout();
    router.push('/login');
  };

  return {
    register,
    login,
    logout,
    loading,
    error,
  };
}
