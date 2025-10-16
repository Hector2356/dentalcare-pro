import { NextRequest, NextResponse } from 'next/server';
import { CalendarService } from '@/services/calendar.service';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { z } from 'zod';

const updateBlockSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  reason: z.string().optional(),
});

// PUT /api/calendar/blocks/[id] - Update calendar block
async function handlePut(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const validatedData = updateBlockSchema.parse(body);

    // Get the block to check permissions
    const blocks = await CalendarService.getDoctorCalendarBlocks('');
    const block = blocks.find(b => b.id === params.id);
    
    if (!block) {
      return NextResponse.json(
        { success: false, error: 'Bloque no encontrado' },
        { status: 404 }
      );
    }

    // Check permissions
    if (req.user?.role !== 'ADMIN' && req.user?.userId !== block.doctorId) {
      return NextResponse.json(
        { success: false, error: 'No tienes permisos para actualizar este bloque' },
        { status: 403 }
      );
    }

    const updatedBlock = await CalendarService.updateCalendarBlock(params.id, {
      ...(validatedData.startDate && { startDate: new Date(validatedData.startDate) }),
      ...(validatedData.endDate && { endDate: new Date(validatedData.endDate) }),
      ...(validatedData.reason !== undefined && { reason: validatedData.reason }),
    });

    return NextResponse.json({
      success: true,
      message: 'Bloque de calendario actualizado exitosamente',
      data: updatedBlock,
    });

  } catch (error: any) {
    console.error('Update calendar block error:', error);
    
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
        error: error.message || 'Error al actualizar bloque de calendario',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/calendar/blocks/[id] - Delete calendar block
async function handleDelete(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    // Get the block to check permissions
    const blocks = await CalendarService.getDoctorCalendarBlocks('');
    const block = blocks.find(b => b.id === params.id);
    
    if (!block) {
      return NextResponse.json(
        { success: false, error: 'Bloque no encontrado' },
        { status: 404 }
      );
    }

    // Check permissions
    if (req.user?.role !== 'ADMIN' && req.user?.userId !== block.doctorId) {
      return NextResponse.json(
        { success: false, error: 'No tienes permisos para eliminar este bloque' },
        { status: 403 }
      );
    }

    const result = await CalendarService.deleteCalendarBlock(params.id);

    return NextResponse.json({
      success: true,
      message: result.message,
    });

  } catch (error: any) {
    console.error('Delete calendar block error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al eliminar bloque de calendario',
      },
      { status: 500 }
    );
  }
}

// Export handlers
export const PUT = withAuth(handlePut);
export const DELETE = withAuth(handleDelete);