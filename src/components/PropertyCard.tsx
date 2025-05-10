import React from 'react';
import { Property } from '../types';
import { MapPin, Euro, BedDouble, Bath, Square, Star } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { darkMode } = useTheme();
  
  // Format price with thousands separator
  const formattedPrice = property.price.toLocaleString();
  
  // Placeholder image if no images are available
  const imageUrl = property.images && property.images.length > 0 
    ? property.images[0] 
    : 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden ${property.featured ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="relative">
        <img 
          src={imageUrl} 
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
          {property.listing_type === 'rent' ? 'Me qira' : 'Në shitje'}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>{property.title}</h3>
          <p className="text-blue-600 font-bold flex items-center">
            <Euro className="h-4 w-4 mr-1" />
            {formattedPrice}
            {property.listing_type === 'rent' ? '/muaj' : ''}
          </p>
        </div>
        <div className="flex items-center mt-1 text-gray-500 text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{property.location}</span>
        </div>
        <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm line-clamp-2`}>{property.description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          {property.rooms && (
            <div className={`flex items-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <BedDouble className="h-4 w-4 mr-1" />
              <span>{property.rooms} dhoma</span>
            </div>
          )}
          {property.bathrooms && (
            <div className={`flex items-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms} banjo</span>
            </div>
          )}
          {property.area && (
            <div className={`flex items-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Square className="h-4 w-4 mr-1" />
              <span>{property.area} m²</span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <Link 
            to={`/property/${property.id}`} 
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium block text-center"
          >
            Shiko detajet
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;