import { create } from 'zustand';
import { User } from '@/types';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  accessToken: null,
  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, accessToken });
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ user: null, accessToken: null });
  },
  isAuthenticated: () => {
    return !!get().accessToken;
  },
}));

// Initialize auth from localStorage
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('accessToken');
  const userStr = localStorage.getItem('user');
  if (token && userStr) {
    const user = JSON.parse(userStr);
    useAuthStore.setState({ user, accessToken: token });
  }
}
