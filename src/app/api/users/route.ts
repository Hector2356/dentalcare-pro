import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/user.service';
import { withAuth, AuthenticatedRequest, withRole } from '@/lib/auth-middleware';
import { UserRole } from '@prisma/client';
import { z } from 'zod';

const getUsersSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  role: z.enum(['ADMIN', 'DOCTOR', 'PATIENT']).optional(),
});

const searchUsersSchema = z.object({
  q: z.string().min(1, 'Query is required'),
  role: z.enum(['ADMIN', 'DOCTOR', 'PATIENT']).optional(),
});

// GET /api/users - Get all users with pagination and filtering
async function handleGet(req: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());
    
    // Check if it's a search request
    if (query.q) {
      const validatedData = searchUsersSchema.parse(query);
      const users = await UserService.searchUsers(validatedData.q, validatedData.role);
      
      return NextResponse.json({
        success: true,
        data: users,
      });
    }
    
    // Regular paginated request
    const validatedData = getUsersSchema.parse(query);
    const result = await UserService.getAllUsers(
      validatedData.page,
      validatedData.limit,
      validatedData.role
    );

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error: any) {
    console.error('Get users error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parámetros inválidos',
          details: error.errors.map(err => err.message),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al obtener usuarios',
      },
      { status: 500 }
    );
  }
}

// Export the handler with admin authentication
export const GET = withRole(['ADMIN'])(handleGet);