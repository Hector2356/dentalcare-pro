'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, FileText, Bell, Settings, ArrowRight, Stethoscope, Clock, Shield, Plus } from 'lucide-react';
import Link from 'next/link';
import { AppointmentModal } from '@/components/appointment-modal';
import { useState } from 'react';

export default function SimpleHomePage() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DentalCare Pro</h1>
                <p className="text-sm text-gray-600">Sistema de Gestión Dental</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => setIsAppointmentModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Cita
              </Button>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Modo Prueba
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Gestión Dental Profesional
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sistema completo de gestión para clínicas dentales. Administre pacientes, 
            citas, historiales médicos y más en una plataforma intuitiva.
          </p>
          
          <div className="space-y-4">
            <Link href="/dashboard/doctor">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Acceder al Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <div className="pt-4">
              <p className="text-sm text-gray-500 mb-4">O accede directamente a:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/dashboard/doctor/calendar">
                  <Button variant="outline" size="sm">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Calendario
                  </Button>
                </Link>
                <Link href="/dashboard/doctor/appointments">
                  <Button variant="outline" size="sm">
                    <Clock className="h-4 w-4 mr-2" />
                    Citas
                  </Button>
                </Link>
                <Link href="/dashboard/doctor/patients">
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Pacientes
                  </Button>
                </Link>
                <Link href="/dashboard/doctor/history">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Historial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Características Principales
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/dashboard/doctor/calendar">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <CalendarDays className="h-8 w-8 text-blue-600 mb-4" />
                <h4 className="text-lg font-semibold mb-2">Gestión de Citas</h4>
                <p className="text-gray-600">
                  Administre y programe citas de manera eficiente
                </p>
              </div>
            </Link>

            <Link href="/dashboard/doctor/patients">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <Users className="h-8 w-8 text-green-600 mb-4" />
                <h4 className="text-lg font-semibold mb-2">Directorio de Pacientes</h4>
                <p className="text-gray-600">
                  Mantenga un registro completo de sus pacientes
                </p>
              </div>
            </Link>

            <Link href="/dashboard/doctor/history">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <FileText className="h-8 w-8 text-purple-600 mb-4" />
                <h4 className="text-lg font-semibold mb-2">Historial Médico</h4>
                <p className="text-gray-600">
                  Acceda al historial clínico de cada paciente
                </p>
              </div>
            </Link>

            <Link href="/dashboard/doctor/notifications">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <Bell className="h-8 w-8 text-orange-600 mb-4" />
                <h4 className="text-lg font-semibold mb-2">Notificaciones</h4>
                <p className="text-gray-600">
                  Manténgase informado con alertas y recordatorios
                </p>
              </div>
            </Link>

            <Link href="/dashboard/doctor/calendar">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <Clock className="h-8 w-8 text-teal-600 mb-4" />
                <h4 className="text-lg font-semibold mb-2">Horarios Flexibles</h4>
                <p className="text-gray-600">
                  Gestione horarios de atención y disponibilidad
                </p>
              </div>
            </Link>

            <Link href="/dashboard/doctor/settings">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <Shield className="h-8 w-8 text-red-600 mb-4" />
                <h4 className="text-lg font-semibold mb-2">Seguridad</h4>
                <p className="text-gray-600">
                  Protección de datos confidenciales de pacientes
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Stethoscope className="h-6 w-6" />
            <span className="text-xl font-bold">DentalCare Pro</span>
          </div>
          <p className="text-gray-400">
            Sistema de gestión dental profesional - Modo de prueba
          </p>
        </div>
      </footer>
      </div>
      
      <AppointmentModal 
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
    </>
  );
}