import React from 'react';
import { TimeSlot } from '../types';
import { Clock } from 'lucide-react';

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[];
  selectedTimeSlot: TimeSlot | null;
  onSelectTimeSlot: (timeSlot: TimeSlot) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  timeSlots,
  selectedTimeSlot,
  onSelectTimeSlot
}) => {
  // Group time slots into morning, afternoon, and evening
  const morningSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.startTime.split(':')[0]);
    return hour >= 9 && hour < 12;
  });
  
  const afternoonSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.startTime.split(':')[0]);
    return hour >= 12 && hour < 16;
  });
  
  const eveningSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.startTime.split(':')[0]);
    return hour >= 16;
  });

  const renderTimeSlotGroup = (slots: TimeSlot[], title: string) => (
    <div className="mb-6">
      <h3 className="text-md font-medium text-gray-700 mb-3">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {slots.map(slot => (
          <button
            key={slot.id}
            disabled={!slot.isAvailable}
            onClick={() => slot.isAvailable && onSelectTimeSlot(slot)}
            className={`
              flex items-center justify-center px-3 py-2 rounded-md text-sm
              ${selectedTimeSlot?.id === slot.id
                ? 'bg-blue-600 text-white'
                : slot.isAvailable
                  ? 'bg-white border border-gray-300 text-gray-700 hover:bg-blue-50'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <Clock className="h-3 w-3 mr-1" />
            {slot.startTime} - {slot.endTime}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Time Slot</h2>
      
      {renderTimeSlotGroup(morningSlots, 'Morning')}
      {renderTimeSlotGroup(afternoonSlots, 'Afternoon')}
      {renderTimeSlotGroup(eveningSlots, 'Evening')}
      
      {timeSlots.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No available time slots for the selected date.</p>
          <p className="text-gray-500 mt-2">Please select a different date.</p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;