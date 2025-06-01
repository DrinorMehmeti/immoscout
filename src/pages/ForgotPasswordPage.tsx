import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Check, KeyRound, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';

const ForgotPasswordPage: React.FC = () => {
  const { darkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      setIsSuccess(true);
    } catch (err) {
      console.error('Error sending reset email:', err);
      setError(err instanceof Error ? err.message : 'Ndodhi një gabim i papritur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col justify-center py-12 sm:px-6 lg:px-8`}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <KeyRound className={`h-12 w-12 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
        <h2 className={`mt-6 text-center text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Keni harruar fjalëkalimin?
        </h2>
        <p className={`mt-2 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Vendosni email-in tuaj dhe do t'ju dërgojmë një link për rivendosjen e fjalëkalimit
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} py-8 px-4 shadow sm:rounded-lg sm:px-10`}>
          <form className="space-y-6" onSubmit={handleSendResetEmail}>
            {error && (
              <div className={`rounded-md ${darkMode ? 'bg-red-900/30' : 'bg-red-50'} p-4`}>
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
            
            {isSuccess && (
              <div className={`rounded-md ${darkMode ? 'bg-green-900/30' : 'bg-green-50'} p-4`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Check className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-400'}`} />
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                      Kërkesa u dërgua me sukses!
                    </h3>
                    <div className={`mt-2 text-sm ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
                      <p>
                        Ne kemi dërguar një email me udhëzime për rivendosjen e fjalëkalimit. Ju lutemi kontrolloni email-in tuaj.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Adresa e emailit
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`appearance-none block w-full pl-10 px-3 py-2 border ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="ju@shembull.com"
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  (isLoading || isSuccess) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Duke dërguar kërkesën...
                  </span>
                ) : isSuccess ? (
                  <span className="flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    Email-i u dërgua
                  </span>
                ) : (
                  'Dërgo udhëzimet për rivendosje'
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            to="/login"
            className={`flex items-center justify-center text-sm font-medium ${
              darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kthehu te faqja e kyçjes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;