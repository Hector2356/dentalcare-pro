import { apiClient, ApiResponse, ApiError, handleApiError } from '@/lib/api-client';
import { LoginRequest, RegisterRequest, AuthResponse, RefreshTokenRequest } from '@/types/auth';

export class AuthApiService {
  static async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response: ApiResponse<AuthResponse> = await apiClient.post('/auth/login', data);
      
      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al iniciar sesión');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response: ApiResponse<AuthResponse> = await apiClient.post('/auth/register', data);
      
      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al registrar usuario');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const response: ApiResponse<{ accessToken: string }> = await apiClient.post('/auth/refresh', {
        refreshToken,
      });
      
      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al refrescar token');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async getCurrentUser() {
    try {
      const response: ApiResponse = await apiClient.get('/auth/me');
      
      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al obtener usuario');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response: ApiResponse = await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      
      if (!response.success) {
        throw new ApiError(response.error || 'Error al cambiar contraseña');
      }
    } catch (error) {
      throw handleApiError(error);
    }
  }
}