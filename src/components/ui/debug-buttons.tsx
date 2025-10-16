'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigation } from '@/hooks/use-navigation';
import { useAuth } from '@/hooks/use-auth';
import { TestTube, Navigation, LogIn, LogOut } from 'lucide-react';

export function DebugButtons() {
  const { navigate } = useNavigation();
  const { isAuthenticated, user, logout } = useAuth();

  const handleTestNavigation = (path: string) => {
    console.log('Testing navigation to:', path);
    navigate(path);
  };

  const handleTestLogout = () => {
    console.log('Testing logout');
    logout();
  };

  const handleTestAlert = () => {
    alert('Botón funciona correctamente');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TestTube className="h-5 w-5" />
          <span>Panel de Depuración</span>
        </CardTitle>
        <CardDescription>
          Botones de prueba para verificar funcionalidad
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Estado de Autenticación:</p>
          <p className="text-sm text-gray-600">
            {isAuthenticated ? `Autenticado como: ${user?.name} (${user?.role})` : 'No autenticado'}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Pruebas de Navegación:</p>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleTestNavigation('/')}
              className="flex items-center space-x-1"
            >
              <Navigation className="h-3 w-3" />
              <span>Inicio</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleTestNavigation('/patient')}
              className="flex items-center space-x-1"
            >
              <Navigation className="h-3 w-3" />
              <span>Paciente</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleTestNavigation('/doctor')}
              className="flex items-center space-x-1"
            >
              <Navigation className="h-3 w-3" />
              <span>Doctor</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleTestNavigation('/admin')}
              className="flex items-center space-x-1"
            >
              <Navigation className="h-3 w-3" />
              <span>Admin</span>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Pruebas Generales:</p>
          <div className="space-y-2">
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleTestAlert}
              className="w-full"
            >
              <TestTube className="h-3 w-3 mr-2" />
              Probar Alert
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.href = '/test'}
              className="w-full"
            >
              <TestTube className="h-3 w-3 mr-2" />
              Modo Pruebas
            </Button>
            {isAuthenticated && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleTestLogout}
                className="w-full"
              >
                <LogOut className="h-3 w-3 mr-2" />
                Cerrar Sesión
              </Button>
            )}
          </div>
        </div>

        <div className="text-xs text-gray-500 border-t pt-2">
          <p>Consola del navegador para ver logs</p>
        </div>
      </CardContent>
    </Card>
  );
}