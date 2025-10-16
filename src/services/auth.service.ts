import { db } from '@/lib/db';
import { PasswordService } from '@/lib/password';
import { JWTService, JWTPayload } from '@/lib/jwt';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  RefreshTokenRequest 
} from '@/types/auth';
import { UserRole } from '@prisma/client';

export class AuthService {
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    // Validate password
    const passwordValidation = PasswordService.validatePassword(data.password);
    if (!passwordValidation.isValid) {
      throw new Error(`Contraseña inválida: ${passwordValidation.errors.join(', ')}`);
    }

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { identification: data.identification }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === data.email) {
        throw new Error('El correo electrónico ya está registrado');
      }
      if (existingUser.identification === data.identification) {
        throw new Error('El número de identificación ya está registrado');
      }
    }

    // Hash password
    const passwordHash = await PasswordService.hash(data.password);

    // Create user
    const user = await db.user.create({
      data: {
        email: data.email,
        passwordHash,
        identification: data.identification,
        name: data.name,
        phone: data.phone,
        address: data.address,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        role: data.role || UserRole.PATIENT,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        identification: true,
        phone: true,
        address: true,
        birthDate: true,
        createdAt: true,
      }
    });

    // Create profile based on role
    if (user.role === UserRole.DOCTOR) {
      await db.doctor.create({
        data: {
          userId: user.id,
          specialties: JSON.stringify([]),
          baseSchedule: JSON.stringify({
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: []
          }),
        }
      });
    } else if (user.role === UserRole.PATIENT) {
      await db.patient.create({
        data: {
          userId: user.id,
          medicalHistory: '',
          preferences: JSON.stringify({}),
        }
      });
    }

    // Generate tokens
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      identification: user.identification,
    };

    const tokens = JWTService.generateTokens(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        identification: user.identification,
        phone: user.phone || undefined,
        address: user.address || undefined,
        birthDate: user.birthDate?.toISOString(),
      },
      tokens,
    };
  }

  static async login(data: LoginRequest): Promise<AuthResponse> {
    // Find user
    const user = await db.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        identification: true,
        phone: true,
        address: true,
        birthDate: true,
        passwordHash: true,
        isActive: true,
      }
    });

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw new Error('Tu cuenta ha sido desactivada');
    }

    // Verify password
    const isPasswordValid = await PasswordService.verify(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Generate tokens
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      identification: user.identification,
    };

    const tokens = JWTService.generateTokens(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        identification: user.identification,
        phone: user.phone || undefined,
        address: user.address || undefined,
        birthDate: user.birthDate?.toISOString(),
      },
      tokens,
    };
  }

  static async refreshToken(data: RefreshTokenRequest): Promise<{ accessToken: string }> {
    try {
      const decoded = JWTService.verifyRefreshToken(data.refreshToken);
      
      const user = await db.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          role: true,
          identification: true,
          isActive: true,
        }
      });

      if (!user || !user.isActive) {
        throw new Error('Usuario no encontrado o inactivo');
      }

      const payload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        identification: user.identification,
      };

      const accessToken = JWTService.generateAccessToken(payload);

      return { accessToken };
    } catch (error) {
      throw new Error('Token de refresco inválido');
    }
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true }
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const isCurrentPasswordValid = await PasswordService.verify(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new Error('Contraseña actual incorrecta');
    }

    const passwordValidation = PasswordService.validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(`Contraseña inválida: ${passwordValidation.errors.join(', ')}`);
    }

    const newPasswordHash = await PasswordService.hash(newPassword);

    await db.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash }
    });
  }

  static async getUserById(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        identification: true,
        phone: true,
        address: true,
        birthDate: true,
        isActive: true,
        createdAt: true,
      }
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      identification: user.identification,
      phone: user.phone || undefined,
      address: user.address || undefined,
      birthDate: user.birthDate?.toISOString(),
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
    };
  }
}