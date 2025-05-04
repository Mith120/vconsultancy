import React from 'react';
import { Car } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface CarSelectorProps {
  selectedCar: Car | null;
  onSelectCar: (car: Car) => void;
}

const CarSelector: React.FC<CarSelectorProps> = ({ selectedCar, onSelectCar }) => {
  const { user } = useAuth();
  
  if (!user || user.cars.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <p className="text-gray-600">No cars registered. Please add a car to your profile.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Select Your Car</h3>
      <div className="space-y-3">
        {user.cars.map((car) => (
          <div
            key={car.id}
            onClick={() => {
              console.log('Car selected:', car);
              onSelectCar(car);
            }}
            className={`
              cursor-pointer border rounded-lg p-4 transition-all
              ${selectedCar?.id === car.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-400'
              }
            `}
          >
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 border ${
                selectedCar?.id === car.id 
                  ? 'border-blue-600 bg-blue-600' 
                  : 'border-gray-400'
              }`}>
                {selectedCar?.id === car.id && (
                  <div className="w-2 h-2 bg-white rounded-full m-auto mt-[3px]"></div>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800">{car.brand} {car.model}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarSelector;