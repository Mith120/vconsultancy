import React from 'react';
import { format } from 'date-fns';
import { useBooking } from '../contexts/BookingContext';
import { ChevronRight } from 'lucide-react';

interface BookingSummaryProps {
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ 
  showCheckoutButton = false,
  onCheckout
}) => {
  const { 
    selectedCar, 
    selectedServices, 
    selectedDate, 
    selectedTimeSlot,
    selectedMechanic,
    totalAmount,
    gstAmount,
    finalAmount
  } = useBooking();
  
  const formattedDate = selectedDate 
    ? format(selectedDate, 'dd MMMM yyyy') 
    : '';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-900 text-white py-4 px-6">
        <h3 className="text-xl font-semibold">Booking Summary</h3>
      </div>
      
      <div className="p-6">
        {selectedCar ? (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Car</h4>
            <p className="font-medium text-gray-800">{selectedCar.brand} {selectedCar.model}</p>
          </div>
        ) : (
          <div className="mb-4 text-gray-400">No car selected</div>
        )}
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Services</h4>
          {selectedServices.length > 0 ? (
            <ul className="space-y-2">
              {selectedServices.map(service => (
                <li key={service.id} className="flex justify-between">
                  <span className="text-gray-800">{service.name}</span>
                  <span className="font-medium">₹{service.price.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No services selected</p>
          )}
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Schedule</h4>
          {selectedDate ? (
            <div>
              <p className="text-gray-800">{formattedDate}</p>
              {selectedTimeSlot && (
                <p className="text-gray-600">
                  {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-400">No date selected</p>
          )}
        </div>
        
        {selectedMechanic && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Mechanic</h4>
            <p className="text-gray-800">{selectedMechanic.name}</p>
            <p className="text-gray-600 text-sm">{selectedMechanic.specialization}</p>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">₹{totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">GST (6%)</span>
            <span className="font-medium">₹{gstAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>₹{finalAmount.toLocaleString()}</span>
          </div>
        </div>
        
        {showCheckoutButton && (
          <button
            onClick={onCheckout}
            disabled={!selectedCar || selectedServices.length === 0 || !selectedDate || !selectedTimeSlot}
            className={`
              mt-6 w-full py-3 px-4 rounded-md flex items-center justify-center
              ${(!selectedCar || selectedServices.length === 0 || !selectedDate || !selectedTimeSlot)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            <span className="mr-2">Confirm Booking</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingSummary;