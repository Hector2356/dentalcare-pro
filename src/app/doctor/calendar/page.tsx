'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Plus, Settings, CheckCircle, XCircle } from 'lucide-react'
import { useTestMode } from '@/lib/test-mode'

interface TimeSlot {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isAvailable: boolean
  maxAppointments: number
}

interface Appointment {
  id: string
  patientName: string
  date: string
  startTime: string
  endTime: string
  status: 'scheduled' | 'completed' | 'cancelled'
  type: string
}

export default function DoctorCalendarPage() {
  const { isTestMode } = useTestMode()
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCalendarData()
  }, [])

  const fetchCalendarData = async () => {
    try {
      // Fetch time slots
      const slotsResponse = await fetch('/api/doctor/time-slots')
      if (slotsResponse.ok) {
        const slotsData = await slotsResponse.json()
        setTimeSlots(slotsData)
      }

      // Fetch appointments
      const appointmentsResponse = await fetch('/api/doctor/appointments')
      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json()
        setAppointments(appointmentsData)
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTimeSlot = () => {
    // Abrir modal para agregar nuevo bloque de tiempo
    console.log('Agregar nuevo bloque de tiempo')
  }

  const handleToggleAvailability = async (slotId: string) => {
    try {
      const response = await fetch(`/api/doctor/time-slots/${slotId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isAvailable: !timeSlots.find(s => s.id === slotId)?.isAvailable
        })
      })

      if (response.ok) {
        setTimeSlots(prev => 
          prev.map(slot => 
            slot.id === slotId 
              ? { ...slot, isAvailable: !slot.isAvailable }
              : slot
          )
        )
      }
    } catch (error) {
      console.error('Error updating availability:', error)
    }
  }

  const weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date)
      return aptDate.toDateString() === date.toDateString()
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Mi Calendario</h1>
          <p className="text-gray-600 mt-2">Gestiona tu disponibilidad y bloques de tiempo</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </Button>
          <Button onClick={handleAddTimeSlot}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Bloque
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Panel de Disponibilidad Semanal */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Disponibilidad Semanal
              </CardTitle>
              <CardDescription>
                Configura tus horarios de atención
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weekDays.map((day, index) => {
                  const daySlots = timeSlots.filter(slot => slot.dayOfWeek === index)
                  return (
                    <div key={day} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">{day}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddTimeSlot}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      {daySlots.length > 0 ? (
                        <div className="space-y-2">
                          {daySlots.map(slot => (
                            <div
                              key={slot.id}
                              className={`flex items-center justify-between p-2 rounded border ${
                                slot.isAvailable 
                                  ? 'bg-green-50 border-green-200' 
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleToggleAvailability(slot.id)}
                                  className={`w-4 h-4 rounded-full border-2 ${
                                    slot.isAvailable
                                      ? 'bg-green-500 border-green-500'
                                      : 'bg-white border-gray-300'
                                  }`}
                                >
                                  {slot.isAvailable && (
                                    <CheckCircle className="w-3 h-3 text-white" />
                                  )}
                                </button>
                                <span className="text-sm">
                                  {slot.startTime} - {slot.endTime}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  Max: {slot.maxAppointments}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 italic">Sin horarios configurados</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vista de Calendario y Citas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Citas de {selectedDate.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardTitle>
              <CardDescription>
                Revisa y gestiona tus citas programadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Navegación de fechas */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="outline"
                  onClick={() => setSelectedDate(prev => new Date(prev.setDate(prev.getDate() - 1)))}
                >
                  ←
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant={selectedDate.toDateString() === new Date().toDateString() ? "default" : "outline"}
                    onClick={() => setSelectedDate(new Date())}
                  >
                    Hoy
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedDate(prev => new Date(prev.setDate(prev.getDate() + 1)))}
                >
                  →
                </Button>
              </div>

              {/* Lista de citas del día */}
              <div className="space-y-4">
                {getAppointmentsForDate(selectedDate).length > 0 ? (
                  getAppointmentsForDate(selectedDate).map(appointment => (
                    <div
                      key={appointment.id}
                      className={`border rounded-lg p-4 ${
                        isTestMode ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{appointment.patientName}</h4>
                            <Badge 
                              variant={
                                appointment.status === 'completed' ? 'default' :
                                appointment.status === 'cancelled' ? 'destructive' : 'secondary'
                              }
                            >
                              {appointment.status === 'completed' ? 'Completada' :
                               appointment.status === 'cancelled' ? 'Cancelada' : 'Programada'}
                            </Badge>
                            {isTestMode && (
                              <Badge variant="outline" className="text-orange-600">
                                🧪 Test
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {appointment.startTime} - {appointment.endTime}
                            </span>
                            <span>{appointment.type}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {appointment.status === 'scheduled' && (
                            <>
                              <Button size="sm" variant="outline">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Completar
                              </Button>
                              <Button size="sm" variant="outline">
                                <XCircle className="w-4 h-4 mr-1" />
                                Cancelar
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay citas programadas
                    </h3>
                    <p className="text-gray-600">
                      No tienes citas para {selectedDate.toLocaleDateString('es-ES')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid md:grid-cols-4 gap-6 mt-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Citas Hoy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getAppointmentsForDate(new Date()).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Esta Semana</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(apt => {
                    const aptDate = new Date(apt.date)
                    const now = new Date()
                    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
                    return aptDate >= now && aptDate <= weekFromNow
                  }).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bloques Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {timeSlots.filter(slot => slot.isAvailable).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disponibilidad</p>
                <p className="text-2xl font-bold text-gray-900">
                  {timeSlots.length > 0 
                    ? Math.round((timeSlots.filter(slot => slot.isAvailable).length / timeSlots.length) * 100)
                    : 0}%
                </p>
              </div>
              <Settings className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}