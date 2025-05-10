import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../types';
import PropertyGrid from './PropertyGrid';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';

const HomepageProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    async function fetchLatestProperties() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(4);
          
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
    
    fetchLatestProperties();
  }, []);

  return (
    <section className={`py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${darkMode ? 'text-white' : ''}`}>
      <div className="text-center mb-10">
        <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} sm:text-4xl`}>
          Shpalljet e fundit
        </h2>
        <p className={`mt-3 max-w-2xl mx-auto text-xl ${darkMode ? 'text-gray-300' : 'text-gray-500'} sm:mt-4`}>
          Shikoni pronat më të reja të shtuara në platformën tonë
        </p>
      </div>
      
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Të rejat në treg</h3>
          <Link to="/listings" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
            Shiko të gjitha
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className={`text-center py-8 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Provo përsëri
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>Nuk ka prona të shtuara së fundmi</p>
          </div>
        ) : (
          <PropertyGrid properties={properties} />
        )}
      </div>
    </section>
  );
};

export default HomepageProperties;