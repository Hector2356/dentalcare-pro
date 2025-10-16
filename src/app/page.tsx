'use client';

import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { DebugButtons } from '@/components/ui/debug-buttons';
import { TestModeIndicator } from '@/components/ui/test-mode-indicator';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Calendar, Users, Shield } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      switch (user.role) {
        case 'ADMIN':
          router.push('/admin');
          break;
        case 'DOCTOR':
          router.push('/doctor');
          break;
        case 'PATIENT':
          router.push('/patient');
          break;
        default:
          router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleAuthSuccess = () => {
    // Navigation is handled by the useEffect above
  };

  const features = [
    {
      icon: Calendar,
      title: 'Gestión de Citas',
      description: 'Agenda, reprograma y cancela tus citas fácilmente',
    },
    {
      icon: Users,
      title: 'Médicos Especialistas',
      description: 'Accede a odontólogos calificados en diferentes especialidades',
    },
    {
      icon: Shield,
      title: 'Membresías Flexibles',
      description: 'Planes de membresía adaptados a tus necesidades',
    },
    {
      icon: Heart,
      title: 'Salud Dental',
      description: 'Cuidado integral para tu salud bucal',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">
                DentalCare Pro
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Sistema de Citas Odontológicas
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Auth Forms */}
          <div className="max-w-md mx-auto w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-6">
                <LoginForm onSuccess={handleAuthSuccess} />
              </TabsContent>
              
              <TabsContent value="register" className="mt-6">
                <RegisterForm onSuccess={handleAuthSuccess} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right side - Features */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Bienvenido a DentalCare Pro
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Tu plataforma integral para la gestión de citas odontológicas y membresías dentales.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <feature.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Por qué elegir DentalCare Pro?
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Agendamiento en tiempo real</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Recordatorios automáticos de citas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Planes de membresía flexibles</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Gestión de historial médico</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Facturación electrónica</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Debug Panel */}
        <div className="mt-8">
          <DebugButtons />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; 2024 DentalCare Pro. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}