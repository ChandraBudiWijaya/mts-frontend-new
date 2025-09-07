import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import type { User, LoginCredentials } from '../../../shared/types';
import { authAPI } from '../../../shared/api';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token');

      if (token) {
        try {
          // Verify token with backend and get latest user data
          const response = await authAPI.getUser();
          setUser(response.data as unknown as User);
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          console.error('Token verification failed:', error);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      
      // Call backend API
      const response = await authAPI.login(credentials);
      const { user, token } = response.data;
      
      // Store token and user data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      
      return { success: true };
    } catch (error: unknown) {
      console.error('Login error:', error);
      
      // Handle different error types
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        
        if (axiosError.response?.status === 401) {
          return { 
            success: false, 
            error: 'Email atau password yang anda masukkan salah.' 
          };
        } else if (axiosError.response?.status === 422) {
          return { 
            success: false, 
            error: 'Data yang diberikan tidak valid.' 
          };
        } else if (axiosError.response?.data?.message) {
          return { 
            success: false, 
            error: axiosError.response.data.message 
          };
        }
      }
      
      return { 
        success: false, 
        error: 'Terjadi kesalahan saat login. Silakan coba lagi.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call backend logout API
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage regardless of API success
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user?.roles) return false;
    return user.roles.some(role => 
      role.permissions?.some(p => p.slug === permission)
    );
  };

  const hasRole = (roleName: string): boolean => {
    if (!user?.roles) return false;
    return user.roles.some(role => role.slug === roleName);
  };

  const isAuthenticated = !!user && !!localStorage.getItem('auth_token');

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      hasPermission,
      hasRole,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};
