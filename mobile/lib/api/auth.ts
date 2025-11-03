import { apiClient } from './client';

export interface User {
  id: number;
  email: string;
  locale: string;
  plan: 'free' | 'premium';
  premium_until?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  locale?: string;
}

/**
 * Authentication API methods.
 */
export const authApi = {
  /**
   * Register a new user.
   */
  register: async (data: RegisterData) => {
    return apiClient.post<{ user: User; token: string }>('/auth/register', data);
  },

  /**
   * Login user.
   */
  login: async (credentials: LoginCredentials) => {
    return apiClient.post<{ user: User; token: string; is_premium: boolean }>('/auth/login', credentials);
  },

  /**
   * Logout user.
   */
  logout: async () => {
    return apiClient.post('/auth/logout');
  },

  /**
   * Get current user info.
   */
  me: async () => {
    return apiClient.get<{ user: User; is_premium: boolean; profiles: any[] }>('/auth/me');
  },

  /**
   * Update user profile.
   */
  updateProfile: async (data: Partial<User>) => {
    return apiClient.put<{ user: User }>('/auth/update-profile', data);
  },

  /**
   * Request password reset.
   */
  forgotPassword: async (email: string) => {
    return apiClient.post('/auth/forgot-password', { email });
  },
};
