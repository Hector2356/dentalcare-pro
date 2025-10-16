import { apiClient, ApiResponse, ApiError, handleApiError } from '@/lib/api-client';
import { UserRole } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  identification: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  doctorProfile?: {
    id: string;
    specialties: string;
    description?: string;
    baseSchedule?: string;
    consultationDuration: number;
    isActive: boolean;
  };
  patientProfile?: {
    id: string;
    medicalHistory?: string;
    preferences?: string;
    emergencyContact?: string;
  };
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersByRole: Record<UserRole, number>;
}

export interface UpdateUserData {
  name?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  isActive?: boolean;
}

export class UserApiService {
  static async getAllUsers(
    page: number = 1,
    limit: number = 10,
    role?: UserRole
  ): Promise<UsersResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (role) {
        params.append('role', role);
      }

      const response: ApiResponse<UsersResponse> = await apiClient.get(
        `/users?${params.toString()}`
      );

      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al obtener usuarios');
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async getUserById(id: string): Promise<User> {
    try {
      const response: ApiResponse<User> = await apiClient.get(`/users/${id}`);

      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al obtener usuario');
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async updateUser(id: string, data: UpdateUserData): Promise<User> {
    try {
      const response: ApiResponse<User> = await apiClient.put(`/users/${id}`, data);

      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al actualizar usuario');
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async deleteUser(id: string): Promise<{ message: string }> {
    try {
      const response: ApiResponse<{ message: string }> = await apiClient.delete(
        `/users/${id}`
      );

      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al eliminar usuario');
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async searchUsers(query: string, role?: UserRole): Promise<User[]> {
    try {
      const params = new URLSearchParams({ q: query });
      if (role) {
        params.append('role', role);
      }

      const response: ApiResponse<User[]> = await apiClient.get(
        `/users?${params.toString()}`
      );

      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al buscar usuarios');
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async getUserStats(): Promise<UserStats> {
    try {
      const response: ApiResponse<UserStats> = await apiClient.get('/users/stats');

      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al obtener estadísticas');
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}