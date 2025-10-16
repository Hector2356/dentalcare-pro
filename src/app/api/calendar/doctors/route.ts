import { NextRequest, NextResponse } from 'next/server';
import { CalendarService } from '@/services/calendar.service';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';

// GET /api/calendar/doctors - Get available doctors for a specific date
async function handleGet(req: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const specialty = searchParams.get('specialty');

    if (!date) {
      return NextResponse.json(
        { success: false, error: 'La fecha es requerida' },
        { status: 400 }
      );
    }

    const doctors = await CalendarService.getAvailableDoctors(date, specialty || undefined);

    return NextResponse.json({
      success: true,
      data: doctors,
    });

  } catch (error: any) {
    console.error('Get available doctors error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al obtener médicos disponibles',
      },
      { status: 500 }
    );
  }
}

// Export handler with authentication
export const GET = withAuth(handleGet);