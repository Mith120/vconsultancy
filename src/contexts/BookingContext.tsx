import React, { createContext, useContext, useState } from 'react';
import { Booking, Car, Service, TimeSlot, Mechanic } from '../types';
import { useAuth } from './AuthContext';

interface BookingContextType {
  selectedCar: Car | null;
  selectedServices: Service[];
  selectedDate: Date | null;
  selectedTimeSlot: TimeSlot | null;
  selectedMechanic: Mechanic | null;
  currentBooking: Partial<Booking> | null;
  totalAmount: number;
  gstAmount: number;
  finalAmount: number;
  
  setSelectedCar: (car: Car | null) => void;
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedTimeSlot: (timeSlot: TimeSlot | null) => void;
  setSelectedMechanic: (mechanic: Mechanic | null) => void;
  clearBooking: () => void;
  proceedToPayment: () => Promise<Partial<Booking>>;
}

const BookingContext = createContext<BookingContextType | null>(null);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);
  const [currentBooking, setCurrentBooking] = useState<Partial<Booking> | null>(null);

  // Calculate totals
  const totalAmount = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const gstAmount = totalAmount * 0.06; // 6% GST
  const finalAmount = totalAmount + gstAmount;

  const addService = (service: Service) => {
    if (!selectedServices.some(s => s.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter(service => service.id !== serviceId));
  };

  const clearBooking = () => {
    setSelectedCar(null);
    setSelectedServices([]);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setSelectedMechanic(null);
    setCurrentBooking(null);
  };

  const proceedToPayment = async () => {
    if (!selectedCar || selectedServices.length === 0 || !selectedDate || !selectedTimeSlot) {
      throw new Error('Incomplete booking details');
    }

    const booking: Partial<Booking> = {
      userId: user?.id || '',
      carId: (selectedCar as any)._id,
      services: selectedServices,
      date: selectedDate ? selectedDate.toISOString() : undefined,
      timeSlot: selectedTimeSlot,
      mechanicId: selectedMechanic?.id || '',
      totalAmount,
      gstAmount,
      finalAmount,
      paymentStatus: 'pending',
      bookingStatus: 'confirmed'
    };

    console.log('Booking to be sent:', booking);

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(booking)
      });

      if (!response.ok) {
        throw new Error('Failed to save booking');
      }

      const data = await response.json();
      setCurrentBooking(data.booking);
      return data.booking;
    } catch (error) {
      console.error('Error saving booking:', error);
      throw error;
    }
  };

  return (
    <BookingContext.Provider value={{
      selectedCar,
      selectedServices,
      selectedDate,
      selectedTimeSlot,
      selectedMechanic,
      currentBooking,
      totalAmount,
      gstAmount,
      finalAmount,
      
      setSelectedCar,
      addService,
      removeService,
      setSelectedDate,
      setSelectedTimeSlot,
      setSelectedMechanic,
      clearBooking,
      proceedToPayment
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
