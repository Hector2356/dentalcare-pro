'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, Plus } from 'lucide-react';
import Link from 'next/link';
import { AppointmentModal } from '@/components/appointment-modal';

export default function DoctorCalendar() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mi Calendario
            </h1>
            <p className="text-gray-600">
              Gestiona tu agenda y disponibilidad
            </p>
          </div>
          <Button onClick={() => setIsAppointmentModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Calendario de Citas
          </CardTitle>
          <CardDescription>
            Vista mensual de tus citas y disponibilidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              El calendario interactivo estará disponible próximamente
            </p>
            <p className="text-sm text-gray-500">
              Podrás ver y gestionar todas tus citas de forma visual
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horario de Hoy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium">María García</p>
                <p className="text-sm text-gray-600">Limpieza dental</p>
              </div>
              <div className="text-right">
                <p className="font-medium">9:00 AM</p>
                <p className="text-sm text-green-600">Confirmada</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div>
                <p className="font-medium">Juan Pérez</p>
                <p className="text-sm text-gray-600">Revisión general</p>
              </div>
              <div className="text-right">
                <p className="font-medium">10:30 AM</p>
                <p className="text-sm text-orange-600">Pendiente</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Carlos López</p>
                <p className="text-sm text-gray-600">Ortodoncia</p>
              </div>
              <div className="text-right">
                <p className="font-medium">2:00 PM</p>
                <p className="text-sm text-gray-600">Por confirmar</p>
              </div>
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
            Ver Todas las Citas
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