'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Bell, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  X,
  Search,
  Filter,
  Settings,
  User,
  Mail,
  Phone,
  MessageSquare,
  Heart,
  Activity,
  FileText
} from 'lucide-react'
import { useTestMode } from '@/lib/test-mode'

interface Notification {
  id: string
  type: 'appointment' | 'patient' | 'system' | 'urgent' | 'reminder' | 'lab-result' | 'message'
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  actionUrl?: string
  actionText?: string
  patientId?: string
  patientName?: string
  appointmentId?: string
  expiresAt?: string
}

export default function DoctorNotificationsPage() {
  const { isTestMode } = useTestMode()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [readFilter, setReadFilter] = useState<string>('all')

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    filterNotifications()
  }, [notifications, searchTerm, typeFilter, readFilter])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/doctor/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterNotifications = () => {
    let filtered = notifications

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(notification => 
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(notification => notification.type === typeFilter)
    }

    // Filter by read status
    if (readFilter !== 'all') {
      filtered = filtered.filter(notification => 
        readFilter === 'read' ? notification.read : !notification.read
      )
    }

    // Sort by timestamp (most recent first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp)
      const dateB = new Date(b.timestamp)
      return dateB.getTime() - dateA.getTime()
    })

    setFilteredNotifications(filtered)
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/doctor/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true })
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true }
              : notification
          )
        )
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/doctor/notifications/mark-all-read', {
        method: 'POST'
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        )
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/doctor/notifications/${notificationId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.filter(notification => notification.id !== notificationId)
        )
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-4 h-4" />
      case 'patient': return <User className="w-4 h-4" />
      case 'system': return <Settings className="w-4 h-4" />
      case 'urgent': return <AlertTriangle className="w-4 h-4" />
      case 'reminder': return <Clock className="w-4 h-4" />
      case 'lab-result': return <FileText className="w-4 h-4" />
      case 'message': return <MessageSquare className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'appointment': return 'Cita'
      case 'patient': return 'Paciente'
      case 'system': return 'Sistema'
      case 'urgent': return 'Urgente'
      case 'reminder': return 'Recordatorio'
      case 'lab-result': return 'Resultados'
      case 'message': return 'Mensaje'
      default: return type
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive'
      case 'high': return 'default'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgente'
      case 'high': return 'Alta'
      case 'medium': return 'Media'
      case 'low': return 'Baja'
      default: return priority
    }
  }

  const getUnreadCount = () => notifications.filter(n => !n.read).length
  const getUrgentCount = () => notifications.filter(n => n.priority === 'urgent' && !n.read).length
  const getTodayCount = () => {
    const today = new Date().toDateString()
    return notifications.filter(n => new Date(n.timestamp).toDateString() === today).length
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Ahora'
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`
    return `Hace ${Math.floor(diffInMinutes / 1440)} d`
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
          <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
          <p className="text-gray-600 mt-2">Alertas y recordatorios</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Marcar todas como leídas
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">No Leídas</p>
                <p className="text-2xl font-bold text-gray-900">{getUnreadCount()}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgentes</p>
                <p className="text-2xl font-bold text-red-600">{getUrgentCount()}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoy</p>
                <p className="text-2xl font-bold text-gray-900">{getTodayCount()}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
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
                  placeholder="Buscar notificaciones..."
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
                <option value="appointment">Citas</option>
                <option value="patient">Pacientes</option>
                <option value="system">Sistema</option>
                <option value="urgent">Urgentes</option>
                <option value="reminder">Recordatorios</option>
                <option value="lab-result">Resultados</option>
                <option value="message">Mensajes</option>
              </select>
              <select
                value={readFilter}
                onChange={(e) => setReadFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas</option>
                <option value="unread">No leídas</option>
                <option value="read">Leídas</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Notificaciones</CardTitle>
          <CardDescription>
            {filteredNotifications.length} notificaciones encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-6 transition-all hover:shadow-md ${
                    !notification.read 
                      ? isTestMode 
                        ? 'border-orange-400 bg-orange-100' 
                        : 'border-blue-400 bg-blue-50'
                      : isTestMode 
                        ? 'border-orange-200 bg-orange-50' 
                        : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(notification.type)}
                          <h4 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h4>
                        </div>
                        <Badge variant={getPriorityColor(notification.priority)}>
                          {getPriorityText(notification.priority)}
                        </Badge>
                        <Badge variant="outline">
                          {getTypeText(notification.type)}
                        </Badge>
                        {!notification.read && (
                          <Badge variant="default" className="bg-blue-600">
                            Nueva
                          </Badge>
                        )}
                        {isTestMode && (
                          <Badge variant="outline" className="text-orange-600">
                            🧪 Test
                          </Badge>
                        )}
                      </div>

                      <div className="mb-3">
                        <p className="text-gray-700">{notification.message}</p>
                        {notification.patientName && (
                          <p className="text-sm text-gray-600 mt-1">
                            Paciente: {notification.patientName}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {getTimeAgo(notification.timestamp)}
                          </span>
                          <span>
                            {new Date(notification.timestamp).toLocaleDateString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          {notification.actionUrl && (
                            <Button
                              size="sm"
                              onClick={() => window.location.href = notification.actionUrl}
                            >
                              {notification.actionText || 'Ver Detalle'}
                            </Button>
                          )}
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Marcar como leída
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron notificaciones
              </h3>
              <p className="text-gray-600">
                {searchTerm || typeFilter !== 'all' || readFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No tienes notificaciones nuevas'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}