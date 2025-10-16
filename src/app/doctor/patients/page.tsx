'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  Filter,
  Eye,
  FileText,
  Activity,
  AlertCircle
} from 'lucide-react'
import { useTestMode } from '@/lib/test-mode'

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  bloodType: string
  allergies: string[]
  conditions: string[]
  lastVisit: string
  nextAppointment?: string
  totalVisits: number
  status: 'active' | 'inactive' | 'new'
  membershipStatus: 'active' | 'expired' | 'none'
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
}

export default function DoctorPatientsPage() {
  const { isTestMode } = useTestMode()
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  useEffect(() => {
    fetchPatients()
  }, [])

  useEffect(() => {
    filterPatients()
  }, [patients, searchTerm, statusFilter])

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/doctor/patients')
      if (response.ok) {
        const data = await response.json()
        setPatients(data)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterPatients = () => {
    let filtered = patients

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        patient.conditions.some(condition => 
          condition.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(patient => patient.status === statusFilter)
    }

    // Sort by last visit (most recent first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.lastVisit)
      const dateB = new Date(b.lastVisit)
      return dateB.getTime() - dateA.getTime()
    })

    setFilteredPatients(filtered)
  }

  const getAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      case 'new': return 'outline'
      default: return 'outline'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo'
      case 'inactive': return 'Inactivo'
      case 'new': return 'Nuevo'
      default: return status
    }
  }

  const getMembershipColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'expired': return 'destructive'
      case 'none': return 'secondary'
      default: return 'secondary'
    }
  }

  const getMembershipText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa'
      case 'expired': return 'Expirada'
      case 'none': return 'Sin membresía'
      default: return status
    }
  }

  const getActivePatients = () => patients.filter(p => p.status === 'active').length
  const getNewPatients = () => patients.filter(p => p.status === 'new').length
  const getPatientsWithAppointments = () => patients.filter(p => p.nextAppointment).length

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
          <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-600 mt-2">Lista de pacientes asignados</p>
        </div>
        <Button>
          <User className="w-4 h-4 mr-2" />
          Nuevo Paciente
        </Button>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pacientes</p>
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              </div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-gray-900">{getActivePatients()}</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nuevos</p>
                <p className="text-2xl font-bold text-gray-900">{getNewPatients()}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Con Citas</p>
                <p className="text-2xl font-bold text-gray-900">{getPatientsWithAppointments()}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
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
                  placeholder="Buscar por nombre, email, teléfono o condiciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
                <option value="new">Nuevos</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pacientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
          <CardDescription>
            {filteredPatients.length} pacientes encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPatients.length > 0 ? (
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`border rounded-lg p-6 transition-all hover:shadow-md ${
                    isTestMode ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-lg font-semibold">{patient.name}</h4>
                        <Badge variant={getStatusColor(patient.status)}>
                          {getStatusText(patient.status)}
                        </Badge>
                        <Badge variant={getMembershipColor(patient.membershipStatus)}>
                          {getMembershipText(patient.membershipStatus)}
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
                            <Mail className="w-4 h-4" />
                            <span>{patient.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{patient.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{getAge(patient.dateOfBirth)} años</span>
                            <span>•</span>
                            <span>{patient.gender === 'male' ? 'Masculino' : patient.gender === 'female' ? 'Femenino' : 'Otro'}</span>
                            <span>•</span>
                            <span>Tipo: {patient.bloodType}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Última visita:</span> {new Date(patient.lastVisit).toLocaleDateString('es-ES')}
                          </div>
                          {patient.nextAppointment && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Próxima cita:</span> {new Date(patient.nextAppointment).toLocaleDateString('es-ES')}
                            </div>
                          )}
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Total visitas:</span> {patient.totalVisits}
                          </div>
                        </div>
                      </div>

                      {/* Condiciones y Alergias */}
                      <div className="mb-4">
                        {patient.conditions.length > 0 && (
                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">Condiciones:</p>
                            <div className="flex flex-wrap gap-1">
                              {patient.conditions.map((condition, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {condition}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {patient.allergies.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Alergias:</p>
                            <div className="flex flex-wrap gap-1">
                              {patient.allergies.map((allergy, index) => (
                                <Badge key={index} variant="destructive" className="text-xs">
                                  {allergy}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Contacto de Emergencia */}
                      <div className="text-sm text-gray-600 border-t pt-3">
                        <p className="font-medium mb-1">Contacto de emergencia:</p>
                        <p>{patient.emergencyContact.name} ({patient.emergencyContact.relationship}) - {patient.emergencyContact.phone}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalle
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Historial
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        Nueva Cita
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron pacientes
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No tienes pacientes asignados'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}