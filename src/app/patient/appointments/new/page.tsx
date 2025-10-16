'use client';

import { useAuth } from '@/hooks/use-auth';
import { useNavigation } from '@/hooks/use-navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function NewAppointmentPage() {
  const { isAuthenticated, user } = useAuth();
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [step, setStep] = useState(1);

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

  const doctors: Doctor[] = [
    { id: '1', name: 'Dr. Ana Martínez', specialty: 'Odontología General', available: true },
    { id: '2', name: 'Dr. Carlos Rodríguez', specialty: 'Ortodoncia', available: true },
    { id: '3', name: 'Dra. Laura Sánchez', specialty: 'Endodoncia', available: false },
    { id: '4', name: 'Dr. Miguel Ángel Torres', specialty: 'Periodoncia', available: true },
  ];

  const timeSlots: TimeSlot[] = [
    { time: '08:00', available: false },
    { time: '08:30', available: true },
    { time: '09:00', available: true },
    { time: '09:30', available: true },
    { time: '10:00', available: false },
    { time: '10:30', available: true },
    { time: '11:00', available: true },
    { time: '11:30', available: true },
    { time: '14:00', available: true },
    { time: '14:30', available: false },
    { time: '15:00', available: true },
    { time: '15:30', available: true },
  ];

  const handleDoctorSelect = (doctor: Doctor) => {
    if (doctor.available) {
      setSelectedDoctor(doctor);
      setStep(2);
    }
  };

  const handleDateTimeSelect = () => {
    if (selectedDate && selectedTime) {
      setStep(3);
    }
  };

  const handleConfirmAppointment = () => {
    // Here you would normally make an API call
    alert('Cita agendada exitosamente');
    navigate('/patient/appointments');
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
              <Link href="/patient/appointments">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Agendar Nueva Cita</h1>
                <p className="text-sm text-gray-600">Completa los pasos para agendar tu cita</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Seleccionar Doctor</span>
            </div>
            <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Fecha y Hora</span>
            </div>
            <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="ml-2 font-medium">Confirmar</span>
            </div>
          </div>
        </div>

        {/* Step 1: Select Doctor */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Selecciona un Doctor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doctor) => (
                <Card 
                  key={doctor.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    !doctor.available ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        doctor.available ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <User className={`h-6 w-6 ${doctor.available ? 'text-blue-600' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{doctor.name}</CardTitle>
                        <CardDescription>{doctor.specialty}</CardDescription>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        doctor.available ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      {doctor.available ? 'Disponible para citas' : 'No disponible actualmente'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Date and Time */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Selecciona Fecha y Hora</h2>
            
            {/* Selected Doctor Info */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedDoctor?.name}</p>
                    <p className="text-sm text-gray-600">{selectedDoctor?.specialty}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Date Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fecha</CardTitle>
                  <CardDescription>Selecciona la fecha de tu cita</CardDescription>
                </CardHeader>
                <CardContent>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </CardContent>
              </Card>

              {/* Time Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hora</CardTitle>
                  <CardDescription>Selecciona la hora de tu cita</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedTime === slot.time
                            ? 'bg-blue-600 text-white'
                            : slot.available
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Anterior
              </Button>
              <Button 
                onClick={handleDateTimeSelect}
                disabled={!selectedDate || !selectedTime}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirmar Cita</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen de la Cita</CardTitle>
                <CardDescription>Revisa los detalles antes de confirmar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Doctor</p>
                    <p className="text-lg font-medium">{selectedDoctor?.name}</p>
                    <p className="text-sm text-gray-600">{selectedDoctor?.specialty}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Paciente</p>
                    <p className="text-lg font-medium">{user?.name}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fecha</p>
                    <p className="text-lg font-medium">
                      {new Date(selectedDate).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Hora</p>
                    <p className="text-lg font-medium">{selectedTime}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Se enviará un recordatorio 24 horas antes</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Puedes cancelar o reprogramar hasta 2 horas antes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                Anterior
              </Button>
              <Button onClick={handleConfirmAppointment} className="flex items-center space-x-2">
                <Check className="h-4 w-4" />
                <span>Confirmar Cita</span>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}