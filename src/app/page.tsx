'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, FileText, Bell, Settings, ArrowRight, Stethoscope, Clock, Shield } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
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
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Modo Prueba
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Gestión Dental Profesional
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Sistema completo de gestión para clínicas dentales. Administre pacientes, 
              citas, historiales médicos y más en una plataforma intuitiva.
            </p>
            <Link href="/dashboard/doctor">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Acceder al Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
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
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CalendarDays className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Gestión de Citas</CardTitle>
                <CardDescription>
                  Administre y programe citas de manera eficiente
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Directorio de Pacientes</CardTitle>
                <CardDescription>
                  Mantenga un registro completo de sus pacientes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Historial Médico</CardTitle>
                <CardDescription>
                  Acceda al historial clínico de cada paciente
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Bell className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>
                  Manténgase informado con alertas y recordatorios
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="h-8 w-8 text-teal-600 mb-2" />
                <CardTitle>Horarios Flexibles</CardTitle>
                <CardDescription>
                  Gestione horarios de atención y disponibilidad
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>
                  Protección de datos confidenciales de pacientes
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">
            Acceso Rápido
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard/doctor/calendar">
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Calendario
              </Button>
            </Link>
            <Link href="/dashboard/doctor/appointments">
              <Button variant="outline" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Citas
              </Button>
            </Link>
            <Link href="/dashboard/doctor/patients">
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Pacientes
              </Button>
            </Link>
            <Link href="/dashboard/doctor/history">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Historial
              </Button>
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
  );
}