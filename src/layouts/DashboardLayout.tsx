import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Home, Building, Plus, Settings, User, LogOut, Bell, Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import NotificationBell from '../components/NotificationBell';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { authState, logout } = useAuth();
  const { darkMode } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col`}>
      <main className="flex-grow py-6 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className={`w-full md:w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 h-fit`}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-medium">{authState.user?.profile?.name.charAt(0)}</span>
                </div>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{authState.user?.profile?.name}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{authState.user?.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                <Link
                  to="/dashboard"
                  className={`flex items-center py-2 px-3 rounded-md group ${
                    location.pathname === '/dashboard' 
                      ? darkMode ? 'bg-gray-700 text-white' : 'bg-blue-50 text-blue-700' 
                      : darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Home className="h-5 w-5 mr-3" />
                  Paneli kryesor
                </Link>
                <Link
                  to="/my-properties"
                  className={`flex items-center py-2 px-3 rounded-md group ${
                    location.pathname === '/my-properties' 
                      ? darkMode ? 'bg-gray-700 text-white' : 'bg-blue-50 text-blue-700' 
                      : darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Building className={`h-5 w-5 mr-3 ${
                    darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  Pronat e mia
                </Link>
                <Link
                  to="/premium"
                  className={`flex items-center py-2 px-3 rounded-md group ${
                    location.pathname === '/premium' 
                      ? darkMode ? 'bg-gray-700 text-white' : 'bg-blue-50 text-blue-700' 
                      : darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Star className={`h-5 w-5 mr-3 ${
                    darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  Bëhu premium
                </Link>
                <div className={`flex items-center py-2 px-3 rounded-md group ${
                  location.pathname === '/notifications' 
                    ? darkMode ? 'bg-gray-700 text-white' : 'bg-blue-50 text-blue-700' 
                    : darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}>
                  <Bell className={`h-5 w-5 mr-3 ${
                    darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  Njoftime
                </div>
                <Link
                  to="/settings"
                  className={`flex items-center py-2 px-3 rounded-md group ${
                    location.pathname === '/settings' 
                      ? darkMode ? 'bg-gray-700 text-white' : 'bg-blue-50 text-blue-700' 
                      : darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings className={`h-5 w-5 mr-3 ${
                    darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  Cilësimet
                </Link>
                <Link
                  to="/profile"
                  className={`flex items-center py-2 px-3 rounded-md group ${
                    location.pathname === '/profile' 
                      ? darkMode ? 'bg-gray-700 text-white' : 'bg-blue-50 text-blue-700' 
                      : darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className={`h-5 w-5 mr-3 ${
                    darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  Profili im
                </Link>
                <button
                  onClick={logout}
                  className={`flex items-center py-2 px-3 rounded-md group w-full text-left ${
                    darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <LogOut className={`h-5 w-5 mr-3 ${
                    darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  Dilni
                </button>
              </nav>

              {/* Mobile menu toggle (visible on smaller screens) */}
              <div className="md:hidden mt-4">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`w-full flex items-center justify-between p-2 text-sm font-medium rounded ${
                    darkMode 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <span>Menuja</span>
                  <svg 
                    className={`h-5 w-5 transform ${mobileMenuOpen ? 'rotate-180' : ''}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Main content */}
            <div className="flex-1">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;