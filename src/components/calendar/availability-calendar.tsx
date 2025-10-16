'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, User, Check } from 'lucide-react';
import { CalendarApiService, DoctorAvailability, TimeSlot } from '@/services/api/calendar.service';
import { toast } from 'sonner';

interface AvailabilityCalendarProps {
  doctorId: string;
  onSlotSelect?: (date: string, slot: TimeSlot) => void;
  selectedDate?: string;
  selectedSlot?: TimeSlot;
}

export function AvailabilityCalendar({ 
  doctorId, 
  onSlotSelect, 
  selectedDate, 
  selectedSlot 
}: AvailabilityCalendarProps) {
  const [availability, setAvailability] = useState<DoctorAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadAvailability();
  }, [doctorId, currentMonth]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const data = await CalendarApiService.getDoctorAvailability(
        doctorId,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      
      setAvailability(data);
    } catch (error: any) {
      toast.error(error.message || 'Error al cargar disponibilidad');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const getAvailabilityForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return availability.find(a => a.date === dateStr);
  };

  const handleDateClick = (day: number) => {
    const dateAvailability = getAvailabilityForDate(day);
    if (dateAvailability && dateAvailability.availableSlots.length > 0) {
      // Scroll to time slots
      const element = document.getElementById(`time-slots-${day}`);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSlotSelect = (date: string, slot: TimeSlot) => {
    onSlotSelect?.(date, slot);
  };

  const formatMonthYear = () => {
    return currentMonth.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isPastDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const days = getDaysInMonth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Disponibilidad</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          >
            Anterior
          </Button>
          <span className="font-medium min-w-[150px] text-center">
            {formatMonthYear()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          >
            Siguiente
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-4">
          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="p-2"></div>;
              }

              const dateAvailability = getAvailabilityForDate(day);
              const hasAvailability = dateAvailability && dateAvailability.availableSlots.length > 0;
              const isDateToday = isToday(day);
              const isDatePast = isPastDate(day);
              const dateStr = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
              const isSelected = selectedDate === dateStr;

              return (
                <div key={day} className="p-1">
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`w-full h-12 relative ${
                      isDateToday ? 'ring-2 ring-blue-500' : ''
                    } ${
                      isDatePast ? 'opacity-50 cursor-not-allowed' : ''
                    } ${
                      hasAvailability ? 'bg-green-50 hover:bg-green-100 border-green-300' : ''
                    }`}
                    onClick={() => !isDatePast && handleDateClick(day)}
                    disabled={isDatePast}
                  >
                    <div className="text-sm">{day}</div>
                    {hasAvailability && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                      </div>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Time Slots */}
      <div className="space-y-4">
        {days.filter(day => day !== null).map(day => {
          const dateAvailability = getAvailabilityForDate(day);
          if (!dateAvailability || dateAvailability.availableSlots.length === 0) {
            return null;
          }

          const dateStr = dateAvailability.date;
          const isSelected = selectedDate === dateStr;

          return (
            <Card key={day} id={`time-slots-${day}`} className={isSelected ? 'ring-2 ring-blue-500' : ''}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {new Date(dateStr).toLocaleDateString('es-CO', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <Badge variant="secondary">
                    {dateAvailability.availableSlots.length} espacios disponibles
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {dateAvailability.availableSlots.map((slot, index) => {
                    const isSlotSelected = 
                      isSelected && 
                      selectedSlot?.start === slot.start && 
                      selectedSlot?.end === slot.end;

                    return (
                      <Button
                        key={index}
                        variant={isSlotSelected ? "default" : "outline"}
                        size="sm"
                        className="flex items-center space-x-1"
                        onClick={() => handleSlotSelect(dateStr, slot)}
                      >
                        <Clock className="h-3 w-3" />
                        <span>{slot.start}</span>
                        {isSlotSelected && <Check className="h-3 w-3" />}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {availability.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay disponibilidad este mes
            </h3>
            <p className="text-gray-600">
              Este médico no tiene horarios disponibles para el mes seleccionado
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}