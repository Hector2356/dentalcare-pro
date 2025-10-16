'use client';

import { useState, useEffect } from 'react';
import { MembershipCard } from './membership-card';
import { MembershipApiService, Membership } from '@/services/api/membership.service';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface MembershipListProps {
  onSubscribe?: (membershipId: string) => void;
  showSubscribeButton?: boolean;
  userSubscriptionIds?: string[];
}

export function MembershipList({ 
  onSubscribe, 
  showSubscribeButton = true,
  userSubscriptionIds = []
}: MembershipListProps) {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    loadMemberships();
  }, []);

  const loadMemberships = async () => {
    try {
      setLoading(true);
      const data = await MembershipApiService.getAllMemberships();
      setMemberships(data);
    } catch (error: any) {
      toast.error(error.message || 'Error al cargar membresías');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (membershipId: string) => {
    try {
      setSubscribing(membershipId);
      
      if (onSubscribe) {
        onSubscribe(membershipId);
      } else {
        // Default subscribe behavior
        await MembershipApiService.subscribeToMembership({ membershipId });
        toast.success('¡Te has suscrito exitosamente a la membresía!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al suscribirse a la membresía');
    } finally {
      setSubscribing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando membresías...</p>
        </div>
      </div>
    );
  }

  if (memberships.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay membresías disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {memberships.map((membership) => (
        <MembershipCard
          key={membership.id}
          membership={membership}
          onSubscribe={showSubscribeButton ? handleSubscribe : undefined}
          isSubscribed={userSubscriptionIds.includes(membership.id)}
          loading={subscribing === membership.id}
        />
      ))}
    </div>
  );
}