export interface User {
  id: string;
  fullName: string;
  email: string;
  address: string;
  phone: string;
  cars: Car[];
}

export interface Car {
  id: string;
  brand: string;
  model: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
}

export interface Mechanic {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  image: string;
  availability: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  carId: string;
  date: string;
  timeSlot: TimeSlot;
  services: Service[];
  mechanicId: string;
  totalAmount: number;
  gstAmount: number;
  finalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  bookingStatus: 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
}