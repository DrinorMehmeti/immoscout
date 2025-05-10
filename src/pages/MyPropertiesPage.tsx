import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import { Building, Plus } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { supabase } from '../lib/supabase';
import { Property } from '../types';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const MyPropertiesPage: React.FC = () => {
  const { authState } = useAuth();
  const { darkMode } = useTheme();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProperties() {
      if (!authState.user) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('owner_id', authState.user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setProperties(data || []);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Ndodhi një gabim gjatë marrjes së të dhënave');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserProperties();
  }, [authState.user]);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Pronat e mia</h1>
        <Link 
          to="/add-property" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Shto pronë
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 text-center`}>
          <p className={`${darkMode ? 'text-red-400' : 'text-red-600'} mb-4`}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Provo përsëri
          </button>
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 text-center`}>
          <Building className={`h-12 w-12 ${darkMode ? 'text-gray-400' : 'text-gray-400'} mx-auto mb-4`} />
          <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Ende nuk keni asnjë pronë</h3>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-6`}>Shtoni pronën tuaj të parë për ta shfaqur në platformën tonë</p>
          <Link 
            to="/add-property" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Shto pronë të re
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyPropertiesPage;