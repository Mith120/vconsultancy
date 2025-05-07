import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { ChevronRight, ChevronLeft } from 'lucide-react';

import Navbar from '../components/Navbar';
import ServiceCard from '../components/ServiceCard';
import CarSelector from '../components/CarSelector';
import TimeSlotPicker from '../components/TimeSlotPicker';
import MechanicCard from '../components/MechanicCard';
import BookingSummary from '../components/BookingSummary';

import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { services, getAvailableTimeSlots, getAvailableMechanics } from '../data/services';
import { TimeSlot, Mechanic } from '../types';

const BookServicePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { 
    selectedCar, setSelectedCar,
    selectedServices, addService, removeService,
    selectedDate, setSelectedDate,
    selectedTimeSlot, setSelectedTimeSlot,
    selectedMechanic, setSelectedMechanic,
    proceedToPayment
  } = useBooking();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [availableMechanics, setAvailableMechanics] = useState<Mechanic[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    if (selectedDate) {
      const slots = getAvailableTimeSlots(selectedDate);
      setAvailableTimeSlots(slots);
      
      if (selectedServices.length > 0) {
        const serviceIds = selectedServices.map(s => s.id);
        const mechanics = getAvailableMechanics(selectedDate, serviceIds);
        setAvailableMechanics(mechanics);
      }
    }
  }, [selectedDate, selectedServices]);
  
  const handleNextStep = () => {
    setCurrentStep(current => current + 1);
  };
  
  const handlePrevStep = () => {
    setCurrentStep(current => current - 1);
  };
  
  const handleConfirmBooking = async () => {
    try {
      await proceedToPayment();
      navigate('/booking-success');
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };
  
  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return selectedCar !== null;
      case 2:
        return selectedServices.length > 0;
      case 3:
        return selectedDate !== null && selectedTimeSlot !== null;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">Select Your Car</h2>
            <CarSelector 
              selectedCar={selectedCar} 
              onSelectCar={setSelectedCar} 
            />
          </div>
        );
      case 2:
        return (
          <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-2xl font-bold text-green-700 mb-6">Select Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isSelected={selectedServices.some(s => s.id === service.id)}
                  onSelect={addService}
                  onRemove={removeService}
                />
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-2xl font-bold text-purple-700 mb-6">Select Date & Time</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-indigo-700 mb-4">Select Date</h3>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date) => setSelectedDate(date)}
                  minDate={new Date()}
                  inline
                  className="w-full"
                />
              </div>
              
              {selectedDate && (
                <div>
                  <TimeSlotPicker
                    timeSlots={availableTimeSlots}
                    selectedTimeSlot={selectedTimeSlot}
                    onSelectTimeSlot={setSelectedTimeSlot}
                  />
                </div>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-2xl font-bold text-red-700 mb-6">Select Mechanic (Optional)</h2>
            {availableMechanics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableMechanics.map(mechanic => (
                  <MechanicCard
                    key={mechanic.id}
                    mechanic={mechanic}
                    isSelected={selectedMechanic?.id === mechanic.id}
                    onSelect={setSelectedMechanic}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
                <p>No mechanics are available for the selected date and time. You can still proceed with the booking.</p>
              </div>
            )}
          </div>
        );
      case 5:
        return (
          <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-2xl font-bold text-teal-700 mb-6">Booking Summary</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Car Details</h3>
                  {selectedCar && (
                    <div>
                      <p className="text-gray-700"><span className="font-medium">Brand:</span> {selectedCar.brand}</p>
                      <p className="text-gray-700"><span className="font-medium">Model:</span> {selectedCar.model}</p>
                    </div>
                  )}
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Selected Services</h3>
                  {selectedServices.length > 0 ? (
                    <ul className="space-y-3">
                      {selectedServices.map(service => (
                        <li key={service.id} className="flex justify-between items-center">
                          <span className="text-gray-700">{service.name}</span>
                          <span className="font-medium">₹{service.price.toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No services selected</p>
                  )}
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Details</h3>
                  {selectedDate && (
                    <div>
                      <p className="text-gray-700">
                        <span className="font-medium">Date:</span> {format(selectedDate, 'dd MMMM yyyy')}
                      </p>
                      {selectedTimeSlot && (
                        <p className="text-gray-700">
                          <span className="font-medium">Time:</span> {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
                        </p>
                      )}
                      {selectedMechanic && (
                        <p className="text-gray-700 mt-2">
                          <span className="font-medium">Mechanic:</span> {selectedMechanic.name} ({selectedMechanic.specialization})
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <BookingSummary 
                showCheckoutButton={true} 
                onCheckout={handleConfirmBooking} 
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stepper */}
        <div className="mb-12">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4, 5].map((step) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div 
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full 
                      ${currentStep === step
                        ? 'bg-blue-600 text-white'
                        : currentStep > step
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }
                    `}
                  >
                    {step}
                  </div>
                  <span className="text-xs text-gray-500 mt-2 hidden sm:block">
                    {step === 1 && 'Car'}
                    {step === 2 && 'Services'}
                    {step === 3 && 'Schedule'}
                    {step === 4 && 'Mechanic'}
                    {step === 5 && 'Summary'}
                  </span>
                </div>
                
                {step < 5 && (
                  <div 
                    className={`
                      flex-grow h-1 mx-2
                      ${currentStep > step ? 'bg-green-500' : 'bg-gray-200'}
                    `}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Step Content */}
        <div className="mb-8">
          {renderStepContent()}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12">
          {currentStep > 1 && (
            <button
              onClick={handlePrevStep}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              Back
            </button>
          )}
          
          {currentStep < 5 && (
            <button
              onClick={handleNextStep}
              disabled={!isStepComplete()}
              className={`
                ml-auto flex items-center px-4 py-2 rounded-md
                ${isStepComplete()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Next
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookServicePage;
