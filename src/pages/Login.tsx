import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertTriangle, Building, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
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
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center`} 
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1773&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <div className="w-full max-w-md px-4 py-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl overflow-hidden`}>
          {/* Header */}
          <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-2xl font-semibold text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Kyçuni ose regjistrohuni
            </h2>
          </div>
          
          <div className="p-6">
            {error && (
              <div className={`mb-6 p-4 rounded-md ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-800'}`}>
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" aria-hidden="true" />
                  <p>{error}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {password && (
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
              )}
              
              <div className="flex items-center justify-between">
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
              </div>

              <div>
                <button
                  type="submit"
                  className={`w-full flex justify-center py-3 px-4 ${
                    password ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-500 hover:bg-emerald-600'
                  } text-white rounded-md shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    password ? 'focus:ring-blue-500' : 'focus:ring-emerald-500'
                  } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Duke procesuar...
                    </div>
                  ) : (
                    password ? 'Kyçu' : 'Vazhdo'
                  )}
                </button>
              </div>
            </form>
            
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
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM12 2.25C17.385 2.25 21.75 6.615 21.75 12C21.75 17.385 17.385 21.75 12 21.75C6.615 21.75 2.25 17.385 2.25 12C2.25 6.615 6.615 2.25 12 2.25ZM18.75 12.75H12.75V18.75H11.25V12.75H5.25V11.25H11.25V5.25H12.75V11.25H18.75V12.75Z" fill="currentColor"/>
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
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
                Vazhdo me Facebook
              </button>
            </div>
            
            <div className="mt-6 flex items-center justify-center">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Nuk keni llogari?{' '}
                <Link to="/register" className={`font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}>
                  Regjistrohu tani
                </Link>
              </span>
            </div>
          </div>
          
          {/* Security notice */}
          <div className={`px-6 py-3 text-center text-xs ${darkMode ? 'bg-gray-750 text-gray-400' : 'bg-gray-50 text-gray-500'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex justify-center items-center">
              <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Kjo lidhje është e sigurt
            </div>
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