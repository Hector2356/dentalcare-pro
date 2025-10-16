'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  Users, 
  Calendar, 
  CreditCard, 
  RefreshCw, 
  Trash2, 
  Download,
  Upload,
  Play,
  Square,
  BarChart3,
  TestTube
} from 'lucide-react';
import { useTestMode } from '@/lib/test-mode';

interface TestStatistics {
  testUsers: number;
  testMemberships: number;
  total: number;
}

export function TestControlPanel() {
  const { isEnabled, generateTestId, generateTestUser, generateTestAppointment } = useTestMode();
  const [statistics, setStatistics] = useState<TestStatistics>({ testUsers: 0, testMemberships: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');

  useEffect(() => {
    if (isEnabled) {
      fetchStatistics();
    }
  }, [isEnabled]);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/test/seed');
      const data = await response.json();
      if (data.success) {
        setStatistics(data.statistics);
      }
    } catch (error) {
      console.error('Error fetching test statistics:', error);
    }
  };

  const seedTestData = async () => {
    setLoading(true);
    setLastAction('Seeding test data...');
    try {
      const response = await fetch('/api/test/seed', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setLastAction(`✅ Created ${data.createdCount} test records`);
        await fetchStatistics();
      } else {
        setLastAction(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setLastAction('❌ Failed to seed test data');
    } finally {
      setLoading(false);
    }
  };

  const cleanupTestData = async () => {
    setLoading(true);
    setLastAction('Cleaning up test data...');
    try {
      const response = await fetch('/api/test/cleanup', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setLastAction(`✅ Cleaned ${data.deletedCount} test records`);
        await fetchStatistics();
      } else {
        setLastAction(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setLastAction('❌ Failed to cleanup test data');
    } finally {
      setLoading(false);
    }
  };

  const generateSampleData = () => {
    const sampleUser = generateTestUser({
      id: 'sample123',
      email: 'user@example.com',
      identification: '12345678',
      name: 'John Doe',
    });

    const sampleAppointment = generateTestAppointment({
      id: 'apt123',
      date: '2024-01-15',
      time: '10:30',
      notes: 'Regular checkup',
    });

    console.log('Generated sample test user:', sampleUser);
    console.log('Generated sample test appointment:', sampleAppointment);
    setLastAction('✅ Generated sample data (check console)');
  };

  if (!isEnabled) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TestTube className="h-5 w-5 text-orange-600" />
            <CardTitle>Panel de Control de Pruebas</CardTitle>
          </div>
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            Modo Pruebas Activo
          </Badge>
        </div>
        <CardDescription>
          Gestiona datos de prueba y realiza experimentos de forma segura
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{statistics.testUsers}</p>
                  <p className="text-xs text-gray-600">Usuarios de prueba</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{statistics.testMemberships}</p>
                  <p className="text-xs text-gray-600">Membresías de prueba</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{statistics.total}</p>
                  <p className="text-xs text-gray-600">Total registros</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-xs text-gray-600">Aislado</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Acciones de Prueba</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={seedTestData}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Generar Datos</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={cleanupTestData}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Limpiar Datos</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={generateSampleData}
              className="flex items-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Generar Muestra</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={fetchStatistics}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Actualizar</span>
            </Button>
          </div>
        </div>

        {/* Status */}
        {lastAction && (
          <Alert>
            <AlertDescription>{lastAction}</AlertDescription>
          </Alert>
        )}

        {/* Test Accounts Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Cuentas de Prueba</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium text-sm mb-2">Paciente</h4>
                <div className="text-xs space-y-1">
                  <p><strong>Email:</strong> test_patient@example.com</p>
                  <p><strong>Password:</strong> Test123!@#</p>
                  <p><strong>ID:</strong> TEST_12345678</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium text-sm mb-2">Doctor</h4>
                <div className="text-xs space-y-1">
                  <p><strong>Email:</strong> test_doctor@example.com</p>
                  <p><strong>Password:</strong> Test123!@#</p>
                  <p><strong>ID:</strong> TEST_87654321</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium text-sm mb-2">Administrador</h4>
                <div className="text-xs space-y-1">
                  <p><strong>Email:</strong> test_admin@example.com</p>
                  <p><strong>Password:</strong> Test123!@#</p>
                  <p><strong>ID:</strong> TEST_11223344</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Safety Notice */}
        <Alert>
          <AlertDescription>
            <strong>🛡️ Modo Seguro:</strong> Todos los cambios se realizan en un entorno aislado. 
            Los datos de prueba se eliminan automáticamente y no afectan al sistema principal.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}