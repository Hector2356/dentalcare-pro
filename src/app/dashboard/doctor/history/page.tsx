'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Search, Download, Plus } from 'lucide-react';
import Link from 'next/link';

export default function DoctorHistory() {
  const medicalHistories = [
    {
      id: 1,
      patient: "María García",
      date: "2024-01-15",
      diagnosis: "Caries dental",
      treatment: "Obturación realizada",
      doctor: "Dr. Smith",
      status: "Completado"
    },
    {
      id: 2,
      patient: "Juan Pérez",
      date: "2024-01-10",
      diagnosis: "Gingivitis leve",
      treatment: "Limpieza profunda y enjuague antibacterial",
      doctor: "Dra. Johnson",
      status: "En seguimiento"
    },
    {
      id: 3,
      patient: "Carlos López",
      date: "2023-12-20",
      diagnosis: "Maloclusión",
      treatment: "Tratamiento de ortodoncia iniciado",
      doctor: "Dr. Smith",
      status: "En tratamiento"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Historial Médico
            </h1>
            <p className="text-gray-600">
              Expedientes clínicos de pacientes
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Registro
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Historiales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Buscar por paciente, diagnóstico o tratamiento..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Medical Histories List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Registros Médicos
          </CardTitle>
          <CardDescription>
            Historial clínico completo de los pacientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {medicalHistories.map((history) => (
              <div key={history.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">{history.patient}</p>
                      <p className="text-sm text-gray-600">{history.diagnosis}</p>
                      <p className="text-xs text-gray-500">{history.treatment}</p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-medium">{history.date}</p>
                  <p className="text-sm text-gray-600">{history.doctor}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    history.status === 'Completado' 
                      ? 'bg-green-100 text-green-800' 
                      : history.status === 'En seguimiento'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {history.status}
                  </span>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    PDF
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
        <Link href="/dashboard/doctor/patients">
          <Button variant="outline">
            Ver Pacientes
          </Button>
        </Link>
      </div>
    </div>
  );
}