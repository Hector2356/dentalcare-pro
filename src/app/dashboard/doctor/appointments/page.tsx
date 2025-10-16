'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, Users, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function DoctorAppointments() {
  const appointments = [
    {
      id: 1,
      patient: "María García",
      date: "2024-01-16",
      time: "9:00 AM",
      type: "Limpieza dental",
      status: "Confirmada",
      notes: "Paciente regular, requiere seguimiento"
    },
    {
      id: 2,
      patient: "Juan Pérez",
      date: "2024-01-16",
      time: "10:30 AM",
      type: "Revisión general",
      status: "Pendiente",
      notes: "Primera visita, necesita evaluación completa"
    },
    {
      id: 3,
      patient: "Carlos López",
      date: "2024-01-16",
      time: "2:00 PM",
      type: "Ortodoncia",
      status: "Por confirmar",
      notes: "Ajuste de aparato dental"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmada':
        return 'bg-green-100 text-green-800';
      case 'Pendiente':
        return 'bg-orange-100 text-orange-800';
      case 'Por confirmar':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Citas Programadas
            </h1>
            <p className="text-gray-600">
              Gestiona todas tus citas médicas
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas de Hoy</CardTitle>
            <CalendarDays className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">1 confirmada, 1 pendiente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">8 confirmadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Por confirmar</p>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Lista de Citas
          </CardTitle>
          <CardDescription>
            Todas las citas programadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{appointment.patient}</p>
                      <p className="text-sm text-gray-600">{appointment.type}</p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-medium">{appointment.date}</p>
                  <p className="text-sm text-gray-600">{appointment.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
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
        <Link href="/dashboard/doctor/calendar">
          <Button variant="outline">
            Ver Calendario
          </Button>
        </Link>
      </div>
    </div>
  );
}