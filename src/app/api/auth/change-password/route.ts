import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { z } from 'zod';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
});

async function handleChangePassword(req: AuthenticatedRequest) {
  try {
    if (!req.user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Validate request body
    const validatedData = changePasswordSchema.parse(body);
    
    await AuthService.changePassword(
      req.user.userId,
      validatedData.currentPassword,
      validatedData.newPassword
    );

    return NextResponse.json({
      success: true,
      message: 'Contraseña cambiada exitosamente',
    });

  } catch (error: any) {
    console.error('Change password error:', error);
    
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
        error: error.message || 'Error al cambiar contraseña',
      },
      { status: 400 }
    );
  }
}

export const POST = withAuth(handleChangePassword);