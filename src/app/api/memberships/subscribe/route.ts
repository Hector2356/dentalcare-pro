import { NextRequest, NextResponse } from 'next/server';
import { MembershipService } from '@/services/membership.service';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { z } from 'zod';

const subscribeSchema = z.object({
  membershipId: z.string().min(1, 'El ID de membresía es requerido'),
  peopleIncluded: z.array(z.any()).optional().default([]),
});

// POST /api/memberships/subscribe - Subscribe to membership
async function handlePost(req: AuthenticatedRequest) {
  try {
    if (!req.user?.userId) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = subscribeSchema.parse(body);

    const subscription = await MembershipService.subscribeToMembership(
      req.user.userId,
      validatedData.membershipId,
      validatedData.peopleIncluded
    );

    return NextResponse.json({
      success: true,
      message: 'Suscripción creada exitosamente',
      data: subscription,
    });

  } catch (error: any) {
    console.error('Subscribe membership error:', error);
    
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
        error: error.message || 'Error al crear suscripción',
      },
      { status: 500 }
    );
  }
}

// Export handler
export const POST = withAuth(handlePost);