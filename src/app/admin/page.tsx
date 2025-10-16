'use client';

import { useAuth } from '@/hooks/use-auth';
import { useNavigation } from '@/hooks/use-navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, CreditCard, Settings, BarChart3, Shield, ChevronRight, Bell, Building, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { isAuthenticated, user } = useAuth();
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (user && user.role !== 'ADMIN') {
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
      title: 'Gestión de Usuarios',
      description: 'Administra pacientes, doctores y personal',
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-500',
    },
    {
      title: 'Gestión de Citas',
      description: 'Supervisa todas las citas del sistema',
      icon: Calendar,
      href: '/admin/appointments',
      color: 'bg-green-500',
    },
    {
      title: 'Membresías y Pagos',
      description: 'Gestiona planes y transacciones',
      icon: CreditCard,
      href: '/admin/memberships',
      color: 'bg-purple-500',
    },
    {
      title: 'Reportes y Estadísticas',
      description: 'Análisis de datos y métricas',
      icon: BarChart3,
      href: '/admin/reports',
      color: 'bg-orange-500',
    },
    {
      title: 'Configuración del Sistema',
      description: 'Ajustes generales y parámetros',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500',
    },
    {
      title: 'Seguridad y Permisos',
      description: 'Gestiona roles y accesos',
      icon: Shield,
      href: '/admin/security',
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
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Panel Administrador</h1>
                <p className="text-sm text-gray-600">Administrador: {user?.name}</p>
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
            Administra y supervisa todas las operaciones del sistema
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +12% desde el mes pasado
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">
                +8% vs semana pasada
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <p className="text-xs text-muted-foreground">
                +23% desde el mes pasado
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Membresías Activas</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">892</div>
              <p className="text-xs text-muted-foreground">
                85% de retención
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

        {/* System Status */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Estado del Sistema</CardTitle>
              <CardDescription>
                Monitoreo de servicios y componentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Base de Datos</span>
                  </div>
                  <span className="text-sm text-green-600">Operativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">API Server</span>
                  </div>
                  <span className="text-sm text-green-600">Operativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Pasarela de Pago</span>
                  </div>
                  <span className="text-sm text-green-600">Operativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium">Email Service</span>
                  </div>
                  <span className="text-sm text-yellow-600">Lento</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente del Sistema</CardTitle>
              <CardDescription>
                Últimas acciones importantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nuevo doctor registrado</p>
                    <p className="text-xs text-gray-500">Dr. Ana Martínez - Odontología</p>
                  </div>
                  <span className="text-xs text-gray-500">Hace 1 hora</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Backup completado</p>
                    <p className="text-xs text-gray-500">Base de datos: 2.3GB</p>
                  </div>
                  <span className="text-xs text-gray-500">Hace 3 horas</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Reporte mensual generado</p>
                    <p className="text-xs text-gray-500">Ingresos y estadísticas</p>
                  </div>
                  <span className="text-xs text-gray-500">Ayer</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sistema actualizado</p>
                    <p className="text-xs text-gray-500">Versión 2.1.0</p>
                  </div>
                  <span className="text-xs text-gray-500">Hace 2 días</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas de Administración</CardTitle>
              <CardDescription>
                Tareas administrativas comunes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Agregar Usuario</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Generar Reporte</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Ver Calendario Global</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Configuración Rápida</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}