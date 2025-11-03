import { create } from 'zustand';
import { authApi, User } from '../api/auth';
import { getToken, setToken, removeToken } from '../utils/storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPremium: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string, locale?: string) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
  updateUser: (user: User) => void;
}

/**
 * Global authentication store using Zustand.
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isPremium: false,

  /**
   * Login with email and password.
   */
  login: async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });

      if (response.success && response.data) {
        const { user, token, is_premium } = response.data;

        await setToken(token);

        set({
          user,
          token,
          isAuthenticated: true,
          isPremium: is_premium,
          isLoading: false,
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.error?.message || 'Login failed');
    }
  },

  /**
   * Register a new user.
   */
  register: async (email: string, password: string, name?: string, locale?: string) => {
    try {
      const response = await authApi.register({ email, password, name, locale });

      if (response.success && response.data) {
        const { user, token } = response.data;

        await setToken(token);

        set({
          user,
          token,
          isAuthenticated: true,
          isPremium: false,
          isLoading: false,
        });
      }
    } catch (error: any) {
      console.error('Register error:', error);
      throw new Error(error.response?.data?.error?.message || 'Registration failed');
    }
  },

  /**
   * Logout current user.
   */
  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await removeToken();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isPremium: false,
        isLoading: false,
      });
    }
  },

  /**
   * Initialize auth state from stored token.
   */
  initAuth: async () => {
    try {
      const token = await getToken();

      if (token) {
        // Verify token is still valid by fetching user
        const response = await authApi.me();

        if (response.success && response.data) {
          const { user, is_premium } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isPremium: is_premium,
            isLoading: false,
          });
          return;
        }
      }
    } catch (error) {
      console.error('Init auth error:', error);
      await removeToken();
    }

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isPremium: false,
      isLoading: false,
    });
  },

  /**
   * Update user data.
   */
  updateUser: (user: User) => {
    set({ user });
  },
}));
