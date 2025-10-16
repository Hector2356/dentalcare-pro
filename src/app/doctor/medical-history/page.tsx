'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  FileText, 
  Download, 
  Plus,
  Filter,
  Calendar,
  User,
  Activity,
  AlertTriangle,
  Heart,
  Brain,
  Eye,
  Ear,
  Bone,
  Stethoscope
} from 'lucide-react'
import { useTestMode } from '@/lib/test-mode'

interface MedicalRecord {
  id: string
  patientId: string
  patientName: string
  date: string
  type: 'consultation' | 'lab-result' | 'imaging' | 'prescription' | 'vaccination' | 'surgery'
  title: string
  description: string
  doctor: string
  diagnosis?: string
  treatment?: string
  medications?: Medication[]
  vitals?: Vitals
  notes?: string
  attachments?: Attachment[]
  followUp?: string
}

interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
}

interface Vitals {
  bloodPressure: string
  heartRate: number
  temperature: number
  weight: number
  height: number
  oxygenSaturation?: number
}

interface Attachment {
  id: string
  name: string
  type: string
  url: string
  size: number
}

export default function DoctorMedicalHistoryPage() {
  const { isTestMode } = useTestMode()
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)

  useEffect(() => {
    fetchMedicalRecords()
  }, [])

  useEffect(() => {
    filterRecords()
  }, [medicalRecords, searchTerm, typeFilter])

  const fetchMedicalRecords = async () => {
    try {
      const response = await fetch('/api/doctor/medical-history')
      if (response.ok) {
        const data = await response.json()
        setMedicalRecords(data)
      }
    } catch (error) {
      console.error('Error fetching medical records:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterRecords = () => {
    let filtered = medicalRecords

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.treatment?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(record => record.type === typeFilter)
    }

    // Sort by date (most recent first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateB.getTime() - dateA.getTime()
    })

    setFilteredRecords(filtered)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <Stethoscope className="w-4 h-4" />
      case 'lab-result': return <Activity className="w-4 h-4" />
      case 'imaging': return <Eye className="w-4 h-4" />
      case 'prescription': return <FileText className="w-4 h-4" />
      case 'vaccination': return <AlertTriangle className="w-4 h-4" />
      case 'surgery': return <Bone className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'consultation': return 'Consulta'
      case 'lab-result': return 'Resultados de Laboratorio'
      case 'imaging': return 'Estudios de Imagen'
      case 'prescription': return 'Receta Médica'
      case 'vaccination': return 'Vacunación'
      case 'surgery': return 'Cirugía'
      default: return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'default'
      case 'lab-result': return 'secondary'
      case 'imaging': return 'outline'
      case 'prescription': return 'default'
      case 'vaccination': return 'destructive'
      case 'surgery': return 'outline'
      default: return 'outline'
    }
  }

  const getRecentRecords = () => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return medicalRecords.filter(record => new Date(record.date) >= thirtyDaysAgo)
  }

  const getCriticalRecords = () => {
    return medicalRecords.filter(record => 
      record.type === 'surgery' || 
      record.description.toLowerCase().includes('urgente') ||
      record.diagnosis?.toLowerCase().includes('grave')
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid gap-6">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historial Médico</h1>
          <p className="text-gray-600 mt-2">Accede a historiales clínicos</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Registro
        </Button>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Registros</p>
                <p className="text-2xl font-bold text-gray-900">{medicalRecords.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recientes (30d)</p>
                <p className="text-2xl font-bold text-gray-900">{getRecentRecords().length}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pacientes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(medicalRecords.map(r => r.patientId)).size}
                </p>
              </div>
              <User className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Críticos</p>
                <p className="text-2xl font-bold text-gray-900">{getCriticalRecords().length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por paciente, diagnóstico, tratamiento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los tipos</option>
                <option value="consultation">Consultas</option>
                <option value="lab-result">Resultados de Laboratorio</option>
                <option value="imaging">Estudios de Imagen</option>
                <option value="prescription">Recetas Médicas</option>
                <option value="vaccination">Vacunación</option>
                <option value="surgery">Cirugías</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Registros Médicos */}
      <Card>
        <CardHeader>
          <CardTitle>Registros Médicos</CardTitle>
          <CardDescription>
            {filteredRecords.length} registros encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRecords.length > 0 ? (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className={`border rounded-lg p-6 transition-all hover:shadow-md ${
                    isTestMode ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(record.type)}
                          <h4 className="text-lg font-semibold">{record.title}</h4>
                        </div>
                        <Badge variant={getTypeColor(record.type)}>
                          {getTypeText(record.type)}
                        </Badge>
                        {isTestMode && (
                          <Badge variant="outline" className="text-orange-600">
                            🧪 Test
                          </Badge>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>Paciente: {record.patientName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Stethoscope className="w-4 h-4" />
                            <span>Doctor: {record.doctor}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(record.date).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {record.diagnosis && (
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">Diagnóstico:</span>
                              <p className="text-gray-600">{record.diagnosis}</p>
                            </div>
                          )}
                          {record.treatment && (
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">Tratamiento:</span>
                              <p className="text-gray-600">{record.treatment}</p>
                            </div>
                          )}
                          {record.followUp && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Seguimiento:</span> {new Date(record.followUp).toLocaleDateString('es-ES')}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600">{record.description}</p>
                      </div>

                      {/* Signos Vitales */}
                      {record.vitals && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-2">Signos Vitales:</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                            <div>Presión: {record.vitals.bloodPressure}</div>
                            <div>Frec. Cardíaca: {record.vitals.heartRate} lpm</div>
                            <div>Temperatura: {record.vitals.temperature}°C</div>
                            <div>Peso: {record.vitals.weight} kg</div>
                            <div>Altura: {record.vitals.height} cm</div>
                            {record.vitals.oxygenSaturation && (
                              <div>Saturación O₂: {record.vitals.oxygenSaturation}%</div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Medicamentos */}
                      {record.medications && record.medications.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Medicamentos:</p>
                          <div className="space-y-1">
                            {record.medications.map((med, index) => (
                              <div key={index} className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                                <span className="font-medium">{med.name}</span> - {med.dosage}, {med.frequency}, {med.duration}
                                {med.instructions && <span className="block text-xs mt-1">{med.instructions}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Archivos Adjuntos */}
                      {record.attachments && record.attachments.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Archivos Adjuntos:</p>
                          <div className="flex flex-wrap gap-2">
                            {record.attachments.map((attachment) => (
                              <Button
                                key={attachment.id}
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <Download className="w-3 h-3" />
                                {attachment.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notas */}
                      {record.notes && (
                        <div className="text-sm text-gray-600 border-t pt-3">
                          <p className="font-medium mb-1">Notas:</p>
                          <p>{record.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => setSelectedRecord(record)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalle
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Descargar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Imprimir
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron registros médicos
              </h3>
              <p className="text-gray-600">
                {searchTerm || typeFilter !== 'all' 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No hay registros médicos disponibles'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}