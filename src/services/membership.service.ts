import { db } from '@/lib/db';
import { MembershipType } from '@prisma/client';

export class MembershipService {
  static async getAllMemberships() {
    const memberships = await db.membership.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    });

    return memberships.map(membership => ({
      ...membership,
      benefits: JSON.parse(membership.benefits),
    }));
  }

  static async getMembershipById(id: string) {
    const membership = await db.membership.findUnique({
      where: { id, isActive: true }
    });

    if (!membership) {
      throw new Error('Membresía no encontrada');
    }

    return {
      ...membership,
      benefits: JSON.parse(membership.benefits),
    };
  }

  static async createMembership(data: {
    name: string;
    description: string;
    type: MembershipType;
    price: number;
    maxPeople: number;
    benefits: any;
    consultationsPerYear: number;
    prophylaxisPerYear: number;
    urgentConsultations: number;
    discountPercentage: number;
  }) {
    const membership = await db.membership.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        price: data.price,
        maxPeople: data.maxPeople,
        benefits: JSON.stringify(data.benefits),
        consultationsPerYear: data.consultationsPerYear,
        prophylaxisPerYear: data.prophylaxisPerYear,
        urgentConsultations: data.urgentConsultations,
        discountPercentage: data.discountPercentage,
      }
    });

    return {
      ...membership,
      benefits: JSON.parse(membership.benefits),
    };
  }

  static async updateMembership(id: string, data: Partial<{
    name: string;
    description: string;
    price: number;
    maxPeople: number;
    benefits: any;
    consultationsPerYear: number;
    prophylaxisPerYear: number;
    urgentConsultations: number;
    discountPercentage: number;
    isActive: boolean;
  }>) {
    const membership = await db.membership.update({
      where: { id },
      data: {
        ...data,
        benefits: data.benefits ? JSON.stringify(data.benefits) : undefined,
      }
    });

    return {
      ...membership,
      benefits: JSON.parse(membership.benefits),
    };
  }

  static async deleteMembership(id: string) {
    // Soft delete
    await db.membership.update({
      where: { id },
      data: { isActive: false }
    });

    return { message: 'Membresía eliminada exitosamente' };
  }

  static async getUserMemberships(userId: string) {
    const subscriptions = await db.membershipSubscription.findMany({
      where: { 
        userId,
        status: 'ACTIVE',
        endDate: { gte: new Date() }
      },
      include: {
        membership: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return subscriptions.map(subscription => ({
      ...subscription,
      membership: {
        ...subscription.membership,
        benefits: JSON.parse(subscription.membership.benefits),
      },
      peopleIncluded: JSON.parse(subscription.peopleIncluded),
      servicesConsumed: JSON.parse(subscription.servicesConsumed),
    }));
  }

  static async subscribeToMembership(userId: string, membershipId: string, peopleIncluded: any[] = []) {
    const membership = await this.getMembershipById(membershipId);
    
    // Calculate end date (1 year from now)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    const subscription = await db.membershipSubscription.create({
      data: {
        membershipId,
        userId,
        startDate,
        endDate,
        peopleIncluded: JSON.stringify(peopleIncluded),
        servicesConsumed: JSON.stringify({
          consultations: 0,
          prophylaxis: 0,
          urgentConsultations: 0,
        }),
        status: 'PENDING', // Will be updated after payment
      },
      include: {
        membership: true,
      }
    });

    return {
      ...subscription,
      membership: {
        ...subscription.membership,
        benefits: JSON.parse(subscription.membership.benefits),
      },
      peopleIncluded: JSON.parse(subscription.peopleIncluded),
      servicesConsumed: JSON.parse(subscription.servicesConsumed),
    };
  }

  static async updateSubscriptionServices(subscriptionId: string, servicesConsumed: any) {
    const subscription = await db.membershipSubscription.update({
      where: { id: subscriptionId },
      data: {
        servicesConsumed: JSON.stringify(servicesConsumed),
      },
      include: {
        membership: true,
      }
    });

    return {
      ...subscription,
      membership: {
        ...subscription.membership,
        benefits: JSON.parse(subscription.membership.benefits),
      },
      peopleIncluded: JSON.parse(subscription.peopleIncluded),
      servicesConsumed: JSON.parse(subscription.servicesConsumed),
    };
  }

  static async getMembershipStats() {
    const [totalMemberships, activeSubscriptions, subscriptionsByType] = await Promise.all([
      db.membership.count({ where: { isActive: true } }),
      db.membershipSubscription.count({ 
        where: { 
          status: 'ACTIVE',
          endDate: { gte: new Date() }
        } 
      }),
      db.membershipSubscription.groupBy({
        by: ['membershipId'],
        _count: {
          id: true
        },
        where: {
          status: 'ACTIVE',
          endDate: { gte: new Date() }
        }
      })
    ]);

    return {
      totalMemberships,
      activeSubscriptions,
      subscriptionsByType: subscriptionsByType.reduce((acc, item) => {
        acc[item.membershipId] = item._count.id;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  static async initializeDefaultMemberships() {
    const defaultMemberships = [
      {
        name: 'Básica Individual',
        description: 'Plan básico para cuidado dental individual',
        type: MembershipType.BASIC,
        price: 120000, // $120.000 COP
        maxPeople: 1,
        benefits: {
          'Consultas generales': 2,
          'Limpieza dental': 1,
          'Rayos X': 1,
          'Descuento en tratamientos': 10
        },
        consultationsPerYear: 2,
        prophylaxisPerYear: 1,
        urgentConsultations: 0,
        discountPercentage: 10,
      },
      {
        name: 'Oro Familiar',
        description: 'Plan completo para hasta 5 personas',
        type: MembershipType.GOLD,
        price: 480000, // $480.000 COP
        maxPeople: 5,
        benefits: {
          'Consultas generales': 10,
          'Limpieza dental': 5,
          'Rayos X': 3,
          'Blanqueamiento dental': 1,
          'Descuento en tratamientos': 20,
          'Consultas de urgencia': 2
        },
        consultationsPerYear: 10,
        prophylaxisPerYear: 5,
        urgentConsultations: 2,
        discountPercentage: 20,
      },
      {
        name: 'VIP',
        description: 'Plan premium con beneficios ilimitados',
        type: MembershipType.VIP,
        price: 960000, // $960.000 COP
        maxPeople: 7,
        benefits: {
          'Consultas generales': 'Ilimitadas',
          'Limpieza dental': 'Ilimitadas',
          'Rayos X': 'Ilimitados',
          'Blanqueamiento dental': 2,
          'Ortodoncia': 'Descuento especial',
          'Implantes': 'Descuento especial',
          'Descuento en tratamientos': 30,
          'Consultas de urgencia': 'Ilimitadas',
          'Servicio prioritario': true,
          'Atención domiciliaria': 2
        },
        consultationsPerYear: 999, // Practically unlimited
        prophylaxisPerYear: 999,
        urgentConsultations: 999,
        discountPercentage: 30,
      }
    ];

    const createdMemberships = [];
    
    for (const membershipData of defaultMemberships) {
      const existing = await db.membership.findFirst({
        where: { name: membershipData.name }
      });

      if (!existing) {
        const membership = await this.createMembership(membershipData);
        createdMemberships.push(membership);
      }
    }

    return createdMemberships;
  }
}