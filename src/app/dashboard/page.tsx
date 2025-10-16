'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, FileText, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  const actions = [
    {
      title: 'Mi Calendario',
      description: 'Gestiona tu agenda y disponibilidad',
      icon: Calendar,
      href: '/dashboard/doctor/calendar',
      color: 'bg-green-500',
    },
    {
      title: 'Citas Programadas',
      description: 'Ver y gestionar citas',
      icon: Calendar,
      href: '/dashboard/doctor/appointments',
      color: 'bg-blue-500',
    },
    {
      title: 'Mis Pacientes',
      description: 'Ver lista de pacientes',
      icon: Users,
      href: '/dashboard/doctor/patients',
      color: 'bg-purple-500',
    },
    {
      title: 'Historial Médico',
      description: 'Expedientes clínicos',
      icon: FileText,
      href: '/dashboard/doctor/history',
      color: 'bg-orange-500',
    },
    {
      title: 'Notificaciones',
      description: 'Alertas y recordatorios',
      icon: Settings,
      href: '/dashboard/doctor/notifications',
      color: 'bg-red-500',
    },
    {
      title: 'Configuración',
      description: 'Ajustes de perfil',
      icon: Settings,
      href: '/dashboard/doctor/settings',
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bienvenido, Doctor Demo!
        </h1>
        <p className="text-gray-600">
          Panel de Médico - Modo de Prueba
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
              <Link href={action.href}>
                <Button className="w-full">
                  Ir a {action.title}
                </Button>
              </Link>
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
              <p className="text-lg">Doctor Demo</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Correo</p>
              <p className="text-lg">doctor@dentalcare.com</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Rol</p>
              <p className="text-lg">DOCTOR</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Modo</p>
              <p className="text-lg">Prueba</p>
            </div>
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