'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Users, FileText, Bell, Settings, Clock, Activity, Plus } from 'lucide-react';
import Link from 'next/link';
import AppointmentModal from '@/components/appointment-modal';

export default function DoctorDashboard() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const stats = [
    {
      title: "Citas de Hoy",
      value: "8",
      description: "4 confirmadas, 2 pendientes",
      icon: CalendarDays,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Pacientes Activos",
      value: "127",
      description: "+12 este mes",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Próxima Cita",
      value: "10:30 AM",
      description: "María García - Limpieza",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Notificaciones",
      value: "3",
      description: "2 nuevas, 1 recordatorio",
      icon: Bell,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const quickActions = [
    {
      title: "Mi Calendario",
      description: "Gestionar agenda y disponibilidad",
      icon: CalendarDays,
      href: "/dashboard/doctor/calendar",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Citas Programadas",
      description: "Ver y gestionar citas",
      icon: Clock,
      href: "/dashboard/doctor/appointments",
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Pacientes",
      description: "Directorio de pacientes",
      icon: Users,
      href: "/dashboard/doctor/patients",
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Historial Médico",
      description: "Expedientes clínicos",
      icon: FileText,
      href: "/dashboard/doctor/history",
      color: "bg-orange-600 hover:bg-orange-700"
    },
    {
      title: "Notificaciones",
      description: "Alertas y recordatorios",
      icon: Bell,
      href: "/dashboard/doctor/notifications",
      color: "bg-red-600 hover:bg-red-700"
    },
    {
      title: "Configuración",
      description: "Ajustes de perfil",
      icon: Settings,
      href: "/dashboard/doctor/settings",
      color: "bg-gray-600 hover:bg-gray-700"
    }
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Panel del Doctor
              </h1>
              <p className="text-gray-600">
                Bienvenido al sistema de gestión dental
              </p>
            </div>
            <Button 
              onClick={() => setIsAppointmentModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Cita
            </Button>
          </div>
        </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nueva cita confirmada</p>
                <p className="text-xs text-gray-500">Juan Pérez - Mañana 2:00 PM</p>
              </div>
              <span className="text-xs text-gray-400">Hace 10 min</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Historial actualizado</p>
                <p className="text-xs text-gray-500">María García - Tratamiento completado</p>
              </div>
              <span className="text-xs text-gray-400">Hace 1 hora</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Recordatorio de cita</p>
                <p className="text-xs text-gray-500">Carlos López - Hoy 4:30 PM</p>
              </div>
              <span className="text-xs text-gray-400">Hace 2 horas</span>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
      
      <AppointmentModal 
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
    </>
  );
}