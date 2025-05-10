import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import { MapPin, Euro, BedDouble, Bath, Square, Star, Image } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { darkMode } = useTheme();
  const [imageError, setImageError] = useState(false);
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  
  // Load property images from database
  useEffect(() => {
    const loadImagesFromDatabase = async () => {
      try {
        if (property.id) {
          // Fetch the property again to ensure we have the latest images
          const { data, error } = await supabase
            .from('properties')
            .select('images')
            .eq('id', property.id)
            .single();
            
          if (error) {
            console.error('Error fetching property images:', error);
            return;
          }
          
          if (data && data.images && data.images.length > 0) {
            console.log(`Loaded images for property ${property.id}:`, data.images);
            setPropertyImages(data.images);
          }
        }
      } catch (err) {
        console.error('Error loading images:', err);
      }
    };
    
    loadImagesFromDatabase();
  }, [property.id]);
  
  // Format price with thousands separator
  const formattedPrice = property.price.toLocaleString();
  
  // Default fallback images based on property type
  const getDefaultImage = () => {
    switch(property.type) {
      case 'apartment':
        return 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80';
      case 'house':
        return 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80';
      case 'commercial':
        return 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1296&q=80';
      case 'land':
        return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80';
      default:
        return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1773&q=80';
    }
  };
  
  // Determine image URL with fallbacks - first try database images, then property images, then fallback
  const imageUrl = imageError || 
    (propertyImages.length === 0 && (!property.images || property.images.length === 0))
      ? getDefaultImage() 
      : propertyImages.length > 0 
        ? propertyImages[0]
        : property.images![0];

  // Create a badge for the listing type (rent or sale)
  const listingTypeLabel = property.listing_type === 'rent' 
    ? { text: 'Me qira', bg: 'bg-blue-600' } 
    : { text: 'Në shitje', bg: 'bg-green-600' };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden ${property.featured ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={property.title} 
          className="w-full h-48 object-cover"
          onError={() => setImageError(true)}
        />
        {property.featured && (
          <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-xs font-bold flex items-center">
            <Star className="h-3 w-3 mr-1" />
            Premium
          </div>
        )}
        <div className={`absolute bottom-0 left-0 ${listingTypeLabel.bg} text-white px-2 py-1 text-xs font-bold`}>
          {listingTypeLabel.text}
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