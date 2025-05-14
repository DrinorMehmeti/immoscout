import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, Plus, Eye, Heart, Calendar, Info, AlertCircle } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import { Property } from '../types';

const Dashboard: React.FC = () => {
  const { authState } = useAuth();
  const { darkMode } = useTheme();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewStats, setViewStats] = useState({ total: 0, thisWeek: 0 });
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isPersonalIdModalOpen, setIsPersonalIdModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserProperties = async () => {
      if (!authState.user) return;
      
      try {
        setLoading(true);
        
        // Fetch user properties
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('owner_id', authState.user.id)
          .order('created_at', { ascending: false })
          .limit(4);
          
        if (error) {
          throw error;
        }
        
        setProperties(data || []);
        
        // Fetch view statistics
        const today = new Date();
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        
        // Get total views
        const { count: totalViews, error: viewsError } = await supabase
          .from('property_views')
          .select('*', { count: 'exact', head: true })
          .in('property_id', data?.map(p => p.id) || []);
          
        if (viewsError) {
          console.error('Error fetching views:', viewsError);
        }
        
        // Get views from last week
        const { count: weeklyViews, error: weeklyViewsError } = await supabase
          .from('property_views')
          .select('*', { count: 'exact', head: true })
          .in('property_id', data?.map(p => p.id) || [])
          .gte('viewed_at', oneWeekAgo.toISOString());
          
        if (weeklyViewsError) {
          console.error('Error fetching weekly views:', weeklyViewsError);
        }
        
        setViewStats({
          total: totalViews || 0,
          thisWeek: weeklyViews || 0
        });
        
        // Fetch favorites count
        const { count: favorites, error: favoritesError } = await supabase
          .from('favorites')
          .select('*', { count: 'exact', head: true })
          .in('property_id', data?.map(p => p.id) || []);
          
        if (favoritesError) {
          console.error('Error fetching favorites:', favoritesError);
        }
        
        setFavoritesCount(favorites || 0);
        
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Ndodhi një gabim gjatë marrjes së të dhënave');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProperties();
  }, [authState.user]);

  return (
    <DashboardLayout>
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-6`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              Mirë se vini, {authState.user?.profile?.name}!
            </h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {authState.user?.profile?.user_type === 'buyer' && 'Kërkoni pronat e preferuara dhe kontaktoni shitësit direkt.'}
              {authState.user?.profile?.user_type === 'seller' && 'Shtoni prona për shitje dhe menaxhoni shpalljet tuaja.'}
              {authState.user?.profile?.user_type === 'renter' && 'Kërkoni pronat me qira dhe kontaktoni pronarët direkt.'}
              {authState.user?.profile?.user_type === 'landlord' && 'Shtoni prona me qira dhe menaxhoni shpalljet tuaja.'}
            </p>
          </div>
          <div>
            <button 
              onClick={() => setIsPersonalIdModalOpen(true)}
              className={`flex items-center px-4 py-2 rounded-md text-sm ${
                darkMode 
                  ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              <Info className="h-4 w-4 mr-2" />
              Shiko ID-në personale
            </button>
          </div>
        </div>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-6`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Përmbledhje e aktivitetit</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'} rounded-lg p-4`}>
            <div className="flex justify-between">
              <p className={`${darkMode ? 'text-blue-300' : 'text-blue-700'} font-medium`}>Pronat aktive</p>
            </div>
            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>{properties.length}</p>
          </div>
          <div className={`${darkMode ? 'bg-green-900/30' : 'bg-green-50'} rounded-lg p-4`}>
            <div className="flex justify-between">
              <p className={`${darkMode ? 'text-green-300' : 'text-green-700'} font-medium`}>Shikime</p>
            </div>
            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>
              {viewStats.total}
              <span className="ml-2 text-sm font-normal text-green-600 dark:text-green-400">
                +{viewStats.thisWeek} këtë javë
              </span>
            </p>
          </div>
          <div className={`${darkMode ? 'bg-purple-900/30' : 'bg-purple-50'} rounded-lg p-4`}>
            <div className="flex justify-between">
              <p className={`${darkMode ? 'text-purple-300' : 'text-purple-700'} font-medium`}>Shpalljet e fav.</p>
            </div>
            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>{favoritesCount}</p>
          </div>
        </div>
      </div>
      
      {properties.length > 0 ? (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Pronat e mia</h2>
            <Link 
              to="/my-properties"
              className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} text-sm font-medium`}
            >
              Shiko të gjitha
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      ) : (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 text-center`}>
          <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Ende nuk keni asnjë pronë</h3>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-6`}>Shtoni pronën tuaj të parë për ta shfaqur në platformën tonë</p>
          <Link 
            to="/add-property" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Shto pronë të re
          </Link>
        </div>
      )}
      
      {/* Personal ID Modal */}
      {isPersonalIdModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsPersonalIdModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 overflow-hidden shadow-xl transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 dark:text-white mb-4">
                ID-ja juaj personale
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
                Kjo është ID-ja juaj unike që mund ta përdorni për identifikim në platformë. Kjo ID është e dukshme vetëm për ju.
              </p>
              
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6 text-center">
                <p className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">
                  {authState.user?.profile?.personal_id || 'ID nuk është në dispozicion'}
                </p>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 text-center">
                  <strong>E rëndësishme:</strong> Mos e ndani këtë ID me askënd! Administratorët e platformës nuk do t'ju kërkojnë kurrë këtë ID përmes email-it apo telefonit.
                </p>
              </div>
              
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                  onClick={() => setIsPersonalIdModalOpen(false)}
                >
                  E kuptova
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;