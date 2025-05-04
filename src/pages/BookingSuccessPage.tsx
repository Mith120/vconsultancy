import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Download, Calendar, Home } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const BookingSuccessPage: React.FC = () => {
  const { currentBooking, selectedCar, selectedServices, selectedDate, selectedTimeSlot, selectedMechanic, totalAmount, gstAmount, finalAmount } = useBooking();
  const { user } = useAuth();
  const receiptRef = useRef<HTMLDivElement>(null);
  
  // Generate a random booking ID
  const bookingId = currentBooking?.id || `BK${Math.floor(Math.random() * 10000)}`;
  
  // Format the date
  const formattedDate = selectedDate 
    ? format(selectedDate, 'dd MMMM yyyy')
    : '';
  
  const handlePrint = () => {
    if (receiptRef.current) {
      const printContents = receiptRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
          <p className="text-xl text-gray-600 mt-2">
            Your service has been scheduled successfully
          </p>
        </div>
        
        <div ref={receiptRef} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-900 text-white py-4 px-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Booking Receipt</h2>
            <div className="flex items-center">
              <span className="text-sm mr-2">Booking ID:</span>
              <span className="font-mono font-medium">{bookingId}</span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h3>
                <p className="text-gray-600">Name: <span className="text-gray-900 font-medium">{user?.fullName || 'N/A'}</span></p>
                <p className="text-gray-600">Email: <span className="text-gray-900 font-medium">{user?.email || 'N/A'}</span></p>
                <p className="text-gray-600">Phone: <span className="text-gray-900 font-medium">{user?.phone || 'N/A'}</span></p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Car Details</h3>
                {selectedCar && (
                  <>
                    <p className="text-gray-600">Brand: <span className="text-gray-900 font-medium">{selectedCar.brand}</span></p>
                    <p className="text-gray-600">Model: <span className="text-gray-900 font-medium">{selectedCar.model}</span></p>
                  </>
                )}
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Appointment Details</h3>
              <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
                <p className="text-gray-600">Date: <span className="text-gray-900 font-medium">{formattedDate}</span></p>
                {selectedTimeSlot && (
                  <p className="text-gray-600">Time: <span className="text-gray-900 font-medium">{selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}</span></p>
                )}
                {selectedMechanic && (
                  <p className="text-gray-600">Mechanic: <span className="text-gray-900 font-medium">{selectedMechanic.name}</span></p>
                )}
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Services Booked</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 text-left text-gray-600">Service</th>
                    <th className="py-2 text-right text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedServices.map(service => (
                    <tr key={service.id} className="border-b border-gray-100">
                      <td className="py-3 text-gray-800">{service.name}</td>
                      <td className="py-3 text-right text-gray-800">₹{service.price.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="border-b border-gray-200">
                    <td className="py-3 text-gray-600">Subtotal</td>
                    <td className="py-3 text-right text-gray-800">₹{totalAmount.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 text-gray-600">GST (6%)</td>
                    <td className="py-3 text-right text-gray-800">₹{gstAmount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-gray-900">Total</td>
                    <td className="py-3 text-right font-bold text-gray-900">₹{finalAmount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Important Information</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Please arrive 10 minutes before your scheduled appointment.</li>
                <li>• Remember to bring your vehicle's documentation.</li>
                {/* Removed reschedule point as per request */}
                <li>• For any queries, please contact our customer support at support@e6carspa.com or call +91 9876543210.</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handlePrint}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Receipt
          </button>
          
          <Link
            to="/"
            className="flex items-center px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            <Home className="mr-2 h-5 w-5" />
            Return to Home
          </Link>
          
          <Link
            to="/book"
            className="flex items-center px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Book Another Service
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;