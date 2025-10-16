import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { RegisterRequest } from '@/types/auth';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  identification: z.string().min(5, 'La identificación debe tener al menos 5 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().optional(),
  address: z.string().optional(),
  birthDate: z.string().optional(),
  role: z.enum(['ADMIN', 'DOCTOR', 'PATIENT']).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = registerSchema.parse(body);
    
    // Convert to RegisterRequest format
    const registerData: RegisterRequest = {
      email: validatedData.email,
      password: validatedData.password,
      identification: validatedData.identification,
      name: validatedData.name,
      phone: validatedData.phone,
      address: validatedData.address,
      birthDate: validatedData.birthDate,
      role: validatedData.role as any,
    };

    const result = await AuthService.register(registerData);

    return NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: result,
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    
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
        error: error.message || 'Error al registrar usuario',
      },
      { status: 400 }
    );
  }
}