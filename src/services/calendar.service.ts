import { db } from '@/lib/db';

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

export class CalendarService {
  static async getDoctorAvailability(doctorId: string, startDate: string, endDate: string) {
    const doctor = await db.doctor.findUnique({
      where: { id: doctorId, isActive: true },
      include: {
        calendarBlocks: {
          where: {
            OR: [
              {
                startDate: { lte: new Date(endDate) },
                endDate: { gte: new Date(startDate) }
              }
            ]
          }
        },
        availabilityExceptions: {
          where: {
            date: { gte: new Date(startDate), lte: new Date(endDate) }
          }
        },
        appointments: {
          where: {
            startDate: { gte: new Date(startDate) },
            endDate: { lte: new Date(endDate) },
            status: { in: ['SCHEDULED', 'CONFIRMED'] }
          }
        }
      }
    });

    if (!doctor) {
      throw new Error('Médico no encontrado o inactivo');
    }

    const baseSchedule = JSON.parse(doctor.baseSchedule) as DaySchedule;
    const availability: DoctorAvailability[] = [];

    // Generate availability for each day in the range
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'lowercase' });
      
      const daySlots = baseSchedule[dayName] || [];
      const availableSlots: TimeSlot[] = [];
      
      // Check for exceptions
      const exception = doctor.availabilityExceptions.find(
        ex => ex.date.toISOString().split('T')[0] === dateStr
      );
      
      if (exception && !exception.isAvailable) {
        // Day is completely blocked
        continue;
      }
      
      if (exception && exception.isAvailable) {
        // Use exception schedule
        availableSlots.push({
          start: exception.startTime,
          end: exception.endTime
        });
      } else if (daySlots.length > 0) {
        // Use base schedule
        availableSlots.push(...daySlots);
      }
      
      if (availableSlots.length === 0) {
        continue;
      }
      
      // Check for calendar blocks (vacations, etc.)
      const blockedDates = doctor.calendarBlocks.filter(block => {
        const blockStart = block.startDate.toISOString().split('T')[0];
        const blockEnd = block.endDate.toISOString().split('T')[0];
        return dateStr >= blockStart && dateStr <= blockEnd;
      });
      
      if (blockedDates.length > 0) {
        continue; // Entire day is blocked
      }
      
      // Generate time slots based on consultation duration
      const slots = this.generateTimeSlots(availableSlots, doctor.consultationDuration);
      
      // Remove already booked slots
      const bookedSlots = doctor.appointments
        .filter(apt => apt.startDate.toISOString().split('T')[0] === dateStr)
        .map(apt => ({
          start: apt.startDate.toTimeString().slice(0, 5),
          end: apt.endDate.toTimeString().slice(0, 5)
        }));
      
      const finalSlots = slots.filter(slot => 
        !bookedSlots.some(booked => 
          (slot.start >= booked.start && slot.start < booked.end) ||
          (slot.end > booked.start && slot.end <= booked.end) ||
          (slot.start <= booked.start && slot.end >= booked.end)
        )
      );
      
      availability.push({
        doctorId,
        date: dateStr,
        availableSlots: finalSlots,
        blockedSlots: bookedSlots,
        consultationDuration: doctor.consultationDuration
      });
    }
    
    return availability;
  }

  static async createCalendarBlock(doctorId: string, data: {
    startDate: Date;
    endDate: Date;
    reason?: string;
    isRecurring?: boolean;
  }) {
    const block = await db.calendarBlock.create({
      data: {
        doctorId,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
        isRecurring: data.isRecurring || false,
      }
    });

    return block;
  }

  static async updateCalendarBlock(blockId: string, data: {
    startDate?: Date;
    endDate?: Date;
    reason?: string;
  }) {
    const block = await db.calendarBlock.update({
      where: { id: blockId },
      data: {
        ...(data.startDate && { startDate: data.startDate }),
        ...(data.endDate && { endDate: data.endDate }),
        ...(data.reason !== undefined && { reason: data.reason }),
      }
    });

    return block;
  }

  static async deleteCalendarBlock(blockId: string) {
    await db.calendarBlock.delete({
      where: { id: blockId }
    });

    return { message: 'Bloque de calendario eliminado exitosamente' };
  }

  static async getDoctorCalendarBlocks(doctorId: string, startDate?: string, endDate?: string) {
    const where: any = { doctorId };
    
    if (startDate && endDate) {
      where.OR = [
        {
          startDate: { lte: new Date(endDate) },
          endDate: { gte: new Date(startDate) }
        }
      ];
    }

    const blocks = await db.calendarBlock.findMany({
      where,
      orderBy: { startDate: 'asc' }
    });

    return blocks;
  }

  static async createAvailabilityException(doctorId: string, data: {
    date: Date;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    reason?: string;
  }) {
    const exception = await db.availabilityException.create({
      data: {
        doctorId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        isAvailable: data.isAvailable,
        reason: data.reason,
      }
    });

    return exception;
  }

  static async updateAvailabilityException(exceptionId: string, data: {
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
    reason?: string;
  }) {
    const exception = await db.availabilityException.update({
      where: { id: exceptionId },
      data: {
        ...(data.startTime !== undefined && { startTime: data.startTime }),
        ...(data.endTime !== undefined && { endTime: data.endTime }),
        ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
        ...(data.reason !== undefined && { reason: data.reason }),
      }
    });

    return exception;
  }

  static async deleteAvailabilityException(exceptionId: string) {
    await db.availabilityException.delete({
      where: { id: exceptionId }
    });

    return { message: 'Excepción de disponibilidad eliminada exitosamente' };
  }

  static async getDoctorAvailabilityExceptions(doctorId: string, startDate?: string, endDate?: string) {
    const where: any = { doctorId };
    
    if (startDate && endDate) {
      where.date = { gte: new Date(startDate), lte: new Date(endDate) };
    }

    const exceptions = await db.availabilityException.findMany({
      where,
      orderBy: { date: 'asc' }
    });

    return exceptions;
  }

  static async updateDoctorSchedule(doctorId: string, schedule: DaySchedule) {
    const doctor = await db.doctor.update({
      where: { id: doctorId },
      data: {
        baseSchedule: JSON.stringify(schedule),
      }
    });

    return {
      ...doctor,
      baseSchedule: JSON.parse(doctor.baseSchedule),
    };
  }

  private static generateTimeSlots(slots: TimeSlot[], duration: number): TimeSlot[] {
    const result: TimeSlot[] = [];
    
    for (const slot of slots) {
      const [startHour, startMin] = slot.start.split(':').map(Number);
      const [endHour, endMin] = slot.end.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      for (let time = startMinutes; time + duration <= endMinutes; time += duration) {
        const slotStart = `${Math.floor(time / 60).toString().padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`;
        const slotEnd = `${Math.floor((time + duration) / 60).toString().padStart(2, '0')}:${((time + duration) % 60).toString().padStart(2, '0')}`;
        
        result.push({ start: slotStart, end: slotEnd });
      }
    }
    
    return result;
  }

  static async getAvailableDoctors(date: string, specialty?: string) {
    const doctors = await db.doctor.findMany({
      where: {
        isActive: true,
        ...(specialty && {
          specialties: {
            contains: specialty
          }
        })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        calendarBlocks: {
          where: {
            startDate: { lte: new Date(date) },
            endDate: { gte: new Date(date) }
          }
        },
        availabilityExceptions: {
          where: { date: new Date(date) }
        },
        appointments: {
          where: {
            startDate: { gte: new Date(date) },
            endDate: { lte: new Date(date + 'T23:59:59') },
            status: { in: ['SCHEDULED', 'CONFIRMED'] }
          }
        }
      }
    });

    const availableDoctors = doctors.filter(doctor => {
      // Check if doctor is blocked on this date
      const isBlocked = doctor.calendarBlocks.some(block => {
        const blockDate = block.startDate.toISOString().split('T')[0];
        return blockDate === date;
      });

      if (isBlocked) return false;

      // Check if doctor has availability for this date
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
      const baseSchedule = JSON.parse(doctor.baseSchedule) as DaySchedule;
      const daySlots = baseSchedule[dayName] || [];

      if (daySlots.length === 0) return false;

      // Check for exceptions
      const exception = doctor.availabilityExceptions.find(ex => 
        ex.date.toISOString().split('T')[0] === date
      );

      if (exception && !exception.isAvailable) return false;

      return true;
    });

    return availableDoctors.map(doctor => ({
      id: doctor.id,
      name: doctor.user.name,
      email: doctor.user.email,
      specialties: JSON.parse(doctor.specialties),
      consultationDuration: doctor.consultationDuration,
      description: doctor.description,
    }));
  }
}