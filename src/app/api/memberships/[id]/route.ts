import { NextRequest, NextResponse } from 'next/server';
import { MembershipService } from '@/services/membership.service';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { z } from 'zod';

const updateMembershipSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').optional(),
  description: z.string().min(1, 'La descripción es requerida').optional(),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0').optional(),
  maxPeople: z.number().min(1, 'Debe incluir al menos 1 persona').optional(),
  benefits: z.any().optional(),
  consultationsPerYear: z.number().min(0).optional(),
  prophylaxisPerYear: z.number().min(0).optional(),
  urgentConsultations: z.number().min(0).optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
});

// GET /api/memberships/[id] - Get membership by ID
async function handleGet(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const membership = await MembershipService.getMembershipById(params.id);

    return NextResponse.json({
      success: true,
      data: membership,
    });

  } catch (error: any) {
    console.error('Get membership error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al obtener membresía',
      },
      { status: 404 }
    );
  }
}

// PUT /api/memberships/[id] - Update membership (admin only)
async function handlePut(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    if (req.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'No tienes permisos para actualizar membresías' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = updateMembershipSchema.parse(body);

    const membership = await MembershipService.updateMembership(params.id, validatedData);

    return NextResponse.json({
      success: true,
      message: 'Membresía actualizada exitosamente',
      data: membership,
    });

  } catch (error: any) {
    console.error('Update membership error:', error);
    
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
        error: error.message || 'Error al actualizar membresía',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/memberships/[id] - Delete membership (admin only)
async function handleDelete(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    if (req.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'No tienes permisos para eliminar membresías' },
        { status: 403 }
      );
    }

    const result = await MembershipService.deleteMembership(params.id);

    return NextResponse.json({
      success: true,
      message: result.message,
    });

  } catch (error: any) {
    console.error('Delete membership error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al eliminar membresía',
      },
      { status: 500 }
    );
  }
}

// Export handlers
export const GET = withAuth(handleGet);
export const PUT = withAuth(handlePut);
export const DELETE = withAuth(handleDelete);