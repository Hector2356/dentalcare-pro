import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { AuthApiService } from '@/services/api/auth.service';
import { LoginRequest, RegisterRequest } from '@/types/auth';
import { toast } from 'sonner';

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: storeLogin,
    logout: storeLogout,
    setLoading,
    setError,
    clearError,
  } = useAuthStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login function
  const login = useCallback(async (data: LoginRequest) => {
    setIsSubmitting(true);
    setLoading(true);
    clearError();

    try {
      const response = await AuthApiService.login(data);
      storeLogin(response);
      toast.success('¡Bienvenido! Has iniciado sesión correctamente');
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Error al iniciar sesión';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [storeLogin, setLoading, setError, clearError]);

  // Register function
  const register = useCallback(async (data: RegisterRequest) => {
    setIsSubmitting(true);
    setLoading(true);
    clearError();

    try {
      const response = await AuthApiService.register(data);
      storeLogin(response);
      toast.success('¡Cuenta creada exitosamente!');
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Error al registrar usuario';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [storeLogin, setLoading, setError, clearError]);

  // Logout function
  const logout = useCallback(() => {
    storeLogout();
    toast.success('Has cerrado sesión correctamente');
  }, [storeLogout]);

  // Refresh token function
  const refreshAuth = useCallback(async () => {
    try {
      const refreshToken = useAuthStore.getState().refreshToken;
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await AuthApiService.refreshToken(refreshToken);
      useAuthStore.getState().updateTokens(response.accessToken);
      return response;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout();
      throw error;
    }
  }, [logout]);

  // Change password function
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setIsSubmitting(true);
    clearError();

    try {
      await AuthApiService.changePassword(currentPassword, newPassword);
      toast.success('Contraseña cambiada exitosamente');
    } catch (error: any) {
      const errorMessage = error.message || 'Error al cambiar contraseña';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [setError, clearError]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated && user) {
        try {
          // Verify current user data
          await AuthApiService.getCurrentUser();
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, user, logout]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    isSubmitting,

    // Actions
    login,
    register,
    logout,
    refreshAuth,
    changePassword,
    clearError,
  };
}