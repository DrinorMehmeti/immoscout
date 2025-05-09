import React, { useState } from 'react';
import { Menu, X, User, Home, LogOut, Building, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authState, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <a href="/" className="flex items-center">
                <Home className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">RealEstate Kosovo</span>
              </a>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a href="/" className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Ballina
              </a>
              <a href="/listings.html" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Shpallje
              </a>
              <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Rreth nesh
              </a>
              <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Kontakt
              </a>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {authState.isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <a href="/dashboard.html" className="text-gray-500 hover:text-gray-700 flex items-center">
                  <Building className="h-5 w-5 mr-1" />
                  <span>Paneli im</span>
                </a>
                <a href="/add-property.html" className="text-gray-500 hover:text-gray-700 flex items-center">
                  <Plus className="h-5 w-5 mr-1" />
                  <span>Shto pronë</span>
                </a>
                <div className="h-6 w-px bg-gray-300"></div>
                <span className="text-sm font-medium text-gray-700">Përshëndetje, {authState.user?.name}</span>
                <button 
                  onClick={logout}
                  className="flex items-center text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span>Dilni</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <a href="#login" className="text-gray-500 hover:text-gray-700 flex items-center">
                  <User className="h-5 w-5 mr-1" />
                  <span>Kyçu</span>
                </a>
                <a href="#register" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">
                  Regjistrohu
                </a>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <a href="/" className="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              Ballina
            </a>
            <a href="/listings.html" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              Shpallje
            </a>
            <a href="#" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              Rreth nesh
            </a>
            <a href="#" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              Kontakt
            </a>
            {authState.isAuthenticated && (
              <>
                <a href="/dashboard.html" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                  Paneli im
                </a>
                <a href="/add-property.html" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                  Shto pronë
                </a>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {authState.isAuthenticated ? (
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-medium">{authState.user?.name.charAt(0)}</span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{authState.user?.name}</div>
                  <div className="text-sm font-medium text-gray-500">{authState.user?.email}</div>
                </div>
                <button
                  onClick={logout}
                  className="ml-auto flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">Dilni</span>
                  <LogOut className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 px-4">
                <a href="#login" className="text-base font-medium text-gray-500 hover:text-gray-700 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  <span>Kyçu</span>
                </a>
                <a href="#register" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium text-center">
                  Regjistrohu
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;