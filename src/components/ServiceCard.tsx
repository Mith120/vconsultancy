import React from 'react';
import { Service } from '../types';
import { Check, Plus } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (service: Service) => void;
  onRemove: (serviceId: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  isSelected, 
  onSelect, 
  onRemove 
}) => {
  return (
    <div 
      className={`relative rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
        isSelected ? 'ring-4 ring-blue-600' : ''
      }`}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={service.image} 
          alt={service.name} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
      </div>
      
      <div className="p-5 bg-white">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-800">{service.name}</h3>
          <span className="text-lg font-bold text-blue-900">₹{service.price.toLocaleString()}</span>
        </div>
        
        <p className="mt-2 text-gray-600">{service.description}</p>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">Duration: {service.duration} mins</span>
          
          {isSelected ? (
            <button
              onClick={() => onRemove(service.id)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              aria-label="Remove service"
            >
              <Check className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => onSelect(service)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              aria-label="Add service"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full px-3 py-1 text-sm font-semibold">
          Selected
        </div>
      )}
    </div>
  );
};

export default ServiceCard;