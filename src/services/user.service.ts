import { db } from '@/lib/db';
import { UserRole } from '@prisma/client';

export class UserService {
  static async getAllUsers(page: number = 1, limit: number = 10, role?: UserRole) {
    const skip = (page - 1) * limit;
    
    const where = role ? { role } : {};
    
    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        skip,
        take: limit,
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
          updatedAt: true,
          doctorProfile: {
            select: {
              id: true,
              specialties: true,
              description: true,
              isActive: true,
            }
          },
          patientProfile: {
            select: {
              id: true,
              medicalHistory: true,
              preferences: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      db.user.count({ where })
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  static async getUserById(id: string) {
    const user = await db.user.findUnique({
      where: { id },
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
        updatedAt: true,
        doctorProfile: {
          select: {
            id: true,
            specialties: true,
            description: true,
            baseSchedule: true,
            consultationDuration: true,
            isActive: true,
          }
        },
        patientProfile: {
          select: {
            id: true,
            medicalHistory: true,
            preferences: true,
            emergencyContact: true,
          }
        }
      }
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }

  static async updateUser(id: string, data: Partial<{
    name: string;
    phone: string;
    address: string;
    birthDate: Date;
    isActive: boolean;
  }>) {
    const user = await db.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
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
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return updatedUser;
  }

  static async deleteUser(id: string) {
    const user = await db.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Soft delete - deactivate user
    await db.user.update({
      where: { id },
      data: { isActive: false }
    });

    return { message: 'Usuario desactivado exitosamente' };
  }

  static async activateUser(id: string) {
    const user = await db.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    await db.user.update({
      where: { id },
      data: { isActive: true }
    });

    return { message: 'Usuario activado exitosamente' };
  }

  static async searchUsers(query: string, role?: UserRole) {
    const users = await db.user.findMany({
      where: {
        AND: [
          role ? { role } : {},
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
              { identification: { contains: query, mode: 'insensitive' } },
              { phone: { contains: query, mode: 'insensitive' } },
            ]
          }
        ]
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        identification: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
      take: 20,
      orderBy: {
        name: 'asc'
      }
    });

    return users;
  }

  static async getUserStats() {
    const [totalUsers, activeUsers, usersByRole] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { isActive: true } }),
      db.user.groupBy({
        by: ['role'],
        _count: {
          role: true
        }
      })
    ]);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item.role] = item._count.role;
        return acc;
      }, {} as Record<UserRole, number>)
    };
  }
}