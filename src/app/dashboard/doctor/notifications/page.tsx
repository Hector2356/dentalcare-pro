'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Check, X, Clock, Calendar, Users, Plus } from 'lucide-react';
import Link from 'next/link';
import { AppointmentModal } from '@/components/appointment-modal';

export default function DoctorNotifications() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      type: "appointment",
      title: "Nueva cita confirmada",
      message: "María García ha confirmado su cita para mañana a las 9:00 AM",
      time: "Hace 10 minutos",
      read: false,
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      id: 2,
      type: "reminder",
      title: "Recordatorio de cita",
      message: "Tienes una cita con Juan Pérez hoy a las 10:30 AM",
      time: "Hace 1 hora",
      read: false,
      icon: Clock,
      color: "text-orange-600"
    },
    {
      id: 3,
      type: "patient",
      title: "Nuevo paciente registrado",
      message: "Carlos López se ha registrado en el sistema",
      time: "Hace 2 horas",
      read: true,
      icon: Users,
      color: "text-green-600"
    },
    {
      id: 4,
      type: "system",
      title: "Actualización del sistema",
      message: "El sistema ha sido actualizado con nuevas funcionalidades",
      time: "Ayer",
      read: true,
      icon: Bell,
      color: "text-gray-600"
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Notificaciones
            </h1>
            <p className="text-gray-600">
              Mantente informado con las últimas actualizaciones
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setIsAppointmentModalOpen(true)}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Cita
            </Button>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                {unreadCount} no leídas
              </span>
            )}
            <Button variant="outline">
              Marcar todas como leídas
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Centro de Notificaciones
          </CardTitle>
          <CardDescription>
            Todas tus notificaciones en un solo lugar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 ${
                  !notification.read ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    !notification.read ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <notification.icon className={`h-5 w-5 ${notification.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{notification.title}</p>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <Button variant="outline" size="sm">
                      <Check className="h-4 w-4 mr-1" />
                      Marcar leída
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Notificaciones</CardTitle>
          <CardDescription>
            Administra tus preferencias de notificación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificaciones de citas</p>
                <p className="text-sm text-gray-600">Recibir alertas sobre nuevas citas y cambios</p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificaciones de pacientes</p>
                <p className="text-sm text-gray-600">Alertas sobre nuevos pacientes y actualizaciones</p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificaciones del sistema</p>
                <p className="text-sm text-gray-600">Actualizaciones y mantenimiento del sistema</p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Link href="/dashboard/doctor">
          <Button variant="outline">
            Volver al Dashboard
          </Button>
        </Link>
        <Link href="/dashboard/doctor/appointments">
          <Button variant="outline">
            Ver Citas
          </Button>
        </Link>
      </div>
      </div>
      
      <AppointmentModal 
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
    </>
  );
}