import { useAuthStore } from '../stores/auth-store';
import { api } from '../lib/api';

export function useAuth() {
  const authState = useAuthStore();

  const login = async (credentials: any) => {
    // In a real app, you would make an API call here.
    // For demo purposes, we'll simulate a successful login.
    try {
      const response = await api.post('/auth/login', credentials);
      authState.setAuth(response.data.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    ...authState,
    login,
    isAuthenticated: !!authState.accessToken,
  };
}
