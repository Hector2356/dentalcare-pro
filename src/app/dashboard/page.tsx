'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, FileText, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getRoleBasedActions = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          {
            title: 'Gestión de Usuarios',
            description: 'Administra usuarios, médicos y pacientes',
            icon: Users,
            action: () => router.push('/admin/users'),
            color: 'bg-blue-500',
          },
          {
            title: 'Configuración',
            description: 'Configura el sistema',
            icon: Settings,
            action: () => router.push('/admin/settings'),
            color: 'bg-gray-500',
          },
        ];
      case 'DOCTOR':
        return [
          {
            title: 'Mi Calendario',
            description: 'Gestiona tu agenda y disponibilidad',
            icon: Calendar,
            action: () => router.push('/doctor/calendar'),
            color: 'bg-green-500',
          },
          {
            title: 'Mis Pacientes',
            description: 'Ver lista de pacientes',
            icon: Users,
            action: () => router.push('/doctor/patients'),
            color: 'bg-purple-500',
          },
        ];
      case 'PATIENT':
        return [
          {
            title: 'Agendar Cita',
            description: 'Reserva una nueva cita',
            icon: Calendar,
            action: () => router.push('/patient/appointments/new'),
            color: 'bg-blue-500',
          },
          {
            title: 'Mis Citas',
            description: 'Ver tus citas agendadas',
            icon: FileText,
            action: () => router.push('/patient/appointments'),
            color: 'bg-green-500',
          },
          {
            title: 'Membresías',
            description: 'Gestiona tus membresías',
            icon: Users,
            action: () => router.push('/patient/memberships'),
            color: 'bg-purple-500',
          },
        ];
      default:
        return [];
    }
  };

  const actions = getRoleBasedActions();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bienvenido, {user?.name}!
        </h1>
        <p className="text-gray-600">
          {user?.role === 'ADMIN' && 'Panel de Administración'}
          {user?.role === 'DOCTOR' && 'Panel de Médico'}
          {user?.role === 'PATIENT' && 'Panel de Paciente'}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {action.description}
              </CardDescription>
              <Button 
                onClick={action.action}
                className="w-full"
              >
                Ir a {action.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nombre</p>
              <p className="text-lg">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Correo</p>
              <p className="text-lg">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Identificación</p>
              <p className="text-lg">{user?.identification}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Rol</p>
              <p className="text-lg capitalize">{user?.role}</p>
            </div>
            {user?.phone && (
              <div>
                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                <p className="text-lg">{user.phone}</p>
              </div>
            )}
            {user?.address && (
              <div>
                <p className="text-sm font-medium text-gray-500">Dirección</p>
                <p className="text-lg">{user.address}</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full md:w-auto"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}