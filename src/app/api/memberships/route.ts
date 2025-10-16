import { NextRequest, NextResponse } from 'next/server';
import { MembershipService } from '@/services/membership.service';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { z } from 'zod';

const createMembershipSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  type: z.enum(['BASIC', 'GOLD', 'VIP']),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  maxPeople: z.number().min(1, 'Debe incluir al menos 1 persona'),
  benefits: z.any(),
  consultationsPerYear: z.number().min(0),
  prophylaxisPerYear: z.number().min(0),
  urgentConsultations: z.number().min(0),
  discountPercentage: z.number().min(0).max(100),
});

// GET /api/memberships - Get all memberships
async function handleGet(req: AuthenticatedRequest) {
  try {
    const memberships = await MembershipService.getAllMemberships();

    return NextResponse.json({
      success: true,
      data: memberships,
    });

  } catch (error: any) {
    console.error('Get memberships error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al obtener membresías',
      },
      { status: 500 }
    );
  }
}

// POST /api/memberships - Create new membership (admin only)
async function handlePost(req: AuthenticatedRequest) {
  try {
    if (req.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'No tienes permisos para crear membresías' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = createMembershipSchema.parse(body);

    const membership = await MembershipService.createMembership(validatedData);

    return NextResponse.json({
      success: true,
      message: 'Membresía creada exitosamente',
      data: membership,
    });

  } catch (error: any) {
    console.error('Create membership error:', error);
    
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
        error: error.message || 'Error al crear membresía',
      },
      { status: 500 }
    );
  }
}

// Export handlers
export const GET = withAuth(handleGet);
export const POST = withAuth(handlePost);