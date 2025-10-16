'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  // Test mode - skip authentication for demo
  const isTestMode = process.env.NODE_ENV === 'development' || true;

  useEffect(() => {
    if (!isTestMode && !isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router, isTestMode]);

  useEffect(() => {
    if (isTestMode) {
      // Skip role-based redirects in test mode
      return;
    }

    if (isAuthenticated && user) {
      // Redirect to role-specific dashboard
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
          // Stay on generic dashboard
          break;
      }
    }
  }, [isAuthenticated, user, router, isTestMode]);

  if (!isTestMode && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isTestMode && !isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                DentalCare Pro
              </h1>
              {isTestMode && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Modo Prueba
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Bienvenido, {user?.name || 'Doctor Demo'}
              </span>
              <button
                onClick={() => {
                  router.push('/');
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}