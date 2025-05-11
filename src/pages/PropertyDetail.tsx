import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Heart, Share, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Property } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { darkMode } = useTheme();
  const { authState } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkingFavorite, setCheckingFavorite] = useState(true);
  const [viewTracked, setViewTracked] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          throw new Error('Property ID not found');
        }
        
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          throw error;
        }
        
        const propertyData: Property = {
          ...data,
          type: data.type as Property['type'],
          listing_type: data.listing_type as Property['listing_type'],
          status: data.status as Property['status'],
          images: data.images || undefined,
          features: data.features || undefined,
          featured: data.featured || undefined,
          created_at: data.created_at || undefined,
          updated_at: data.updated_at || undefined
        };
        
        setProperty(propertyData);

        // Track a view only once per session
        if (!viewTracked && id) {
          trackPropertyView(id);
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Ndodhi një gabim gjatë marrjes së të dhënave të pronës');
      } finally {
        setLoading(false);
      }
    };
    
    // Check if property is in user's favorites
    const checkFavorite = async () => {
      if (!id || !authState.user) {
        setCheckingFavorite(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('property_id', id)
          .eq('user_id', authState.user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error checking favorite:', error);
        }
        
        setIsFavorite(!!data);
      } catch (err) {
        console.error('Exception checking favorite:', err);
      } finally {
        setCheckingFavorite(false);
      }
    };
    
    fetchProperty();
    checkFavorite();
  }, [id, authState.user, viewTracked]);

  // Function to track a property view
  const trackPropertyView = async (propertyId: string) => {
    try {
      // Get user agent information
      const userAgent = navigator.userAgent;
      
      const viewData = {
        property_id: propertyId,
        viewer_id: authState.user?.id || null,
        user_agent: userAgent
      };
      
      const { error } = await supabase
        .from('property_views')
        .insert([viewData]);
        
      if (error) {
        console.error('Error tracking view:', error);
        return;
      }
      
      setViewTracked(true);
      console.log('Successfully tracked property view');
    } catch (err) {
      console.error('Exception tracking view:', err);
    }
  };

  const handleToggleFavorite = async () => {
    if (!authState.isAuthenticated) {
      // Redirect to login or show login modal
      alert('Ju duhet të kyçeni për të shtuar prona në favorite');
      return;
    }
    
    if (!property) return;
    
    try {
      if (isFavorite) {
        // Remove from favorites
        await supabase
          .from('favorites')
          .delete()
          .eq('property_id', property.id)
          .eq('user_id', authState.user!.id);
      } else {
        // Add to favorites
        await supabase
          .from('favorites')
          .insert({
            property_id: property.id,
            user_id: authState.user!.id
          });
      }
      
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const nextImage = () => {
    if (!property || !property.images || property.images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % property.images!.length);
  };

  const prevImage = () => {
    if (!property || !property.images || property.images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === 0 ? property.images!.length - 1 : prev - 1));
  };

  // Default fallback images based on property type
  const getDefaultImage = () => {
    if (!property) return '';
    
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

  // Get the current image to display
  const currentImage = property?.images && property.images.length > 0 
    ? property.images[currentImageIndex] 
    : getDefaultImage();

  // Format price with thousands separator
  const formattedPrice = property?.price.toLocaleString();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`text-center py-12 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
          <p>{error || 'Prona nuk u gjet'}</p>
          <Link 
            to="/listings" 
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Kthehu te shpalljet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <div className="mb-6">
          <Link 
            to="/listings" 
            className={`inline-flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Kthehu te shpalljet
          </Link>
        </div>
        
        {/* Property header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{property.title}</h1>
              <div className="flex items-center mt-2">
                <MapPin className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-1`} />
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{property.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {formattedPrice} €
                {property.listing_type === 'rent' && <span className="text-lg font-normal ml-1">/muaj</span>}
              </div>
              <div className={`mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-700'} uppercase text-sm font-semibold`}>
                {property.listing_type === 'rent' ? 'Me qira' : 'Në shitje'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Property images and details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Images */}
          <div className="lg:col-span-2">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              {/* Main image */}
              <div className="aspect-w-16 aspect-h-9 relative">
                <img 
                  src={currentImage} 
                  alt={property.title} 
                  className="w-full h-[400px] object-cover"
                />
                
                {/* Image navigation arrows */}
                {property.images && property.images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      aria-label="Previous image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      aria-label="Next image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail navigation */}
              {property.images && property.images.length > 1 && (
                <div className="flex overflow-x-auto mt-2 space-x-2 p-2">
                  {property.images.map((image, index) => (
                    <button 
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden transition-all ${
                        index === currentImageIndex ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Property description */}
            <div className={`mt-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Përshkrimi</h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {property.description}
              </p>
            </div>
            
            {/* Property features */}
            {property.features && property.features.length > 0 && (
              <div className={`mt-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Karakteristikat</h2>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature, index) => (
                    <span 
                      key={index} 
                      className={`px-3 py-1 rounded-full text-sm ${
                        darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right column - Property details and contact */}
          <div className="lg:col-span-1">
            {/* Property details card */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Detajet e pronës</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Lloji i pronës</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {property.type === 'apartment' && 'Banesë'}
                    {property.type === 'house' && 'Shtëpi'}
                    {property.type === 'land' && 'Tokë'}
                    {property.type === 'commercial' && 'Lokal'}
                  </span>
                </div>
                
                {(property.type === 'apartment' || property.type === 'house') && (
                  <>
                    <div className="flex justify-between">
                      <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Dhoma</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {property.rooms || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Banjo</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {property.bathrooms || 'N/A'}
                      </span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Sipërfaqja</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {property.area ? `${property.area} m²` : 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Postuar më</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {property.created_at ? new Date(property.created_at).toLocaleDateString('sq-AL') : 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-2">
                <button
                  onClick={handleToggleFavorite}
                  disabled={checkingFavorite}
                  className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md ${
                    isFavorite
                      ? 'bg-pink-100 text-pink-700 border border-pink-300'
                      : darkMode 
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-pink-700' : ''}`} />
                  {isFavorite ? 'Në favorite' : 'Shto në favorite'}
                </button>
                
                <button
                  className={`px-4 py-2 rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Share className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Contact card */}
            <div className={`mt-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Kontaktoni pronarin</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {property.owner_id ? property.owner_id.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="ml-4">
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Pronari</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Anëtar që nga 2025</p>
                  </div>
                </div>
                
                <div className="border-t border-b py-4 space-y-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium">
                    Kontakto pronarin
                  </button>
                  
                  <button className="w-full bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 py-3 rounded-md font-medium">
                    +383 4X XXX XXX
                  </button>
                </div>
                
                <div className="text-center">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Tregojini pronarit që e keni parë pronën në <span className="font-medium">RealEstate Kosovo</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;