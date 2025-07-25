import React, { useState } from 'react';
import { Mail, Lock, User, Shield, ArrowLeft, AtSign, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const AdminRegister: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setEmailExists(false);
    
    try {
      // Basic validation
      if (password !== confirmPassword) {
        setError('Fjalëkalimet nuk përputhen');
        setIsLoading(false);
        return;
      }
      
      if (password.length < 6) {
        setError('Fjalëkalimi duhet të ketë të paktën 6 karaktere');
        setIsLoading(false);
        return;
      }
      
      // Register the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (signUpError) {
        // Handle the specific case of already registered user
        if (signUpError.message.includes('already registered') || signUpError.message.includes('user_already_exists')) {
          setEmailExists(true);
          throw new Error('Ky email është tashmë i regjistruar. Ju lutemi kyçuni ose përdorni një email tjetër.');
        }
        throw signUpError;
      }
      
      if (!authData.user) {
        throw new Error('Regjistrimi dështoi');
      }
      
      // Create profile with admin rights - using 'seller' as user_type to satisfy the check constraint
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name,
          user_type: 'seller', // Using a valid user_type from the constraint
          is_premium: false,
          is_admin: true, // Set as admin
          personal_id: `ADMIN-${Math.random().toString(36).substring(2, 8)}`
        });
        
      if (profileError) {
        throw profileError;
      }
      
      // Set success state and automatically redirect after a delay
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/login');
      }, 3000);
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Ndodhi një gabim i papritur gjatë regjistrimit');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className={`w-full max-w-md overflow-hidden rounded-lg ${darkMode ? 'bg-gray-800 shadow-xl shadow-gray-800/50' : 'bg-white shadow-xl'}`}>
          <div className="px-6 py-12">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className={`mt-6 text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Krijo llogari Admin</h2>
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Regjistrohuni për të menaxhuar platformën
              </p>
            </div>
            
            {error && (
              <div className={`mb-6 rounded-md p-4 ${darkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-800'}`}>
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm">{error}</p>
                    {emailExists && (
                      <Link 
                        to="/admin/login" 
                        className={`block mt-2 text-sm font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                      >
                        Shko te faqja e kyçjes
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {success && (
              <div className={`mb-6 rounded-md p-4 ${darkMode ? 'bg-green-900/30 text-green-200' : 'bg-green-50 text-green-800'}`}>
                <p className="text-sm">Regjistrimi u krye me sukses! Do të ridrejtoheni te faqja e kyçjes...</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Emri i plotë
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className={`pl-10 block w-full rounded-md ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } shadow-sm`}
                      placeholder="Emri Mbiemri"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={`pl-10 block w-full rounded-md ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } shadow-sm`}
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Fjalëkalimi
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className={`pl-10 block w-full rounded-md ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } shadow-sm`}
                      placeholder="Minimum 6 karaktere"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Konfirmo fjalëkalimin
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className={`pl-10 block w-full rounded-md ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } shadow-sm`}
                      placeholder="Përsërit fjalëkalimin"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isLoading || success || emailExists}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      (isLoading || success || emailExists) ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Duke u regjistruar...
                      </div>
                    ) : success ? (
                      'Regjistruar me sukses!'
                    ) : (
                      'Krijo llogari'
                    )}
                  </button>
                </div>
              </div>
            </form>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm">
                <button 
                  onClick={toggleDarkMode}
                  className={`font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                >
                  {darkMode ? 'Aktivizo modën e çelët' : 'Aktivizo modën e errët'}
                </button>
              </div>
              <div className="text-sm">
                <Link 
                  to="/admin/login"
                  className={`font-medium flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Kthehu te kyçja
                </Link>
              </div>
            </div>
          </div>
          
          <div className={`px-6 py-4 ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-50 text-gray-600'} text-center text-xs`}>
            <p>© {new Date().getFullYear()} RealEstate Kosovo. Të gjitha të drejtat e rezervuara.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;