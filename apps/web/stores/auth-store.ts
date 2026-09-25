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
      setAuth: (data) => {
        if (typeof document !== 'undefined') {
          document.cookie = `auth-storage=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
        }
        set({ ...data });
      },
      setAccessToken: (token: string) => {
        if (typeof document !== 'undefined') {
          document.cookie = `auth-storage=${token}; path=/; max-age=86400; SameSite=Lax`;
        }
        set({ accessToken: token });
      },
      logout: () => {
        if (typeof document !== 'undefined') {
          document.cookie = 'auth-storage=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        set({ user: null, accessToken: null, refreshToken: null, permissions: [] });
      },

    }),
    {
      name: 'auth-storage',
    }
  )
);

