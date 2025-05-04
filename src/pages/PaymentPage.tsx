import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import BookingSummary from '../components/BookingSummary';
import { useBooking } from '../contexts/BookingContext';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentBooking, finalAmount } = useBooking();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  
  // Card details
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  
  // UPI details
  const [upiId, setUpiId] = useState('');

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'number') {
      // Format card number with spaces after every 4 digits
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardDetails({ ...cardDetails, [name]: formattedValue });
    } else if (name === 'expiry') {
      // Format expiry as MM/YY
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{0,2})/, '$1/$2')
        .substring(0, 5);
      setCardDetails({ ...cardDetails, [name]: formattedValue });
    } else {
      setCardDetails({ ...cardDetails, [name]: value });
    }
  };

  const handlePayment = () => {
    if (!currentBooking) {
      navigate('/book');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Redirect to success page after a delay
      setTimeout(() => {
        navigate('/booking-success');
      }, 2000);
    }, 2000);
  };

  // If no booking details, redirect back
  if (!currentBooking) {
    navigate('/book');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment</h1>
        
        {isSuccess ? (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your booking has been confirmed. Redirecting to booking details...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-900 text-white py-4 px-6">
                  <h2 className="text-xl font-semibold">Payment Options</h2>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex space-x-4 mb-6">
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`
                          flex-1 p-4 rounded-md flex items-center justify-center border
                          ${paymentMethod === 'card'
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:border-blue-400'
                          }
                        `}
                      >
                        <CreditCard className="mr-2 h-5 w-5" />
                        Credit/Debit Card
                      </button>
                      
                      <button
                        onClick={() => setPaymentMethod('upi')}
                        className={`
                          flex-1 p-4 rounded-md flex items-center justify-center border
                          ${paymentMethod === 'upi'
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:border-blue-400'
                          }
                        `}
                      >
                        <span className="mr-2 font-bold">UPI</span>
                        Pay via UPI
                      </button>
                    </div>
                    
                    {paymentMethod === 'card' ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            name="number"
                            value={cardDetails.number}
                            onChange={handleCardInputChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={cardDetails.name}
                            onChange={handleCardInputChange}
                            placeholder="John Doe"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Expiration Date
                            </label>
                            <input
                              type="text"
                              name="expiry"
                              value={cardDetails.expiry}
                              onChange={handleCardInputChange}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CVV
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              value={cardDetails.cvv}
                              onChange={handleCardInputChange}
                              placeholder="123"
                              maxLength={4}
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          UPI ID
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="name@upi"
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Enter your UPI ID (e.g., yourname@okaxis)
                        </p>
                      </div>
                    )}
                    
                    <button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className={`
                        mt-8 w-full py-3 px-4 rounded-md bg-blue-600 text-white font-medium
                        ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}
                      `}
                    >
                      {isProcessing 
                        ? 'Processing Payment...' 
                        : `Pay ₹${finalAmount.toLocaleString()}`
                      }
                    </button>
                    
                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-500">
                        By clicking the button, you agree to our{' '}
                        <a href="#" className="text-blue-600">Terms and Conditions</a> and{' '}
                        <a href="#" className="text-blue-600">Privacy Policy</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This is a demo payment page. No actual payment will be processed.
                </p>
              </div>
            </div>
            
            <BookingSummary />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;