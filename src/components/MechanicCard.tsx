import React from 'react';
import { Mechanic } from '../types';
import { Star } from 'lucide-react';

interface MechanicCardProps {
  mechanic: Mechanic;
  isSelected: boolean;
  onSelect: (mechanic: Mechanic) => void;
}

const MechanicCard: React.FC<MechanicCardProps> = ({ 
  mechanic, 
  isSelected, 
  onSelect 
}) => {
  return (
    <div 
      onClick={() => onSelect(mechanic)}
      className={`cursor-pointer rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl ${
        isSelected ? 'ring-4 ring-blue-600 transform scale-[1.02]' : ''
      }`}
    >
      <div className="h-56 overflow-hidden">
        <img 
          src={mechanic.image} 
          alt={mechanic.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4 bg-white">
        <h3 className="text-lg font-semibold text-gray-800">{mechanic.name}</h3>
        <p className="text-sm text-gray-600">{mechanic.specialization}</p>
        
        <div className="mt-2 flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(mechanic.rating) 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">{mechanic.rating.toFixed(1)}</span>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(mechanic);
          }}
          className={`mt-3 w-full py-2 rounded-md transition-colors ${
            isSelected
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-blue-600 hover:text-white'
          }`}
        >
          {isSelected ? 'Selected' : 'Select Mechanic'}
        </button>
      </div>
      
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full px-3 py-1 text-sm font-semibold">
          Selected
        </div>
      )}
    </div>
  );
};

export default MechanicCard;