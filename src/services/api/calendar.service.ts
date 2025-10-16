import { apiClient, ApiResponse, ApiError, handleApiError } from '@/lib/api-client';

export interface TimeSlot {
  start: string; // HH:MM format
  end: string;   // HH:MM format
}

export interface DaySchedule {
  [day: string]: TimeSlot[];
}

export interface DoctorAvailability {
  doctorId: string;
  date: string; // YYYY-MM-DD format
  availableSlots: TimeSlot[];
  blockedSlots: TimeSlot[];
  consultationDuration: number;
}

export interface CalendarBlock {
  id: string;
  doctorId: string;
  startDate: string;
  endDate: string;
  reason?: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityException {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvailableDoctor {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  consultationDuration: number;
  description?: string;
}

export interface CreateCalendarBlockData {
  doctorId: string;
  startDate: string;
  endDate: string;
  reason?: string;
  isRecurring?: boolean;
}

export interface UpdateCalendarBlockData {
  startDate?: string;
  endDate?: string;
  reason?: string;
}

export class CalendarApiService {
  static async getDoctorAvailability(
    doctorId: string,
    startDate: string,
    endDate: string
  ): Promise<DoctorAvailability[]> {
    try {
      const params = new URLSearchParams({
        doctorId,
        startDate,
        endDate,
      });

      const response: ApiResponse<DoctorAvailability[]> = await apiClient.get(
        `/calendar/availability?${params.toString()}`
      );

      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al obtener disponibilidad');
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async getAvailableDoctors(date: string, specialty?: string): Promise<AvailableDoctor[]> {
    try {
      const params = new URLSearchParams({ date });
      if (specialty) {
        params.append('specialty', specialty);
      }

      const response: ApiResponse<AvailableDoctor[]> = await apiClient.get(
        `/calendar/doctors?${params.toString()}`
      );

      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al obtener médicos disponibles');
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async getCalendarBlocks(
    doctorId: string,
    startDate?: string,
    endDate?: string
  ): Promise<CalendarBlock[]> {
    try {
      const params = new URLSearchParams({ doctorId });
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response: ApiResponse<CalendarBlock[]> = await apiClient.get(
        `/calendar/blocks?${params.toString()}`
      );

      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al obtener bloques de calendario');
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async createCalendarBlock(data: CreateCalendarBlockData): Promise<CalendarBlock> {
    try {
      const response: ApiResponse<CalendarBlock> = await apiClient.post('/calendar/blocks', data);

      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al crear bloque de calendario');
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async updateCalendarBlock(
    blockId: string,
    data: UpdateCalendarBlockData
  ): Promise<CalendarBlock> {
    try {
      const response: ApiResponse<CalendarBlock> = await apiClient.put(
        `/calendar/blocks/${blockId}`,
        data
      );

      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al actualizar bloque de calendario');
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async deleteCalendarBlock(blockId: string): Promise<{ message: string }> {
    try {
      const response: ApiResponse<{ message: string }> = await apiClient.delete(
        `/calendar/blocks/${blockId}`
      );

      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al eliminar bloque de calendario');
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async updateDoctorSchedule(doctorId: string, schedule: DaySchedule): Promise<any> {
    try {
      const response: ApiResponse = await apiClient.put('/calendar/schedule', {
        doctorId,
        schedule,
      });

      if (!response.success || !response.data) {
        throw new ApiError(response.error || 'Error al actualizar horario');
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}