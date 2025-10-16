'use client';

import { useAuth } from '@/hooks/use-auth';
import { useNavigation } from '@/hooks/use-navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Plus, Filter, Search } from 'lucide-react';
import Link from 'next/link';

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  specialty: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export default function PatientAppointmentsPage() {
  const { isAuthenticated, user } = useAuth();
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (user && user.role !== 'PATIENT') {
      navigate('/dashboard');
      return;
    }

    // Mock data for appointments
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        date: '2024-01-15',
        time: '10:30',
        doctor: 'Dr. Ana Martínez',
        specialty: 'Odontología General',
        status: 'scheduled',
        notes: 'Limpieza dental'
      },
      {
        id: '2',
        date: '2024-01-08',
        time: '14:00',
        doctor: 'Dr. Carlos Rodríguez',
        specialty: 'Ortodoncia',
        status: 'completed',
        notes: 'Ajuste de brackets'
      },
      {
        id: '3',
        date: '2024-01-22',
        time: '09:00',
        doctor: 'Dra. Laura Sánchez',
        specialty: 'Endodoncia',
        status: 'scheduled',
        notes: 'Tratamiento de conducto'
      }
    ];

    setAppointments(mockAppointments);
    setLoading(false);
  }, [isAuthenticated, user, navigate]);

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'upcoming') return apt.status === 'scheduled';
    if (filter === 'past') return apt.status === 'completed' || apt.status === 'cancelled';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Programada';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconocido';
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mis Citas</h1>
                <p className="text-sm text-gray-600">Gestiona tus citas médicas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/patient">
                <Button variant="outline" size="sm">
                  Volver al Panel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex bg-white rounded-lg shadow-sm border">
              <Button
                variant={filter === 'upcoming' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('upcoming')}
                className="rounded-r-none"
              >
                Próximas
              </Button>
              <Button
                variant={filter === 'past' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('past')}
                className="rounded-none border-l"
              >
                Pasadas
              </Button>
              <Button
                variant={filter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
                className="rounded-l-none border-l"
              >
                Todas
              </Button>
            </div>
          </div>
          
          <Link href="/patient/appointments/new">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nueva Cita</span>
            </Button>
          </Link>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay citas {filter === 'upcoming' ? 'próximas' : filter === 'past' ? 'pasadas' : ''}
                </h3>
                <p className="text-gray-600 mb-4">
                  {filter === 'upcoming' ? 'Agenda una nueva cita para comenzar' : 'No tienes citas en esta categoría'}
                </p>
                {filter === 'upcoming' && (
                  <Link href="/patient/appointments/new">
                    <Button>Agendar Primera Cita</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {appointment.doctor}
                        </CardTitle>
                        <CardDescription>
                          {appointment.specialty}
                        </CardDescription>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {new Date(appointment.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{appointment.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{user?.name}</span>
                    </div>
                  </div>
                  
                  {appointment.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Notas:</span> {appointment.notes}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-4 flex items-center space-x-2">
                    {appointment.status === 'scheduled' && (
                      <>
                        <Button variant="outline" size="sm">
                          Reprogramar
                        </Button>
                        <Button variant="destructive" size="sm">
                          Cancelar
                        </Button>
                      </>
                    )}
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}