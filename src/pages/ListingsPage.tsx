import React, { useState, useEffect } from 'react';
import { MapPin, Building, Euro, Search, Filter, Star, Grid3X3, List } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { Property } from '../types';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';

const ListingsPage: React.FC = () => {
  const { darkMode } = useTheme();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high'>('newest');
  const [propertyType, setPropertyType] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [listingType, setListingType] = useState<'all' | 'rent' | 'sale'>('all');
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all active properties
  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'active');
          
        if (error) {
          throw error;
        }
        
        setProperties(data || []);
        setFilteredProperties(data || []);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Ndodhi një gabim gjatë marrjes së të dhënave');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProperties();
  }, []);

  // Filter properties when filter criteria change
  useEffect(() => {
    const filtered = properties.filter((property) => {
      // Filter by property type
      if (propertyType && property.type !== propertyType) return false;
      
      // Filter by location
      if (location && property.location !== location) return false;
      
      // Filter by listing type
      if (listingType !== 'all' && property.listing_type !== listingType) return false;
      
      // Filter by price range
      if (property.price < priceRange.min || property.price > priceRange.max) return false;
      
      // Filter by search query
      if (
        searchQuery &&
        !property.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !property.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !property.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      
      return true;
    });

    // Sort properties
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      } else if (sortBy === 'price_low') {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

    setFilteredProperties(sorted);
  }, [properties, propertyType, location, listingType, priceRange, searchQuery, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is handled by useEffect, but we can add logic here if needed
  };

  // Function to get unique locations from properties
  const getUniqueLocations = () => {
    const locations = properties.map(property => property.location);
    return [...new Set(locations)];
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col`}>
      <main className="flex-grow pt-6 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <form onSubmit={handleSearchSubmit} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md mb-6`}>
          <div className="flex flex-col space-y-4">
            <div className={`flex items-center border ${darkMode ? 'border-gray-700' : 'border-gray-300'} rounded-lg overflow-hidden`}>
              <div className="pl-4 pr-2 py-2 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Kërkoni me fjalë kyçe..."
                className={`w-full px-2 py-3 focus:outline-none ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`flex items-center border ${darkMode ? 'border-gray-700' : 'border-gray-300'} rounded-lg overflow-hidden`}>
                <div className="pl-4 pr-2 py-2 text-gray-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <select 
                  className={`w-full px-2 py-3 focus:outline-none ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Të gjitha lokacionet</option>
                  {getUniqueLocations().map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              
              <div className={`flex items-center border ${darkMode ? 'border-gray-700' : 'border-gray-300'} rounded-lg overflow-hidden`}>
                <div className="pl-4 pr-2 py-2 text-gray-400">
                  <Building className="h-5 w-5" />
                </div>
                <select 
                  className={`w-full px-2 py-3 focus:outline-none ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="">Të gjitha llojet</option>
                  <option value="apartment">Banesë</option>
                  <option value="house">Shtëpi</option>
                  <option value="land">Tokë</option>
                  <option value="commercial">Lokal</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center"
              >
                <Search className="h-5 w-5 mr-2" />
                Kërko
              </button>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <input
                  id="all"
                  type="radio"
                  name="listingType"
                  value="all"
                  checked={listingType === 'all'}
                  onChange={() => setListingType('all')}
                  className={`h-4 w-4 text-blue-600 focus:ring-blue-500 ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}
                />
                <label htmlFor="all" className={`ml-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Të gjitha
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="sale"
                  type="radio"
                  name="listingType"
                  value="sale"
                  checked={listingType === 'sale'}
                  onChange={() => setListingType('sale')}
                  className={`h-4 w-4 text-blue-600 focus:ring-blue-500 ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}
                />
                <label htmlFor="sale" className={`ml-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Në shitje
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="rent"
                  type="radio"
                  name="listingType"
                  value="rent"
                  checked={listingType === 'rent'}
                  onChange={() => setListingType('rent')}
                  className={`h-4 w-4 text-blue-600 focus:ring-blue-500 ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}
                />
                <label htmlFor="rent" className={`ml-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Me qira
                </label>
              </div>
            </div>
          </div>
        </form>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Shpalljet e patundshmërive</h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{filteredProperties.length} prona të gjetura</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`flex items-center border ${darkMode ? 'border-gray-700' : 'border-gray-300'} rounded-lg overflow-hidden`}>
              <select 
                className={`px-2 py-2 focus:outline-none text-sm ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'price_low' | 'price_high')}
              >
                <option value="newest">Të rejat e para</option>
                <option value="price_low">Çmimi: I ulët - I lartë</option>
                <option value="price_high">Çmimi: I lartë - I ulët</option>
              </select>
            </div>
            
            <div className={`flex border ${darkMode ? 'border-gray-700' : 'border-gray-300'} rounded-lg`}>
              <button 
                className={`p-2 ${viewMode === 'grid' 
                  ? darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-600' 
                  : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-500'}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button 
                className={`p-2 ${viewMode === 'list' 
                  ? darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-600' 
                  : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-500'}`}
                onClick={() => setViewMode('list')}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className={`text-center py-12 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Provo përsëri
            </button>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Building className={`h-12 w-12 ${darkMode ? 'text-gray-400' : 'text-gray-400'} mx-auto mb-4`} />
            <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nuk u gjet asnjë pronë</h3>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Provoni të ndryshoni filtrat tuaj të kërkimit për të gjetur prona</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProperties.map((property) => (
              <div key={property.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden ${property.featured ? 'ring-2 ring-blue-500' : ''}`}>
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 relative">
                    <img 
                      src={property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'} 
                      alt={property.title} 
                      className="w-full h-48 md:h-full object-cover"
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
                  <div className="md:w-2/3 p-4">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{property.title}</h3>
                      <p className="text-blue-600 font-bold flex items-center">
                        <Euro className="h-4 w-4 mr-1" />
                        {property.price.toLocaleString()}
                        {property.listing_type === 'rent' ? '/muaj' : ''}
                      </p>
                    </div>
                    <div className="flex items-center mt-1 text-gray-500 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{property.location}</span>
                    </div>
                    <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{property.description}</p>
                    
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      {property.rooms && (
                        <div className={`flex items-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className="font-medium">{property.rooms} dhoma</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className={`flex items-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className="font-medium">{property.bathrooms} banjo</span>
                        </div>
                      )}
                      {property.area && (
                        <div className={`flex items-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className="font-medium">{property.area} m²</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <a href={`/property/${property.id}`} className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium inline-block">
                        Shiko detajet
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ListingsPage;