import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../lib/supabase';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, authState } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  // If already authenticated and is admin, redirect to admin dashboard
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authState.isAuthenticated && authState.user && authState.user.id) {
        // Check if the user is an admin
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', authState.user.id)
            .maybeSingle();
            
          if (profileError) throw profileError;
          
          if (profile && profile.is_admin) {
            navigate('/admin');
          } else {
            setError('You do not have admin privileges');
            // Sign out if not an admin
            await supabase.auth.signOut();
          }
        } catch (err) {
          console.error('Error checking admin status:', err);
          setError('Error verifying admin status');
        }
      }
    };

    if (!authState.isLoading) {
      checkAdminStatus();
    }
  }, [authState.isAuthenticated, authState.isLoading, authState.user, navigate]);

  // Validate form input
  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!password) {
      setError('Password is required');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate the form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Attempt to login with the provided credentials
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else {
          setError(`Authentication error: ${authError.message}`);
        }
        setIsLoading(false);
        return;
      }
      
      if (!authData.user) {
        setError('Authentication failed. Please try again.');
        setIsLoading(false);
        return;
      }
      
      // Check if the user is an admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', authData.user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error('Error checking admin status:', profileError);
        setError('Error verifying admin status. Please try again.');
        // Sign out if there was an error checking admin status
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }
      
      if (!profile || !profile.is_admin) {
        setError('You do not have admin privileges. Access denied.');
        // Sign out the user if they're not an admin
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }
      
      // If we get here, the user is an admin, redirect to admin dashboard
      navigate('/admin');
    } catch (err) {
      console.error('Error during admin login:', err);
      setError('An unexpected error occurred. Please try again later.');
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`max-w-md w-full p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center mb-8">
          <div className="mx-auto h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className={`mt-4 text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Admin Login
          </h2>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Enter your credentials to access the admin panel
          </p>
        </div>
        
        {error && (
          <div className={`mb-6 p-4 rounded-md flex items-start ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'}`}>
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                } ${darkMode ? 'focus:ring-offset-gray-800' : ''}`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Return to <a href="/" className="font-medium text-blue-600 hover:text-blue-500">main site</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;