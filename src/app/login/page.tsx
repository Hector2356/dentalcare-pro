'use client';

import { LoginForm } from '@/components/auth/login-form';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

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

  const handleLoginSuccess = () => {
    // Navigation is handled by the useEffect above
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Citas Odontológicas
          </h1>
          <p className="text-gray-600">
            Gestiona tus citas y membresías dentales
          </p>
        </div>
        
        <LoginForm 
          onSuccess={handleLoginSuccess}
        />
      </div>
    </div>
  );
}