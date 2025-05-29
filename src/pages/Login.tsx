import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  
  const { login, authState } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [authState.isAuthenticated, navigate]);

  // Check for remembered email
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
      setShowPasswordField(true);
    }
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setShowPasswordField(true);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const { success, errorMessage } = await login(email, password);
      
      if (success) {
        // Save email if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        navigate('/dashboard');
      } else {
        setError(errorMessage || 'Identifikimi dështoi. Kontrolloni kredencialet tuaja.');
      }
    } catch (err) {
      setError('Ndodhi një gabim gjatë kyçjes. Ju lutemi provoni përsëri.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center`}>
      <div className="w-full max-w-md px-4 py-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl overflow-hidden`}>
          {/* Header */}
          <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-xl font-semibold text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Kyçuni ose regjjistrohuni
            </h2>
          </div>
          
          <div className="p-6">
            {error && (
              <div className={`mb-6 p-4 rounded-md ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-800'}`}>
                <p>{error}</p>
              </div>
            )}
            
            {!showPasswordField ? (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email ose emri i përdoruesit
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="ju@shembull.com"
                      className={`block w-full pl-10 py-3 ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={`h-4 w-4 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-blue-600'
                        : 'border-gray-300 text-blue-600'
                    } rounded focus:ring-blue-500`}
                  />
                  <label htmlFor="remember-me" className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Më mbaj mend
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Vazhdo
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email ose emri i përdoruesit
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="ju@shembull.com"
                      className={`block w-full pl-10 py-3 ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Fjalëkalimi
                    </label>
                    <Link to="/forgot-password" className={`text-sm font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}>
                      Keni harruar?
                    </Link>
                  </div>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      placeholder="Fjalëkalimi juaj"
                      className={`block w-full pl-10 pr-10 py-3 ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'}`}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={`h-4 w-4 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-blue-600'
                        : 'border-gray-300 text-blue-600'
                    } rounded focus:ring-blue-500`}
                  />
                  <label htmlFor="remember-me" className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Më mbaj mend
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                          <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Duke u kyçur...
                      </>
                    ) : (
                      'Vazhdo'
                    )}
                  </button>
                </div>
              </form>
            )}
            
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>ose</span>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <button
                type="button"
                className={`w-full flex items-center justify-center px-4 py-3 border ${
                  darkMode 
                    ? 'border-gray-700 bg-gray-800 hover:bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-800'
                } rounded-md shadow-sm text-sm font-medium`}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                  </g>
                </svg>
                Vazhdo me Google
              </button>
              <button
                type="button"
                className={`w-full flex items-center justify-center px-4 py-3 border ${
                  darkMode 
                    ? 'border-gray-700 bg-gray-800 hover:bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-800'
                } rounded-md shadow-sm text-sm font-medium`}
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20,10.1c0-0.2,0-0.3,0-0.5c0-2.8-0.9-5.3-2.7-7.1C15.5,0.9,13,0,10.2,0C7.3,0,4.8,0.9,3,2.7 C1.1,4.5,0.2,7,0.2,9.8c0,2.2,0.6,4.1,1.8,5.9c1.2,1.8,2.8,3,4.8,3.7c-0.2-0.5-0.3-1-0.3-1.6c0-0.3,0.1-0.6,0.2-0.9 c0.1-0.3,0.2-0.6,0.4-0.9c-0.2,0-0.4,0-0.5,0c-0.2,0-0.3,0-0.5,0c-1.9,0-3.5-0.7-4.9-2c-1.4-1.3-2-2.9-2-4.9c0-0.4,0-0.8,0.1-1.1 c0.1-0.3,0.2-0.7,0.3-0.9h4.7v9.2h2V8.1h4.7c0.1,0.3,0.2,0.6,0.3,0.9c0.1,0.3,0.1,0.7,0.1,1.1c0,1.3-0.4,2.5-1.1,3.7 c-0.8,1.2-1.7,2-2.9,2.4c0.3,0.2,0.6,0.5,0.9,0.8c0.3,0.4,0.4,0.8,0.4,1.3c0,0.3-0.1,0.7-0.2,1.1C14.1,18.9,15,17.8,16,16.3 c1-1.5,1.6-3.2,1.6-5c0-0.2,0-0.4,0-0.6C17.6,10.5,20,10.4,20,10.1L20,10.1z" />
                </svg>
                Vazhdo me Facebook
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Nuk keni llogari?{' '}
                <Link to="/register" className={`font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}>
                  Regjistrohu tani
                </Link>
              </p>
            </div>
          </div>
          
          {/* Security notice */}
          <div className={`px-6 py-3 text-center text-xs ${darkMode ? 'bg-gray-750 text-gray-400' : 'bg-gray-50 text-gray-500'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-center items-center`}>
            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Kjo lidhje është e sigurt
          </div>
        </div>
        
        {/* Footer/Branding */}
        <div className="mt-8 text-center">
          <div className="flex justify-center items-center">
            <Building className={`h-6 w-6 ${darkMode ? 'text-white' : 'text-blue-600'} mr-2`} />
            <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              RealEstate Kosovo
            </span>
          </div>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Platforma më e madhe e patundshmërive në Kosovë
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;