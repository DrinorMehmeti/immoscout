import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';

const ResetPasswordPage: React.FC = () => {
  const { darkMode } = useTheme();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract token from URL if present
  useEffect(() => {
    // The URL will have parameters set by Supabase during the password reset flow
    // Check if there's an access_token parameter
    const hashParams = new URLSearchParams(location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    
    if (accessToken) {
      // Set the session using the access token
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: '',
      });
    }
  }, [location]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (newPassword !== confirmPassword) {
      setError('Fjalëkalimet nuk përputhen');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Fjalëkalimi duhet të ketë të paktën 6 karaktere');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        throw error;
      }
      
      setSuccess(true);
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(err instanceof Error ? err.message : 'Ndodhi një gabim gjatë ndryshimit të fjalëkalimit');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col justify-center py-12 sm:px-6 lg:px-8`}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Lock className={`h-12 w-12 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
        <h2 className={`mt-6 text-center text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Rivendosni fjalëkalimin tuaj
        </h2>
        <p className={`mt-2 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Vendosni një fjalëkalim të ri për llogarinë tuaj
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} py-8 px-4 shadow sm:rounded-lg sm:px-10`}>
          {error && (
            <div className={`rounded-md ${darkMode ? 'bg-red-900/30' : 'bg-red-50'} p-4 mb-6`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-400'}`} />
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-red-300' : 'text-red-800'}`}>
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}
          
          {success ? (
            <div className={`rounded-md ${darkMode ? 'bg-green-900/30' : 'bg-green-50'} p-4 mb-4`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <Check className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-400'}`} />
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                    Fjalëkalimi juaj u rivendos me sukses!
                  </h3>
                  <div className={`mt-2 text-sm ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
                    <p>
                      Do të ridrejtoheni automatikisht te faqja e kyçjes.
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="-mx-2 -my-1.5 flex">
                      <Link
                        to="/login"
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          darkMode 
                            ? 'bg-green-900/50 text-green-300 hover:bg-green-900'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        Kyçuni tani
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="new-password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Fjalëkalimi i ri
                </label>
                <div className="mt-1">
                  <input
                    id="new-password"
                    name="new-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="confirm-password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Konfirmoni fjalëkalimin e ri
                </label>
                <div className="mt-1">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      Duke rivendosur fjalëkalimin...
                    </span>
                  ) : (
                    'Rivendos fjalëkalimin'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
        
        {!success && (
          <div className="mt-6 text-center">
            <Link 
              to="/login"
              className={`text-sm font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
            >
              Kthehu te faqja e kyçjes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;