import React, { useState, useEffect } from 'react';
import { Property as PropertyType } from '../types';
import { MapPin, Euro, BedDouble, Bath, Square, Star, Image, Edit, Trash2, CheckCircle, XCircle, Clock, AlertCircle, Eye, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Property extends PropertyType {
  views?: number;
  favorites?: number;
}

interface PropertyCardProps {
  property: Property;
}

const statusColors: Record<string, string> = {
  active: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800',
  expired: 'bg-gray-200 text-gray-700',
};
const statusLabels: Record<string, string> = {
  active: 'Aktiv',
  pending: 'Në rishikim',
  rejected: 'Refuzuar',
  expired: 'Skaduar',
};

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { darkMode } = useTheme();
  const { authState } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const status = property.status || 'active';
  
  const isOwner = authState.user && authState.user.id === property.owner_id;
  
  // State for actual view and favorite counts
  const [viewCount, setViewCount] = useState<number>(0);
  const [favoriteCount, setFavoriteCount] = useState<number>(0);
  
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
            .maybeSingle();
            
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
  
  // Fetch the statistics (views and favorites) from the database
  useEffect(() => {
    if (!property.id || !isOwner) return;
    
    const fetchStatistics = async () => {
      try {
        // Fetch favorite count
        const { count: favCount, error: favError } = await supabase
          .from('favorites')
          .select('*', { count: 'exact', head: true })
          .eq('property_id', property.id);
          
        if (favError) {
          console.error('Error fetching favorites count:', favError);
        } else {
          setFavoriteCount(favCount || 0);
        }
        
        // Fetch view count from property_views table
        const { count: viewsCount, error: viewsError } = await supabase
          .from('property_views')
          .select('*', { count: 'exact', head: true })
          .eq('property_id', property.id);
          
        if (viewsError) {
          console.error('Error fetching views count:', viewsError);
        } else {
          setViewCount(viewsCount || 0);
        }
        
      } catch (err) {
        console.error('Error fetching statistics:', err);
      }
    };
    
    fetchStatistics();
  }, [property.id, isOwner]);
  
  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      propertyImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [propertyImages]);

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

  const createdAt = property.created_at ? new Date(property.created_at) : new Date();
  const formattedDate = createdAt.toLocaleDateString('de-DE');

  const handleDelete = async () => {
    // Hier kann die Löschlogik mit Supabase eingebaut werden
    setShowDeleteConfirm(false);
    // Optional: Seite neu laden oder Property aus Liste entfernen
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden relative ${property.featured ? 'ring-4 ring-yellow-400' : ''}`}>
      {/* Status-Badge oben rechts */}
      <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold z-10 ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>
        {statusLabels[status] || status}
      </div>
      {property.featured && (
        <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center shadow">
          <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-900" /> Top Shpallje
        </div>
      )}
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={property.title} 
          className="w-full h-48 object-cover"
          onError={() => setImageError(true)}
        />
        {property.featured && (
          <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-2 py-1 text-xs font-bold flex items-center">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-900" /> Premium
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
        
        {/* Redesigned Statistics Bar - Only visible to property owner */}
        {isOwner && (
          <div className="mt-3 mb-3 grid grid-cols-3 gap-2 border-y border-gray-100 dark:border-gray-700 py-2">
            <div className="flex flex-col items-center py-1 px-2 rounded-md bg-blue-50 dark:bg-blue-900/30">
              <div className="flex items-center text-blue-700 dark:text-blue-300 mb-1">
                <Eye className="h-4 w-4 mr-1" />
                <span className="font-semibold">{viewCount}</span>
              </div>
              <span className="text-[10px] text-blue-600/70 dark:text-blue-400/70">shikime</span>
            </div>
            
            <div className="flex flex-col items-center py-1 px-2 rounded-md bg-pink-50 dark:bg-pink-900/30">
              <div className="flex items-center text-pink-700 dark:text-pink-300 mb-1">
                <Heart className="h-4 w-4 mr-1" />
                <span className="font-semibold">{favoriteCount}</span>
              </div>
              <span className="text-[10px] text-pink-600/70 dark:text-pink-400/70">në favorite</span>
            </div>
            
            <div className="flex flex-col items-center py-1 px-2 rounded-md bg-gray-50 dark:bg-gray-800/60">
              <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
                <Clock className="h-4 w-4 mr-1" />
                <span className="font-semibold">{formattedDate}</span>
              </div>
              <span className="text-[10px] text-gray-600/70 dark:text-gray-400/70">e postuar më</span>
            </div>
          </div>
        )}
        
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
        
        <div className="mt-4 flex flex-col gap-2">
          <Link 
            to={`/property/${property.id}`} 
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium block text-center"
          >
            Shiko detajet
          </Link>
          
          {/* Only show edit/delete buttons to the property owner */}
          {isOwner && (
            <div className="flex justify-center gap-2 mt-1">
              <Link to={`/edit-property/${property.id}`} className="flex items-center px-3 py-1 bg-gray-100 hover:bg-blue-100 text-blue-700 rounded text-xs font-medium">
                <Edit className="h-4 w-4 mr-1" /> Ndrysho
              </Link>
              <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center px-3 py-1 bg-gray-100 hover:bg-red-100 text-red-700 rounded text-xs font-medium">
                <Trash2 className="h-4 w-4 mr-1" /> Fshije
              </button>
            </div>
          )}
        </div>
        
        {/* Delete-Bestätigung */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
            <div className={`p-6 rounded-xl shadow-xl ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}> 
              <h3 className="text-lg font-bold mb-2 flex items-center"><AlertCircle className="h-5 w-5 mr-2 text-red-500" /> Fshije pronën?</h3>
              <p className="mb-4">Jeni i sigurt që doni të fshini këtë pronë? Ky veprim nuk mund të zhbëhet.</p>
              <div className="flex gap-4 justify-end">
                <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800">Anulo</button>
                <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white">Fshije</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;