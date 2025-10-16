import { NextRequest, NextResponse } from 'next/server';
import { CalendarService } from '@/services/calendar.service';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { z } from 'zod';

const updateScheduleSchema = z.object({
  doctorId: z.string().min(1, 'El ID del médico es requerido'),
  schedule: z.record(z.array(z.object({
    start: z.string(),
    end: z.string(),
  }))),
});

// PUT /api/calendar/schedule - Update doctor's base schedule
async function handlePut(req: AuthenticatedRequest) {
  try {
    const body = await req.json();
    const validatedData = updateScheduleSchema.parse(body);

    // Check permissions
    if (req.user?.role !== 'ADMIN' && req.user?.userId !== validatedData.doctorId) {
      return NextResponse.json(
        { success: false, error: 'No tienes permisos para actualizar este horario' },
        { status: 403 }
      );
    }

    const updatedSchedule = await CalendarService.updateDoctorSchedule(
      validatedData.doctorId,
      validatedData.schedule
    );

    return NextResponse.json({
      success: true,
      message: 'Horario actualizado exitosamente',
      data: updatedSchedule,
    });

  } catch (error: any) {
    console.error('Update schedule error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos inválidos',
          details: error.errors.map(err => err.message),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al actualizar horario',
      },
      { status: 500 }
    );
  }
}

// Export handler with authentication
export const PUT = withAuth(handlePut);