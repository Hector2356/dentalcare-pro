import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Mock doctor profile data
    const profile = {
      id: '1',
      name: 'Dr. Miguel Ángel Sánchez Rodríguez',
      email: 'dr.sanchez@medicenter.com',
      phone: '+52 555 123 4567',
      specialization: 'Medicina General',
      license: 'CED-123456-MEX',
      experience: 15,
      bio: 'Médico general con más de 15 años de experiencia en atención primaria. Especializado en medicina preventiva y manejo de enfermedades crónicas. Comprometido con la salud integral de mis pacientes.',
      officeAddress: 'Av. Principal #123, Col. Centro, Ciudad de México, CP 06000',
      officePhone: '+52 555 987 6543',
      consultationFee: 500,
      languages: ['Español', 'Inglés'],
      education: [
        {
          id: '1',
          degree: 'Médico Cirujano',
          institution: 'Universidad Nacional Autónoma de México (UNAM)',
          year: '2008',
          field: 'Medicina'
        },
        {
          id: '2',
          degree: 'Especialidad en Medicina Familiar',
          institution: 'Instituto Mexicano del Seguro Social (IMSS)',
          year: '2012',
          field: 'Medicina Familiar'
        }
      ],
      certifications: [
        {
          id: '1',
          name: 'Certificación en Reanimación Cardiovascular',
          issuer: 'American Heart Association',
          year: '2023',
          expiryDate: '2025-12-31'
        },
        {
          id: '2',
          name: 'Certificación en Diabetes',
          issuer: 'Asociación Mexicana de Diabetes',
          year: '2022',
          expiryDate: '2024-12-31'
        }
      ],
      availability: {
        workingDays: [1, 2, 3, 4, 5], // Monday to Friday
        startTime: '09:00',
        endTime: '18:00',
        breakStartTime: '14:00',
        breakEndTime: '15:00',
        maxAppointmentsPerDay: 14,
        appointmentDuration: 60
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        appointmentReminders: true,
        patientUpdates: true,
        systemUpdates: true,
        marketingEmails: false
      },
      privacy: {
        profileVisibility: 'patients',
        showContactInfo: true,
        showSchedule: true,
        allowReviews: true,
        dataSharing: false
      }
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Error fetching profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Mock update of profile
    const updatedProfile = {
      id: '1',
      ...data,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Error updating profile' },
      { status: 500 }
    )
  }
}