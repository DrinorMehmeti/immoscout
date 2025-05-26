import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertTriangle, Building, ArrowLeft, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, authState } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [authState.isAuthenticated, navigate]);
  
  // If email saved in localStorage, pre-fill it
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const { success, errorMessage } = await login(email, password);
      
      if (success) {
        // If remember me is checked, save email to localStorage
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        navigate('/dashboard');
      } else {
        setError(errorMessage || 'Identifikimi dështoi. Ju lutemi kontrolloni kredencialet tuaja.');
      }
    } catch (err) {
      setError('Ndodhi një gabim gjatë lidhjes me server. Ju lutemi provoni përsëri.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className={`rounded-xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Header with background */}
            <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-800">
              <div className="absolute inset-0 opacity-20" 
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1773&q=80')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              ></div>
              <div className="absolute top-0 left-0 p-4">
                <Link to="/" className="text-white opacity-80 hover:opacity-100 flex items-center">
                  <ArrowLeft size={20} className="mr-1" />
                  <span>Kthehu në ballina</span>
                </Link>
              </div>
              <div className="absolute -bottom-10 left-0 w-full flex justify-center">
                <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-gray-800">
                  <User size={40} />
                </div>
              </div>
            </div>
            
            {/* Form content */}
            <div className="px-6 pt-16 pb-8">
              <h2 className={`text-2xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                Mirë se vini përsëri!
              </h2>
              <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
                Ju lutemi kyçuni për të vazhduar
              </p>

              {error && (
                <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'} flex items-start`}>
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={`pl-10 block w-full rounded-lg ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-blue-500 focus:border-blue-500 shadow-sm`}
                      placeholder="ju@shembull.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Fjalëkalimi
                    </label>
                    <a 
                      href="#" 
                      className={`text-xs font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      Keni harruar fjalëkalimin?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className={`pl-10 pr-10 block w-full rounded-lg ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-blue-500 focus:border-blue-500 shadow-sm`}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'} focus:outline-none`}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <Eye className="h-5 w-5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className={`h-4 w-4 rounded ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-600 text-blue-600' 
                          : 'border-gray-300 text-blue-600'
                      } focus:ring-blue-500`}
                    />
                    <label htmlFor="remember-me" className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Më mbaj mend
                    </label>
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    } ${darkMode ? 'focus:ring-offset-gray-800' : ''}`}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Duke u kyçur...
                      </div>
                    ) : (
                      'Kyçu'
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Footer */}
            <div className={`px-6 py-4 ${darkMode ? 'bg-gray-750 border-t border-gray-700' : 'bg-gray-50 border-t border-gray-200'}`}>
              <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Nuk keni llogari?{' '}
                <Link 
                  to="/register" 
                  className={`font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                >
                  Regjistrohu tani
                </Link>
              </p>
            </div>
          </div>
          
          {/* App branding */}
          <div className="mt-8 text-center">
            <div className="flex justify-center items-center">
              <Building className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-1`} />
              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                RealEstate Kosovo
              </span>
            </div>
            <p className={`mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              &copy; 2025 Të gjitha të drejtat e rezervuara
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;