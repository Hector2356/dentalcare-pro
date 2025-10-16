'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Settings, 
  Bell, 
  Lock, 
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  Globe,
  Shield,
  CreditCard,
  FileText,
  Download,
  Upload,
  Save,
  Eye,
  EyeOff,
  Camera,
  Stethoscope,
  Hospital,
  Award,
  Plus
} from 'lucide-react'
import { useTestMode } from '@/lib/test-mode'

interface DoctorProfile {
  id: string
  name: string
  email: string
  phone: string
  specialization: string
  license: string
  experience: number
  bio: string
  officeAddress: string
  officePhone: string
  consultationFee: number
  languages: string[]
  education: Education[]
  certifications: Certification[]
  availability: AvailabilitySettings
  notifications: NotificationSettings
  privacy: PrivacySettings
}

interface Education {
  id: string
  degree: string
  institution: string
  year: string
  field: string
}

interface Certification {
  id: string
  name: string
  issuer: string
  year: string
  expiryDate?: string
}

interface AvailabilitySettings {
  workingDays: number[]
  startTime: string
  endTime: string
  breakStartTime: string
  breakEndTime: string
  maxAppointmentsPerDay: number
  appointmentDuration: number
}

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  appointmentReminders: boolean
  patientUpdates: boolean
  systemUpdates: boolean
  marketingEmails: boolean
}

interface PrivacySettings {
  profileVisibility: 'public' | 'patients' | 'private'
  showContactInfo: boolean
  showSchedule: boolean
  allowReviews: boolean
  dataSharing: boolean
}

