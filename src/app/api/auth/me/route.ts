import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';

async function handleGet(req: AuthenticatedRequest) {
  try {
    if (!req.user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    const user = await AuthService.getUserById(req.user.userId);

    return NextResponse.json({
      success: true,
      data: user,
    });

  } catch (error: any) {
    console.error('Get user error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al obtener información del usuario',
      },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handleGet);