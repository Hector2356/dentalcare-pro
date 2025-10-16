'use client';

import { useAuth } from '@/hooks/use-auth';
import { useNavigation } from '@/hooks/use-navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CreditCard, FileText, User, Clock, Heart, ChevronRight, Bell, History } from 'lucide-react';
import Link from 'next/link';

export default function PatientPage() {
  const { isAuthenticated, user } = useAuth();
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (user && user.role !== 'PATIENT') {
      navigate('/dashboard');
      return;
    }

    setLoading(false);
  }, [isAuthenticated, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      title: 'Agendar Cita',
      description: 'Reserva una nueva cita con tu dentista',
      icon: Calendar,
      href: '/patient/appointments/new',
      color: 'bg-blue-500',
    },
    {
      title: 'Mis Citas',
      description: 'Revisa tus citas programadas',
      icon: Clock,
      href: '/patient/appointments',
      color: 'bg-green-500',
    },
    {
      title: 'Membresía',
      description: 'Gestiona tu plan de membresía',
      icon: CreditCard,
      href: '/patient/memberships',
      color: 'bg-purple-500',
    },
    {
      title: 'Historial Médico',
      description: 'Accede a tu historial dental',
      icon: FileText,
      href: '/patient/records',
      color: 'bg-orange-500',
    },
    {
      title: 'Mi Perfil',
      description: 'Actualiza tu información personal',
      icon: User,
      href: '/patient/profile',
      color: 'bg-gray-500',
    },
    {
      title: 'Notificaciones',
      description: 'Alertas y recordatorios',
      icon: Bell,
      href: '/patient/notifications',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Heart className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Panel Paciente</h1>
                <p className="text-sm text-gray-600">Bienvenido, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notificaciones
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bienvenido, {user?.name}
          </h2>
          <p className="text-gray-600">
            Gestiona tu salud dental y agenda tus citas fácilmente
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próxima Cita</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Mañana</div>
              <p className="text-xs text-muted-foreground">
                10:30 AM
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Membresía</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Premium</div>
              <p className="text-xs text-muted-foreground">
                Activa
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citas este Mes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                1 completada
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Salud Dental</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Excelente</div>
              <p className="text-xs text-muted-foreground">
                Última revisión: 15 días
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${item.color} group-hover:scale-110 transition-transform`}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {item.description}
                      </CardDescription>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Tus últimas acciones en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Cita completada</p>
                    <p className="text-xs text-gray-500">Limpieza dental - Dr. Rodríguez</p>
                  </div>
                  <span className="text-xs text-gray-500">Hace 2 días</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Membresía renovada</p>
                    <p className="text-xs text-gray-500">Plan Premium - Próximo mes</p>
                  </div>
                  <span className="text-xs text-gray-500">Hace 1 semana</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Cita agendada</p>
                    <p className="text-xs text-gray-500">Revisión general - Mañana 10:30</p>
                  </div>
                  <span className="text-xs text-gray-500">Hace 3 días</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>
                Acceso directo a las funciones más usadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Agendar Cita Rápida</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <History className="h-4 w-4" />
                  <span>Ver Historial</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Renovar Membresía</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Descargar Recetas</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}