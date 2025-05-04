import { Service, Mechanic, TimeSlot } from '../types';

export const services: Service[] = [
  {
    id: 'service-1',
    name: 'Car Wash & Polish',
    description: 'Complete exterior wash with premium polish for a showroom shine.',
    price: 1499,
    duration: 60, // minutes
    image: 'https://images.pexels.com/photos/6873076/pexels-photo-6873076.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'service-2',
    name: 'Engine Service',
    description: 'Comprehensive engine check-up, oil change, and filter replacement.',
    price: 3999,
    duration: 120,
    image: 'https://images.pexels.com/photos/4480505/pexels-photo-4480505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'service-3',
    name: 'Wheel Alignment',
    description: 'Precision wheel alignment to ensure smooth driving and reduced tire wear.',
    price: 1799,
    duration: 45,
    image: 'https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'service-4',
    name: 'Interior Deep Clean',
    description: 'Complete interior detailing and sanitization with premium products.',
    price: 2499,
    duration: 90,
    image: 'https://images.pexels.com/photos/3807329/pexels-photo-3807329.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'service-5',
    name: 'AC Service',
    description: 'Complete air conditioning system check-up and gas refill if needed.',
    price: 2799,
    duration: 60,
    image: 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'service-6',
    name: 'Brake Service',
    description: 'Inspection and servicing of the complete brake system for safety.',
    price: 2999,
    duration: 75,
    image: 'https://images.pexels.com/photos/8985458/pexels-photo-8985458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

// Generate time slots from 9 AM to 6 PM, every hour
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let i = 9; i < 18; i++) {
    slots.push({
      id: `slot-${i}`,
      startTime: `${i}:00`,
      endTime: `${i + 1}:00`,
      isAvailable: Math.random() > 0.3 // Random availability for demo
    });
  }
  return slots;
};

export const mechanics: Mechanic[] = [
  {
    id: 'mechanic-1',
    name: 'Rajesh Kumar',
    specialization: 'Engine Specialist',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/8460290/pexels-photo-8460290.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    availability: generateTimeSlots()
  },
  {
    id: 'mechanic-2',
    name: 'Sunil Verma',
    specialization: 'Electrical Systems',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/3822719/pexels-photo-3822719.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    availability: generateTimeSlots()
  },
  {
    id: 'mechanic-3',
    name: 'Priya Singh',
    specialization: 'Detailing Expert',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/6647111/pexels-photo-6647111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    availability: generateTimeSlots()
  }
];

export const getAvailableTimeSlots = (date: Date, mechanicId?: string): TimeSlot[] => {
  // In a real application, this would be an API call
  // For demo, we'll return random availability
  return generateTimeSlots();
};

export const getAvailableMechanics = (date: Date, serviceIds: string[]): Mechanic[] => {
  // In a real application, this would filter mechanics based on their specialization and availability
  return mechanics;
};