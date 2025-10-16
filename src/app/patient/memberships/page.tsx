'use client';

import { useState, useEffect } from 'react';
import { MembershipList } from '@/components/memberships/membership-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { MembershipApiService, MembershipSubscription } from '@/services/api/membership.service';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function MembershipsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<MembershipSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscriptions();
    }
  }, [user]);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await MembershipApiService.getMySubscriptions();
      setSubscriptions(data);
    } catch (error: any) {
      toast.error(error.message || 'Error al cargar tus suscripciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (membershipId: string) => {
    try {
      await MembershipApiService.subscribeToMembership({ membershipId });
      toast.success('¡Te has suscrito exitosamente a la membresía!');
      
      // Redirect to payment page (for now, just reload subscriptions)
      router.push('/patient/payments');
    } catch (error: any) {
      toast.error(error.message || 'Error al suscribirse a la membresía');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4" />;
      case 'PENDING':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const userSubscriptionIds = subscriptions
    .filter(sub => sub.status === 'ACTIVE')
    .map(sub => sub.membershipId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Membresías</h1>
        <p className="text-gray-600 mt-2">
          Gestiona tus membresías y accede a beneficios exclusivos
        </p>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">Explorar Membresías</TabsTrigger>
          <TabsTrigger value="my-subscriptions">Mis Suscripciones</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <Crown className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  Encuentra el plan perfecto para ti
                </h3>
                <p className="text-blue-700">
                  Elige entre nuestros planes de membresía y accede a beneficios exclusivos para tu salud dental
                </p>
              </div>
            </div>
          </div>

          <MembershipList
            onSubscribe={handleSubscribe}
            userSubscriptionIds={userSubscriptionIds}
          />
        </TabsContent>

        <TabsContent value="my-subscriptions" className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-muted-foreground mt-4">Cargando tus suscripciones...</p>
            </div>
          ) : subscriptions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No tienes suscripciones activas
                </h3>
                <p className="text-gray-600 mb-6">
                  Explora nuestros planes de membresía y elige el que mejor se adapte a tus necesidades
                </p>
                <Button onClick={() => router.push('/patient/memberships?tab=browse')}>
                  Explorar Membresías
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {subscriptions.map((subscription) => (
                <Card key={subscription.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{subscription.membership.name}</span>
                          <Badge className={getStatusColor(subscription.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(subscription.status)}
                              <span>{subscription.status}</span>
                            </div>
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {subscription.membership.description}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          ${new Intl.NumberFormat('es-CO').format(subscription.membership.price)}
                        </div>
                        <div className="text-sm text-gray-500">/ año</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Subscription Details */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Detalles de la suscripción</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Inicio:</span>
                            <span>{formatDate(subscription.startDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vencimiento:</span>
                            <span>{formatDate(subscription.endDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Personas incluidas:</span>
                            <span>{subscription.peopleIncluded.length + 1}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Servicios consumidos</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Consultas:</span>
                            <span>
                              {subscription.servicesConsumed.consultations} / {subscription.membership.consultationsPerYear === 999 ? '∞' : subscription.membership.consultationsPerYear}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Limpiezas:</span>
                            <span>
                              {subscription.servicesConsumed.prophylaxis} / {subscription.membership.prophylaxisPerYear === 999 ? '∞' : subscription.membership.prophylaxisPerYear}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Urgencias:</span>
                            <span>
                              {subscription.servicesConsumed.urgentConsultations} / {subscription.membership.urgentConsultations === 999 ? '∞' : subscription.membership.urgentConsultations}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4 border-t">
                      {subscription.status === 'PENDING' && (
                        <Button onClick={() => router.push('/patient/payments')}>
                          Completar Pago
                        </Button>
                      )}
                      <Button variant="outline" onClick={() => router.push('/patient/appointments/new')}>
                        Agendar Cita
                      </Button>
                      <Button variant="outline" onClick={() => router.push('/patient/invoices')}>
                        Ver Facturas
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}