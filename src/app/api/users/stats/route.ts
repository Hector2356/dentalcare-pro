import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/user.service';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/auth-middleware';

// GET /api/users/stats - Get user statistics
async function handleGet(req: AuthenticatedRequest) {
  try {
    const stats = await UserService.getUserStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });

  } catch (error: any) {
    console.error('Get user stats error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al obtener estadísticas de usuarios',
      },
      { status: 500 }
    );
  }
}

// Export the handler with admin authentication
export const GET = withAdminAuth(handleGet);