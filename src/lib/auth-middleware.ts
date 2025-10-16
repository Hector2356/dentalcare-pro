import { NextRequest, NextResponse } from 'next/server';
import { JWTService } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
    identification: string;
  };
}

export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: AuthenticatedRequest) => {
    try {
      const authHeader = req.headers.get('authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Token de autenticación requerido' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);
      const decoded = JWTService.verifyAccessToken(token);
      
      req.user = decoded;
      
      return handler(req);
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }
  };
}

export function withRole(allowedRoles: string[]) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return withAuth(async (req: AuthenticatedRequest) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return NextResponse.json(
          { error: 'No tienes permisos para realizar esta acción' },
          { status: 403 }
        );
      }
      
      return handler(req);
    });
  };
}

export function withAdminAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withRole(['ADMIN'])(handler);
}

export function withDoctorAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withRole(['ADMIN', 'DOCTOR'])(handler);
}

export function withPatientAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withRole(['ADMIN', 'DOCTOR', 'PATIENT'])(handler);
}