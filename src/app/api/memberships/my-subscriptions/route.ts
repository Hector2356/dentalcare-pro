import { NextRequest, NextResponse } from 'next/server';
import { MembershipService } from '@/services/membership.service';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';

// GET /api/memberships/my-subscriptions - Get user's active subscriptions
async function handleGet(req: AuthenticatedRequest) {
  try {
    if (!req.user?.userId) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    const subscriptions = await MembershipService.getUserMemberships(req.user.userId);

    return NextResponse.json({
      success: true,
      data: subscriptions,
    });

  } catch (error: any) {
    console.error('Get user subscriptions error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al obtener suscripciones',
      },
      { status: 500 }
    );
  }
}

// Export handler
export const GET = withAuth(handleGet);