import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Mock data for time slots
    const timeSlots = [
      {
        id: '1',
        dayOfWeek: 1, // Monday
        startTime: '09:00',
        endTime: '12:00',
        isAvailable: true,
        maxAppointments: 6
      },
      {
        id: '2',
        dayOfWeek: 1,
        startTime: '14:00',
        endTime: '18:00',
        isAvailable: true,
        maxAppointments: 8
      },
      {
        id: '3',
        dayOfWeek: 2, // Tuesday
        startTime: '09:00',
        endTime: '12:00',
        isAvailable: true,
        maxAppointments: 6
      },
      {
        id: '4',
        dayOfWeek: 2,
        startTime: '14:00',
        endTime: '18:00',
        isAvailable: false,
        maxAppointments: 8
      },
      {
        id: '5',
        dayOfWeek: 3, // Wednesday
        startTime: '09:00',
        endTime: '12:00',
        isAvailable: true,
        maxAppointments: 6
      },
      {
        id: '6',
        dayOfWeek: 3,
        startTime: '14:00',
        endTime: '18:00',
        isAvailable: true,
        maxAppointments: 8
      },
      {
        id: '7',
        dayOfWeek: 4, // Thursday
        startTime: '09:00',
        endTime: '12:00',
        isAvailable: true,
        maxAppointments: 6
      },
      {
        id: '8',
        dayOfWeek: 4,
        startTime: '14:00',
        endTime: '18:00',
        isAvailable: true,
        maxAppointments: 8
      },
      {
        id: '9',
        dayOfWeek: 5, // Friday
        startTime: '09:00',
        endTime: '12:00',
        isAvailable: true,
        maxAppointments: 6
      },
      {
        id: '10',
        dayOfWeek: 5,
        startTime: '14:00',
        endTime: '18:00',
        isAvailable: true,
        maxAppointments: 8
      }
    ]

    return NextResponse.json(timeSlots)
  } catch (error) {
    console.error('Error fetching time slots:', error)
    return NextResponse.json(
      { error: 'Error fetching time slots' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Mock creation of time slot
    const newTimeSlot = {
      id: Date.now().toString(),
      ...data
    }

    return NextResponse.json(newTimeSlot, { status: 201 })
  } catch (error) {
    console.error('Error creating time slot:', error)
    return NextResponse.json(
      { error: 'Error creating time slot' },
      { status: 500 }
    )
  }
}