import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Mock patients data
    const patients = [
      {
        id: '1',
        name: 'Ana García López',
        email: 'ana.garcia@email.com',
        phone: '+52 555 123 4567',
        dateOfBirth: '1985-06-15',
        gender: 'female',
        bloodType: 'O+',
        allergies: ['Penicilina', 'Nueces'],
        conditions: ['Hipertensión leve', 'Migrañas'],
        lastVisit: '2024-01-10',
        nextAppointment: '2024-01-15',
        totalVisits: 12,
        status: 'active',
        membershipStatus: 'active',
        emergencyContact: {
          name: 'José García',
          phone: '+52 555 987 6543',
          relationship: 'Esposo'
        }
      },
      {
        id: '2',
        name: 'Carlos Rodríguez Martínez',
        email: 'carlos.rodriguez@email.com',
        phone: '+52 555 234 5678',
        dateOfBirth: '1978-03-22',
        gender: 'male',
        bloodType: 'A+',
        allergies: [],
        conditions: ['Hipertensión', 'Diabetes tipo 2'],
        lastVisit: '2024-01-15',
        nextAppointment: '2024-02-15',
        totalVisits: 24,
        status: 'active',
        membershipStatus: 'active',
        emergencyContact: {
          name: 'Patricia Rodríguez',
          phone: '+52 555 876 5432',
          relationship: 'Hermana'
        }
      },
      {
        id: '3',
        name: 'María Fernández Hernández',
        email: 'maria.fernandez@email.com',
        phone: '+52 555 345 6789',
        dateOfBirth: '1992-11-08',
        gender: 'female',
        bloodType: 'B+',
        allergies: ['Mariscos'],
        conditions: ['Artritis reumatoide'],
        lastVisit: '2024-01-12',
        nextAppointment: '2024-01-15',
        totalVisits: 8,
        status: 'active',
        membershipStatus: 'active',
        emergencyContact: {
          name: 'Luis Fernández',
          phone: '+52 555 765 4321',
          relationship: 'Padre'
        }
      },
      {
        id: '4',
        name: 'Roberto Sánchez Díaz',
        email: 'roberto.sanchez@email.com',
        phone: '+52 555 456 7890',
        dateOfBirth: '1980-07-30',
        gender: 'male',
        bloodType: 'O-',
        allergies: [],
        conditions: [],
        lastVisit: '2024-01-05',
        nextAppointment: '2024-01-16',
        totalVisits: 3,
        status: 'new',
        membershipStatus: 'none',
        emergencyContact: {
          name: 'Carmen Díaz',
          phone: '+52 555 654 3210',
          relationship: 'Madre'
        }
      },
      {
        id: '5',
        name: 'Laura Torres Jiménez',
        email: 'laura.torres@email.com',
        phone: '+52 555 567 8901',
        dateOfBirth: '1995-02-14',
        gender: 'female',
        bloodType: 'AB+',
        allergies: ['Látex'],
        conditions: ['Asma leve'],
        lastVisit: '2023-12-20',
        totalVisits: 15,
        status: 'inactive',
        membershipStatus: 'expired',
        emergencyContact: {
          name: 'Miguel Torres',
          phone: '+52 555 543 2109',
          relationship: 'Hermano'
        }
      },
      {
        id: 'TEST_6',
        name: 'TEST Paciente Prueba',
        email: 'test@example.com',
        phone: '+52 555 000 0000',
        dateOfBirth: '1990-01-01',
        gender: 'other',
        bloodType: 'A+',
        allergies: ['Test alergia'],
        conditions: ['Test condición'],
        lastVisit: '2024-01-14',
        nextAppointment: '2024-01-17',
        totalVisits: 1,
        status: 'new',
        membershipStatus: 'active',
        emergencyContact: {
          name: 'TEST Contacto',
          phone: '+52 555 111 1111',
          relationship: 'Test'
        }
      }
    ]

    return NextResponse.json(patients)
  } catch (error) {
    console.error('Error fetching patients:', error)
    return NextResponse.json(
      { error: 'Error fetching patients' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Mock creation of patient
    const newPatient = {
      id: Date.now().toString(),
      ...data,
      totalVisits: 0,
      status: 'new',
      membershipStatus: 'none'
    }

    return NextResponse.json(newPatient, { status: 201 })
  } catch (error) {
    console.error('Error creating patient:', error)
    return NextResponse.json(
      { error: 'Error creating patient' },
      { status: 500 }
    )
  }
}