import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  permissions: string[];
  setAuth: (data: { user: User; accessToken: string; refreshToken: string; permissions: string[] }) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      permissions: [],
      setAuth: (data) => set({ ...data }),
      setAccessToken: (token: string) => set({ accessToken: token }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null, permissions: [] }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

