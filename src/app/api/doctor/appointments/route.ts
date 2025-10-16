import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Mock appointments data
    const appointments = [
      {
        id: '1',
        patientName: 'Ana García López',
        patientEmail: 'ana.garcia@email.com',
        patientPhone: '+52 555 123 4567',
        date: '2024-01-15',
        startTime: '09:00',
        endTime: '10:00',
        status: 'scheduled',
        type: 'Consulta General',
        reason: 'Dolor de cabeza frecuente',
        notes: 'Paciente refiere dolores de cabeza por última semana',
        patientId: 'patient_1'
      },
      {
        id: '2',
        patientName: 'Carlos Rodríguez Martínez',
        patientEmail: 'carlos.rodriguez@email.com',
        patientPhone: '+52 555 234 5678',
        date: '2024-01-15',
        startTime: '10:00',
        endTime: '11:00',
        status: 'completed',
        type: 'Revisión',
        reason: 'Seguimiento tratamiento hipertensión',
        notes: 'Presión arterial controlada',
        patientId: 'patient_2'
      },
      {
        id: '3',
        patientName: 'María Fernández Hernández',
        patientEmail: 'maria.fernandez@email.com',
        patientPhone: '+52 555 345 6789',
        date: '2024-01-15',
        startTime: '11:00',
        endTime: '12:00',
        status: 'scheduled',
        type: 'Consulta Especializada',
        reason: 'Dolor articulaciones',
        notes: 'Paciente con antecedentes de artritis',
        patientId: 'patient_3'
      },
      {
        id: '4',
        patientName: 'Roberto Sánchez Díaz',
        patientEmail: 'roberto.sanchez@email.com',
        patientPhone: '+52 555 456 7890',
        date: '2024-01-16',
        startTime: '09:00',
        endTime: '10:00',
        status: 'scheduled',
        type: 'Consulta General',
        reason: 'Examen médico anual',
        notes: 'Paciente sano, chequeo rutinario',
        patientId: 'patient_4'
      },
      {
        id: '5',
        patientName: 'Laura Torres Jiménez',
        patientEmail: 'laura.torres@email.com',
        patientPhone: '+52 555 567 8901',
        date: '2024-01-16',
        startTime: '14:00',
        endTime: '15:00',
        status: 'cancelled',
        type: 'Consulta de Urgencia',
        reason: 'Dolor abdominal agudo',
        notes: 'Cancelada por paciente',
        patientId: 'patient_5'
      },
      {
        id: 'TEST_6',
        patientName: 'TEST Paciente Prueba',
        patientEmail: 'test@example.com',
        patientPhone: '+52 555 000 0000',
        date: '2024-01-17',
        startTime: '10:00',
        endTime: '11:00',
        status: 'scheduled',
        type: 'Consulta Test',
        reason: 'Consulta de prueba',
        notes: 'Datos de prueba',
        patientId: 'TEST_patient_1'
      }
    ]

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Error fetching appointments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Mock creation of appointment
    const newAppointment = {
      id: Date.now().toString(),
      ...data,
      status: 'scheduled'
    }

    return NextResponse.json(newAppointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Error creating appointment' },
      { status: 500 }
    )
  }
}