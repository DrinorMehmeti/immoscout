import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import AddPropertyForm from '../components/AddPropertyForm';
import { Property } from '../types';

const EditPropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { authState } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notAuthorized, setNotAuthorized] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id || !authState.user) return;
      
      try {
        setLoading(true);
        
        // Fetch the property data
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          throw error;
        }
        
        // Check if the user is the owner of the property
        if (data.owner_id !== authState.user.id) {
          setNotAuthorized(true);
          return;
        }
        
        setProperty(data);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Ndodhi një gabim gjatë marrjes së të dhënave të pronës');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [id, authState.user]);

  const handleEditSuccess = () => {
    // Navigate to the property detail page or my properties page
    navigate(`/my-properties`);
  };

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <main className="flex-grow py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <Building className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">Ju nuk jeni të kyçur</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                Ju duhet të kyçeni ose të regjistroheni për të modifikuar një pronë
              </p>
              <a
                href="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Kyçu tani
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (notAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <main className="flex-grow py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <Building className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">Qasje e paautorizuar</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                Ju nuk keni të drejta për të modifikuar këtë pronë
              </p>
              <a
                href="/my-properties"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Kthehu te pronat e mia
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <main className="flex-grow py-12 pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => navigate('/my-properties')}
              className={`flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kthehu te pronat e mia
            </button>
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Modifiko pronën</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Përditëso informatat për pronën tuaj</p>
          </div>
          
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-600 dark:text-blue-400" />
              <p className="text-gray-600 dark:text-gray-400">Duke ngarkuar të dhënat e pronës...</p>
            </div>
          ) : error ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button 
                onClick={() => navigate('/my-properties')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Kthehu te pronat e mia
              </button>
            </div>
          ) : property ? (
            <AddPropertyForm 
              existingProperty={property}
              onSuccess={handleEditSuccess}
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">Prona nuk u gjet</p>
              <button 
                onClick={() => navigate('/my-properties')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Kthehu te pronat e mia
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditPropertyPage;