'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown, Gem } from 'lucide-react';
import { Membership, MembershipType } from '@/services/api/membership.service';
import { cn } from '@/lib/utils';

interface MembershipCardProps {
  membership: Membership;
  onSubscribe?: (membershipId: string) => void;
  isSubscribed?: boolean;
  loading?: boolean;
}

const getMembershipIcon = (type: MembershipType) => {
  switch (type) {
    case MembershipType.BASIC:
      return <Star className="h-6 w-6" />;
    case MembershipType.GOLD:
      return <Crown className="h-6 w-6" />;
    case MembershipType.VIP:
      return <Gem className="h-6 w-6" />;
    default:
      return <Star className="h-6 w-6" />;
  }
};

const getMembershipColor = (type: MembershipType) => {
  switch (type) {
    case MembershipType.BASIC:
      return 'from-gray-500 to-gray-600';
    case MembershipType.GOLD:
      return 'from-yellow-500 to-amber-600';
    case MembershipType.VIP:
      return 'from-purple-500 to-pink-600';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

const getMembershipBadgeColor = (type: MembershipType) => {
  switch (type) {
    case MembershipType.BASIC:
      return 'bg-gray-100 text-gray-800';
    case MembershipType.GOLD:
      return 'bg-yellow-100 text-yellow-800';
    case MembershipType.VIP:
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function MembershipCard({ 
  membership, 
  onSubscribe, 
  isSubscribed = false, 
  loading = false 
}: MembershipCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatBenefitValue = (value: any) => {
    if (typeof value === 'number') {
      return value.toString();
    }
    if (typeof value === 'boolean' && value) {
      return 'Sí';
    }
    return value;
  };

  return (
    <Card className={cn(
      'relative overflow-hidden transition-all duration-300 hover:shadow-xl',
      membership.type === MembershipType.VIP && 'ring-2 ring-purple-500 ring-offset-2'
    )}>
      {/* Header */}
      <div className={cn(
        'bg-gradient-to-r p-6 text-white',
        getMembershipColor(membership.type)
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getMembershipIcon(membership.type)}
            <div>
              <CardTitle className="text-xl">{membership.name}</CardTitle>
              <Badge 
                className={cn('mt-1', getMembershipBadgeColor(membership.type))}
                variant="secondary"
              >
                {membership.type}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{formatPrice(membership.price)}</div>
            <div className="text-sm opacity-90">/ año</div>
          </div>
        </div>
      </div>

      <CardHeader>
        <CardDescription className="text-sm">
          {membership.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Benefits */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Beneficios incluidos:</h4>
          <div className="space-y-2">
            {Object.entries(membership.benefits).map(([benefit, value]) => (
              <div key={benefit} className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">
                  <span className="font-medium">{benefit}:</span>{' '}
                  <span className="text-muted-foreground">
                    {formatBenefitValue(value)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {membership.consultationsPerYear === 999 ? 'Ilimitadas' : membership.consultationsPerYear}
            </div>
            <div className="text-xs text-muted-foreground">Consultas/año</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {membership.prophylaxisPerYear === 999 ? 'Ilimitadas' : membership.prophylaxisPerYear}
            </div>
            <div className="text-xs text-muted-foreground">Limpiezas/año</div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg font-semibold text-purple-600">
            {membership.discountPercentage}% descuento
          </div>
          <div className="text-xs text-muted-foreground">En tratamientos</div>
        </div>

        {/* Action Button */}
        <Button
          className="w-full"
          onClick={() => onSubscribe?.(membership.id)}
          disabled={isSubscribed || loading}
          variant={membership.type === MembershipType.VIP ? 'default' : 'outline'}
        >
          {loading ? (
            'Procesando...'
          ) : isSubscribed ? (
            'Ya suscrito'
          ) : (
            `Suscribirse - ${formatPrice(membership.price)}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
}