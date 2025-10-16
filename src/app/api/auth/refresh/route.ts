import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { RefreshTokenRequest } from '@/types/auth';
import { z } from 'zod';

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'El token de refresco es requerido'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = refreshSchema.parse(body);
    
    // Convert to RefreshTokenRequest format
    const refreshData: RefreshTokenRequest = {
      refreshToken: validatedData.refreshToken,
    };

    const result = await AuthService.refreshToken(refreshData);

    return NextResponse.json({
      success: true,
      message: 'Token refrescado exitosamente',
      data: result,
    });

  } catch (error: any) {
    console.error('Refresh token error:', error);
    
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
        error: error.message || 'Error al refrescar token',
      },
      { status: 401 }
    );
  }
}