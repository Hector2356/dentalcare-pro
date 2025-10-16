import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Mock notifications data
    const notifications = [
      {
        id: '1',
        type: 'appointment',
        title: 'Nueva cita programada',
        message: 'Ana García López ha programado una cita para mañana a las 9:00 AM.',
        timestamp: '2024-01-14T10:30:00Z',
        read: false,
        priority: 'medium',
        actionUrl: '/doctor/appointments',
        actionText: 'Ver Cita',
        patientId: '1',
        patientName: 'Ana García López',
        appointmentId: '1'
      },
      {
        id: '2',
        type: 'urgent',
        title: 'Consulta de Urgencia',
        message: 'Laura Torres requiere atención urgente por dolor abdominal agudo.',
        timestamp: '2024-01-14T09:15:00Z',
        read: false,
        priority: 'urgent',
        actionUrl: '/doctor/appointments',
        actionText: 'Atender Urgencia',
        patientId: '5',
        patientName: 'Laura Torres Jiménez'
      },
      {
        id: '3',
        type: 'lab-result',
        title: 'Resultados de Laboratorio Disponibles',
        message: 'Los resultados de laboratorio de María Fernández están listos para revisión.',
        timestamp: '2024-01-14T08:45:00Z',
        read: false,
        priority: 'high',
        actionUrl: '/doctor/medical-history',
        actionText: 'Ver Resultados',
        patientId: '3',
        patientName: 'María Fernández Hernández'
      },
      {
        id: '4',
        type: 'patient',
        title: 'Nuevo Paciente Registrado',
        message: 'Roberto Sánchez se ha registrado en el sistema y necesita asignación de médico.',
        timestamp: '2024-01-13T16:20:00Z',
        read: true,
        priority: 'medium',
        actionUrl: '/doctor/patients',
        actionText: 'Ver Paciente',
        patientId: '4',
        patientName: 'Roberto Sánchez Díaz'
      },
      {
        id: '5',
        type: 'reminder',
        title: 'Recordatorio de Cita',
        message: 'Mañana tienes 5 citas programadas. Recuerda revisar tu calendario.',
        timestamp: '2024-01-13T18:00:00Z',
        read: true,
        priority: 'low',
        actionUrl: '/doctor/calendar',
        actionText: 'Ver Calendario'
      },
      {
        id: '6',
        type: 'system',
        title: 'Actualización del Sistema',
        message: 'El sistema estará en mantenimiento mañana de 2:00 AM a 4:00 AM.',
        timestamp: '2024-01-13T12:00:00Z',
        read: true,
        priority: 'low'
      },
      {
        id: '7',
        type: 'message',
        title: 'Mensaje de Paciente',
        message: 'Carlos Rodríguez ha enviado un mensaje sobre su tratamiento.',
        timestamp: '2024-01-13T10:30:00Z',
        read: true,
        priority: 'medium',
        actionUrl: '/doctor/messages',
        actionText: 'Leer Mensaje',
        patientId: '2',
        patientName: 'Carlos Rodríguez Martínez'
      },
      {
        id: '8',
        type: 'appointment',
        title: 'Cita Cancelada',
        message: 'Laura Torres ha cancelado su cita de hoy a las 2:00 PM.',
        timestamp: '2024-01-13T09:00:00Z',
        read: true,
        priority: 'medium',
        patientId: '5',
        patientName: 'Laura Torres Jiménez',
        appointmentId: '5'
      },
      {
        id: '9',
        type: 'vaccination',
        title: 'Recordatorio de Vacunación',
        message: 'Roberto Sánchez está próximo a su fecha de vacunación contra la influenza.',
        timestamp: '2024-01-12T14:30:00Z',
        read: true,
        priority: 'low',
        actionUrl: '/doctor/patients/4',
        actionText: 'Ver Paciente',
        patientId: '4',
        patientName: 'Roberto Sánchez Díaz'
      },
      {
        id: '10',
        type: 'surgery',
        title: 'Programación de Cirugía',
        message: 'Se ha programado una cirugía para María Fernández el próximo viernes.',
        timestamp: '2024-01-12T11:00:00Z',
        read: true,
        priority: 'high',
        actionUrl: '/doctor/appointments',
        actionText: 'Ver Detalles',
        patientId: '3',
        patientName: 'María Fernández Hernández'
      },
      {
        id: 'TEST_11',
        type: 'appointment',
        title: 'TEST Notificación de Prueba',
        message: 'Esta es una notificación de prueba para el modo de pruebas.',
        timestamp: '2024-01-14T12:00:00Z',
        read: false,
        priority: 'medium',
        actionUrl: '/doctor/appointments',
        actionText: 'Ver Test',
        patientId: 'TEST_6',
        patientName: 'TEST Paciente Prueba'
      }
    ]

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Error fetching notifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Mock creation of notification
    const newNotification = {
      id: Date.now().toString(),
      ...data,
      timestamp: new Date().toISOString(),
      read: false
    }

    return NextResponse.json(newNotification, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Error creating notification' },
      { status: 500 }
    )
  }
}