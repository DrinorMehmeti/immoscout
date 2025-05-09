import React from 'react';
import { Property } from '../types';
import { MapPin, Euro, BedDouble, Bath, Square, Star } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${property.featured ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="relative">
        <img 
          src={property.images[0]} 
          alt={property.title} 
          className="w-full h-48 object-cover"
        />
        {property.featured && (
          <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-xs font-bold flex items-center">
            <Star className="h-3 w-3 mr-1" />
            Premium
          </div>
        )}
        <div className="absolute bottom-0 left-0 bg-blue-600 text-white px-2 py-1 text-xs font-bold">
          {property.listingType === 'rent' ? 'Me qira' : 'Në shitje'}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{property.title}</h3>
          <p className="text-blue-600 font-bold flex items-center">
            <Euro className="h-4 w-4 mr-1" />
            {property.price.toLocaleString()}
            {property.listingType === 'rent' ? '/muaj' : ''}
          </p>
        </div>
        <div className="flex items-center mt-1 text-gray-500 text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{property.location}</span>
        </div>
        <p className="mt-2 text-gray-600 text-sm line-clamp-2">{property.description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          {property.rooms && (
            <div className="flex items-center text-gray-700 text-sm">
              <BedDouble className="h-4 w-4 mr-1" />
              <span>{property.rooms} dhoma</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center text-gray-700 text-sm">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms} banjo</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center text-gray-700 text-sm">
              <Square className="h-4 w-4 mr-1" />
              <span>{property.area} m²</span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <a href="#" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium block text-center">
            Shiko detajet
          </a>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;