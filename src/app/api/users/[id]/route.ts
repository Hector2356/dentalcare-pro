import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/user.service';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  birthDate: z.string().optional(),
  isActive: z.boolean().optional(),
});

// GET /api/users/[id] - Get user by ID
async function handleGet(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const user = await UserService.getUserById(params.id);

    // Users can only view their own profile, admins can view any
    if (req.user?.role !== 'ADMIN' && req.user?.userId !== params.id) {
      return NextResponse.json(
        { success: false, error: 'No tienes permisos para ver este usuario' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });

  } catch (error: any) {
    console.error('Get user error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al obtener usuario',
      },
      { status: 404 }
    );
  }
}

// PUT /api/users/[id] - Update user
async function handlePut(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const validatedData = updateUserSchema.parse(body);

    // Users can only update their own profile, admins can update any
    if (req.user?.role !== 'ADMIN' && req.user?.userId !== params.id) {
      return NextResponse.json(
        { success: false, error: 'No tienes permisos para actualizar este usuario' },
        { status: 403 }
      );
    }

    // Only admins can change isActive status
    if (validatedData.isActive !== undefined && req.user?.role !== 'ADMIN') {
      delete validatedData.isActive;
    }

    const updatedUser = await UserService.updateUser(params.id, validatedData);

    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: updatedUser,
    });

  } catch (error: any) {
    console.error('Update user error:', error);
    
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
        error: error.message || 'Error al actualizar usuario',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user (soft delete)
async function handleDelete(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    // Only admins can delete users
    if (req.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'No tienes permisos para eliminar usuarios' },
        { status: 403 }
      );
    }

    const result = await UserService.deleteUser(params.id);

    return NextResponse.json({
      success: true,
      message: result.message,
    });

  } catch (error: any) {
    console.error('Delete user error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al eliminar usuario',
      },
      { status: 500 }
    );
  }
}

// Export handlers with authentication
export const GET = withAuth(handleGet);
export const PUT = withAuth(handlePut);
export const DELETE = withAuth(handleDelete);