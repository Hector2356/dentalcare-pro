'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Search, Plus, FileText } from 'lucide-react';
import Link from 'next/link';

export default function DoctorPatients() {
  const patients = [
    {
      id: 1,
      name: "María García",
      email: "maria.garcia@email.com",
      phone: "555-0123",
      lastVisit: "2024-01-15",
      status: "Activo"
    },
    {
      id: 2,
      name: "Juan Pérez",
      email: "juan.perez@email.com",
      phone: "555-0124",
      lastVisit: "2024-01-10",
      status: "Activo"
    },
    {
      id: 3,
      name: "Carlos López",
      email: "carlos.lopez@email.com",
      phone: "555-0125",
      lastVisit: "2023-12-20",
      status: "Inactivo"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pacientes
            </h1>
            <p className="text-gray-600">
              Directorio completo de pacientes
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Paciente
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Pacientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patients List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Pacientes
          </CardTitle>
          <CardDescription>
            Todos los pacientes registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-gray-600">{patient.email}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{patient.phone}</p>
                  <p className="text-xs text-gray-500">Última visita: {patient.lastVisit}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    patient.status === 'Activo' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {patient.status}
                  </span>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    Historial
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Link href="/dashboard/doctor">
          <Button variant="outline">
            Volver al Dashboard
          </Button>
        </Link>
        <Link href="/dashboard/doctor/history">
          <Button variant="outline">
            Ver Historial Médico
          </Button>
        </Link>
      </div>
    </div>
  );
}