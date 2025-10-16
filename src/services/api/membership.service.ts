import { apiClient, ApiResponse, ApiError, handleApiError } from '@/lib/api-client';
import { MembershipType } from '@prisma/client';

export { MembershipType };

export interface Membership {
  id: string;
  name: string;
  description: string;
  type: MembershipType;
  price: number;
  maxPeople: number;
  benefits: any;
  consultationsPerYear: number;
  prophylaxisPerYear: number;
  urgentConsultations: number;
  discountPercentage: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MembershipSubscription {
  id: string;
  membershipId: string;
  userId: string;
  startDate: string;
  endDate: string;
  peopleIncluded: any[];
  servicesConsumed: {
    consultations: number;
    prophylaxis: number;
    urgentConsultations: number;
  };
  status: string;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
  membership: Membership;
}

export interface CreateMembershipData {
  name: string;
  description: string;
  type: MembershipType;
  price: number;
  maxPeople: number;
  benefits: any;
  consultationsPerYear: number;
  prophylaxisPerYear: number;
  urgentConsultations: number;
  discountPercentage: number;
}

export interface UpdateMembershipData {
  name?: string;
  description?: string;
  price?: number;
  maxPeople?: number;
  benefits?: any;
  consultationsPerYear?: number;
  prophylaxisPerYear?: number;
  urgentConsultations?: number;
  discountPercentage?: number;
  isActive?: boolean;
}

export interface SubscribeData {
  membershipId: string;
  peopleIncluded?: any[];
}

export class MembershipApiService {
  static async getAllMemberships(): Promise<Membership[]> {
    try {
      const response: ApiResponse<Membership[]> = await apiClient.get('/memberships');

      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al obtener membresías');
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async getMembershipById(id: string): Promise<Membership> {
    try {
      const response: ApiResponse<Membership> = await apiClient.get(`/memberships/${id}`);

      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al obtener membresía');
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async createMembership(data: CreateMembershipData): Promise<Membership> {
    try {
      const response: ApiResponse<Membership> = await apiClient.post('/memberships', data);

      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al crear membresía');
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async updateMembership(id: string, data: UpdateMembershipData): Promise<Membership> {
    try {
      const response: ApiResponse<Membership> = await apiClient.put(`/memberships/${id}`, data);

      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al actualizar membresía');
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async deleteMembership(id: string): Promise<{ message: string }> {
    try {
      const response: ApiResponse<{ message: string }> = await apiClient.delete(
        `/memberships/${id}`
      );

      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al eliminar membresía');
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async subscribeToMembership(data: SubscribeData): Promise<MembershipSubscription> {
    try {
      const response: ApiResponse<MembershipSubscription> = await apiClient.post(
        '/memberships/subscribe',
        data
      );

      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al suscribirse a la membresía');
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async getMySubscriptions(): Promise<MembershipSubscription[]> {
    try {
      const response: ApiResponse<MembershipSubscription[]> = await apiClient.get(
        '/memberships/my-subscriptions'
      );

      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al obtener suscripciones');
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}