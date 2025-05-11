import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard,
  Users,
  Building,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  ShieldCheck,
  Star
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { authState, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;
  
  // Check if the user is an admin (for a real app, this would involve checking roles)
  const isAdmin = true; // This should be a real check in production
  
  // If not admin, redirect to home page
  if (!isAdmin) {
    navigate('/');
    return null;
  }

  return (
    <div className={`h-screen flex overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 flex z-40 md:hidden transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 shadow-xl">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Link to="/admin" className="flex items-center">
                <ShieldCheck className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Admin Panel</span>
              </Link>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              <Link
                to="/admin"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive('/admin')
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <LayoutDashboard className="mr-3 h-6 w-6" />
                Dashboard
              </Link>
              
              <Link
                to="/admin/users"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive('/admin/users')
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Users className="mr-3 h-6 w-6" />
                Përdoruesit
              </Link>
              
              <Link
                to="/admin/properties"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive('/admin/properties')
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Building className="mr-3 h-6 w-6" />
                Pronat
              </Link>
              
              <Link
                to="/admin/analytics"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive('/admin/analytics')
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <BarChart3 className="mr-3 h-6 w-6" />
                Analiza
              </Link>
              
              <Link
                to="/admin/premium"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive('/admin/premium')
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Star className="mr-3 h-6 w-6" />
                Premium
              </Link>
              
              <Link
                to="/admin/settings"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive('/admin/settings')
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Settings className="mr-3 h-6 w-6" />
                Settings
              </Link>
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div>
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {authState.user?.profile?.name.charAt(0) || 'A'}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-gray-700 dark:text-gray-200">
                  {authState.user?.profile?.name || 'Admin User'}
                </p>
                <div className="flex items-center">
                  <button
                    onClick={logout}
                    className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-500 flex items-center"
                  >
                    <LogOut className="mr-1 h-3 w-3" />
                    Dilni
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 w-14">
          {/* Force sidebar to shrink to fit close icon */}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Link to="/admin" className="flex items-center">
                  <ShieldCheck className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Admin Panel</span>
                </Link>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                <Link
                  to="/admin"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin')
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <LayoutDashboard className="mr-3 h-6 w-6" />
                  Dashboard
                </Link>
                
                <Link
                  to="/admin/users"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin/users')
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Users className="mr-3 h-6 w-6" />
                  Përdoruesit
                </Link>
                
                <Link
                  to="/admin/properties"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin/properties')
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Building className="mr-3 h-6 w-6" />
                  Pronat
                </Link>
                
                <Link
                  to="/admin/analytics"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin/analytics')
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <BarChart3 className="mr-3 h-6 w-6" />
                  Analiza
                </Link>
                
                <Link
                  to="/admin/premium"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin/premium')
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Star className="mr-3 h-6 w-6" />
                  Premium
                </Link>
                
                <Link
                  to="/admin/settings"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin/settings')
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Settings className="mr-3 h-6 w-6" />
                  Settings
                </Link>
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {authState.user?.profile?.name.charAt(0) || 'A'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {authState.user?.profile?.name || 'Admin User'}
                    </p>
                    <div className="flex items-center">
                      <button
                        onClick={logout}
                        className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-500 flex items-center"
                      >
                        <LogOut className="mr-1 h-3 w-3" />
                        Dilni
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow">
          <button
            className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <div className="text-xl font-semibold text-gray-800 dark:text-white">
                {location.pathname === '/admin' && 'Dashboard'}
                {location.pathname === '/admin/users' && 'Menaxhimi i Përdoruesve'}
                {location.pathname === '/admin/properties' && 'Menaxhimi i Pronave'}
                {location.pathname === '/admin/analytics' && 'Analiza dhe Statistika'}
                {location.pathname === '/admin/premium' && 'Menaxhimi i Premium'}
                {location.pathname === '/admin/settings' && 'Cilësimet e Platformës'}
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {darkMode ? (
                  <Sun className="h-6 w-6" />
                ) : (
                  <Moon className="h-6 w-6" />
                )}
              </button>
              
              {/* Visit site link */}
              <Link
                to="/"
                className="ml-3 bg-blue-100 dark:bg-blue-900 p-1 rounded-full text-blue-600 dark:text-blue-200 hover:text-blue-800 dark:hover:text-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">Visit site</span>
                <BuildingIcon />
              </Link>
              
              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div className="group relative">
                  <button className="max-w-xs bg-white dark:bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full flex items-center justify-center bg-blue-600 text-white">
                      {authState.user?.profile?.name.charAt(0) || 'A'}
                    </div>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                  </button>
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 invisible group-hover:visible">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        Profili juaj
                      </Link>
                      <Link
                        to="/"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        Kthehu në faqe
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        role="menuitem"
                      >
                        Dilni
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Simple building icon component
const BuildingIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

export default AdminLayout;