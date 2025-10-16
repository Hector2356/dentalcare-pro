import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { LoginRequest } from '@/types/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = loginSchema.parse(body);
    
    // Convert to LoginRequest format
    const loginData: LoginRequest = {
      email: validatedData.email,
      password: validatedData.password,
    };

    const result = await AuthService.login(loginData);

    return NextResponse.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: result,
    });

  } catch (error: any) {
    console.error('Login error:', error);
    
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
        error: error.message || 'Error al iniciar sesión',
      },
      { status: 401 }
    );
  }
}