export default function DoctorSettingsPage() {
  const { isTestMode } = useTestMode()
  const [profile, setProfile] = useState<DoctorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/doctor/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!profile) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/doctor/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })

      if (response.ok) {
        // Show success message
        console.log('Profile saved successfully')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      // Show error message
      return
    }

    try {
      const response = await fetch('/api/doctor/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      })

      if (response.ok) {
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        // Show success message
      }
    } catch (error) {
      console.error('Error changing password:', error)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'professional', label: 'Información Profesional', icon: Stethoscope },
    { id: 'availability', label: 'Disponibilidad', icon: Calendar },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'privacy', label: 'Privacidad', icon: Lock },
    { id: 'billing', label: 'Facturación', icon: CreditCard }
  ]

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid gap-6">
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
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-2">Ajustes de perfil y consulta</p>
        </div>
        <Button onClick={handleSaveProfile} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuración</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        activeTab === tab.id 
                          ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                          : 'text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && profile && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Actualiza tu información personal y de contacto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                      <Button size="sm" className="absolute bottom-0 right-0 rounded-full p-2">
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{profile.name}</h3>
                      <p className="text-gray-600">{profile.specialization}</p>
                      {isTestMode && (
                        <Badge variant="outline" className="text-orange-600 mt-1">
                          🧪 Modo Prueba
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre Completo
                      </label>
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono Personal
                      </label>
                      <Input
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono Oficina
                      </label>
                      <Input
                        value={profile.officePhone}
                        onChange={(e) => setProfile({...profile, officePhone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Biografía
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Seguridad</CardTitle>
                  <CardDescription>
                    Cambia tu contraseña y ajustes de seguridad
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña Actual
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nueva Contraseña
                    </label>
                    <Input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Nueva Contraseña
                    </label>
                    <Input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                  </div>
                  <Button onClick={handlePasswordChange}>
                    <Lock className="w-4 h-4 mr-2" />
                    Cambiar Contraseña
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'professional' && profile && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información Profesional</CardTitle>
                  <CardDescription>
                    Detalles sobre tu especialización y experiencia
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Especialización
                      </label>
                      <Input
                        value={profile.specialization}
                        onChange={(e) => setProfile({...profile, specialization: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Licencia Médica
                      </label>
                      <Input
                        value={profile.license}
                        onChange={(e) => setProfile({...profile, license: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Años de Experiencia
                      </label>
                      <Input
                        type="number"
                        value={profile.experience}
                        onChange={(e) => setProfile({...profile, experience: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tarifa de Consulta
                      </label>
                      <Input
                        type="number"
                        value={profile.consultationFee}
                        onChange={(e) => setProfile({...profile, consultationFee: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección de Consultorio
                    </label>
                    <Input
                      value={profile.officeAddress}
                      onChange={(e) => setProfile({...profile, officeAddress: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Idiomas
                    </label>
                    <Input
                      placeholder="Español, Inglés, etc."
                      value={profile.languages.join(', ')}
                      onChange={(e) => setProfile({...profile, languages: e.target.value.split(', ').filter(l => l.trim())})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Educación</CardTitle>
                  <CardDescription>
                    Tu formación académica
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.education.map((edu) => (
                      <div key={edu.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{edu.degree}</h4>
                            <p className="text-sm text-gray-600">{edu.institution}</p>
                            <p className="text-sm text-gray-600">{edu.field} • {edu.year}</p>
                          </div>
                          <Button size="sm" variant="outline">Editar</Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Educación
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'availability' && profile && (
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Disponibilidad</CardTitle>
                <CardDescription>
                  Define tus horarios de atención
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora de Inicio
                    </label>
                    <Input
                      type="time"
                      value={profile.availability.startTime}
                      onChange={(e) => setProfile({
                        ...profile,
                        availability: {...profile.availability, startTime: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora de Fin
                    </label>
                    <Input
                      type="time"
                      value={profile.availability.endTime}
                      onChange={(e) => setProfile({
                        ...profile,
                        availability: {...profile.availability, endTime: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Inicio de Descanso
                    </label>
                    <Input
                      type="time"
                      value={profile.availability.breakStartTime}
                      onChange={(e) => setProfile({
                        ...profile,
                        availability: {...profile.availability, breakStartTime: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fin de Descanso
                    </label>
                    <Input
                      type="time"
                      value={profile.availability.breakEndTime}
                      onChange={(e) => setProfile({
                        ...profile,
                        availability: {...profile.availability, breakEndTime: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Máximo de Citas por Día
                    </label>
                    <Input
                      type="number"
                      value={profile.availability.maxAppointmentsPerDay}
                      onChange={(e) => setProfile({
                        ...profile,
                        availability: {...profile.availability, maxAppointmentsPerDay: parseInt(e.target.value)}
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duración de Cita (minutos)
                    </label>
                    <Input
                      type="number"
                      value={profile.availability.appointmentDuration}
                      onChange={(e) => setProfile({
                        ...profile,
                        availability: {...profile.availability, appointmentDuration: parseInt(e.target.value)}
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && profile && (
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Notificación</CardTitle>
                <CardDescription>
                  Configura cómo y cuándo recibes notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(profile.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {key === 'emailNotifications' ? 'Notificaciones por Email' :
                         key === 'smsNotifications' ? 'Notificaciones por SMS' :
                         key === 'pushNotifications' ? 'Notificaciones Push' :
                         key === 'appointmentReminders' ? 'Recordatorios de Citas' :
                         key === 'patientUpdates' ? 'Actualizaciones de Pacientes' :
                         key === 'systemUpdates' ? 'Actualizaciones del Sistema' :
                         key === 'marketingEmails' ? 'Emails de Marketing' : key}
                      </p>
                      <p className="text-sm text-gray-600">
                        {key === 'emailNotifications' ? 'Recibe notificaciones importantes por email' :
                         key === 'smsNotifications' ? 'Recibe alertas urgentes por SMS' :
                         key === 'pushNotifications' ? 'Notificaciones en tiempo real' :
                         key === 'appointmentReminders' ? 'Recordatorios de próximas citas' :
                         key === 'patientUpdates' ? 'Actualizaciones sobre tus pacientes' :
                         key === 'systemUpdates' ? 'Mantenimiento y novedades del sistema' :
                         key === 'marketingEmails' ? 'Promociones y noticias' : ''}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setProfile({
                        ...profile,
                        notifications: {...profile.notifications, [key]: e.target.checked}
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === 'privacy' && profile && (
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Privacidad</CardTitle>
                <CardDescription>
                  Controla la visibilidad de tu información
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visibilidad del Perfil
                  </label>
                  <select
                    value={profile.privacy.profileVisibility}
                    onChange={(e) => setProfile({
                      ...profile,
                      privacy: {...profile.privacy, profileVisibility: e.target.value as any}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="public">Público</option>
                    <option value="patients">Solo Pacientes</option>
                    <option value="private">Privado</option>
                  </select>
                </div>

                {Object.entries(profile.privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {key === 'showContactInfo' ? 'Mostrar Información de Contacto' :
                         key === 'showSchedule' ? 'Mostrar Horario Disponible' :
                         key === 'allowReviews' ? 'Permitir Reseñas' :
                         key === 'dataSharing' ? 'Compartir Datos Anónimos' : key}
                      </p>
                      <p className="text-sm text-gray-600">
                        {key === 'showContactInfo' ? 'Muestra tu email y teléfono en tu perfil' :
                         key === 'showSchedule' ? 'Los pacientes pueden ver tus horarios disponibles' :
                         key === 'allowReviews' ? 'Permite que los pacientes dejen reseñas' :
                         key === 'dataSharing' ? 'Ayuda a mejorar el sistema con datos anónimos' : ''}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setProfile({
                        ...profile,
                        privacy: {...profile.privacy, [key]: e.target.checked}
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de Facturación</CardTitle>
                  <CardDescription>
                    Gestiona tus métodos de pago y facturación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Configuración de Pagos
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Configura tus métodos de pago y preferencias de facturación
                    </p>
                    <Button>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Configurar Pagos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}