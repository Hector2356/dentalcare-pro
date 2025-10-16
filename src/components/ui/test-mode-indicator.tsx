'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  TestTube, 
  Settings, 
  Database, 
  Clock, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useTestMode } from '@/lib/test-mode';

export function TestModeIndicator() {
  const { isEnabled, config, enable, disable, toggle, updateConfig, cleanup } = useTestMode();
  const [showSettings, setShowSettings] = useState(false);
  const [cleanupStatus, setCleanupStatus] = useState<'idle' | 'cleaning' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!isEnabled) {
      setShowSettings(false);
    }
  }, [isEnabled]);

  const handleCleanup = async () => {
    setCleanupStatus('cleaning');
    try {
      await cleanup();
      setCleanupStatus('success');
      setTimeout(() => setCleanupStatus('idle'), 2000);
    } catch (error) {
      setCleanupStatus('error');
      setTimeout(() => setCleanupStatus('idle'), 2000);
    }
  };

  if (!isEnabled && !showSettings) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(true)}
          className="flex items-center space-x-2 shadow-lg"
        >
          <TestTube className="h-4 w-4" />
          <span>Modo Pruebas</span>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Main Indicator */}
      {isEnabled && (
        <div className="fixed top-4 left-4 z-50">
          <Card className="w-80 shadow-lg border-2 border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                  <CardTitle className="text-sm font-medium text-orange-800">
                    🧪 MODO PRUEBAS ACTIVO
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            {showSettings && (
              <CardContent className="space-y-4">
                <div className="text-xs text-orange-700">
                  <p>Los cambios se realizan en entorno aislado</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-cleanup" className="text-sm">Limpieza automática</Label>
                    <Switch
                      id="auto-cleanup"
                      checked={config.autoCleanup}
                      onCheckedChange={(checked) => updateConfig({ autoCleanup: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-indicator" className="text-sm">Mostrar indicador</Label>
                    <Switch
                      id="show-indicator"
                      checked={config.showIndicator}
                      onCheckedChange={(checked) => updateConfig({ showIndicator: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Intervalo de limpieza</Label>
                    <select
                      value={config.cleanupInterval}
                      onChange={(e) => updateConfig({ cleanupInterval: Number(e.target.value) })}
                      className="w-full p-2 text-sm border rounded"
                    >
                      <option value={15}>15 minutos</option>
                      <option value={30}>30 minutos</option>
                      <option value={60}>1 hora</option>
                      <option value={120}>2 horas</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Base de datos</Label>
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium">{config.database === 'test' ? 'Pruebas' : 'Principal'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCleanup}
                    disabled={cleanupStatus === 'cleaning'}
                    className="flex items-center space-x-2"
                  >
                    {cleanupStatus === 'cleaning' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Limpiando...</span>
                      </>
                    ) : cleanupStatus === 'success' ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Completado</span>
                      </>
                    ) : cleanupStatus === 'error' ? (
                      <>
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>Error</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span>Limpiar datos</span>
                      </>
                    )}
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={disable}
                    className="flex items-center space-x-2"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Desactivar modo pruebas</span>
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}

      {/* Settings Panel (when not enabled) */}
      {!isEnabled && showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TestTube className="h-5 w-5" />
                <span>Configurar Modo Pruebas</span>
              </CardTitle>
              <CardDescription>
                Activa el modo de pruebas para realizar cambios sin afectar el sistema principal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">¿Qué es el modo pruebas?</p>
                    <ul className="mt-1 space-y-1 text-xs">
                      <li>• Base de datos aislada</li>
                      <li>• Datos generados automáticamente</li>
                      <li>• Limpieza automática programada</li>
                      <li>• Sin afectar datos reales</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setShowSettings(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={enable} className="flex-1">
                  <TestTube className="h-4 w-4 mr-2" />
                  Activar Modo Pruebas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}