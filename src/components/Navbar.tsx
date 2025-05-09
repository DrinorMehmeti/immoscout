import React, { useState, useEffect } from 'react';
import { Menu, X, User, Home, LogOut, Building, Plus, Search, Star, Lightbulb, BookOpen, Briefcase, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { authState, logout } = useAuth();
  const location = useLocation();
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle dark mode (you would need to implement actual dark mode functionality)
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Implement actual dark mode toggle functionality here
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-md' 
          : 'bg-white shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg mr-2 transform group-hover:scale-105 transition-all duration-200">
                  <Home className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                  RealEstate Kosovo
                </span>
              </Link>
            </div>
            
            <div className="hidden sm:ml-8 md:flex md:space-x-1">
              <NavLink to="/" isActive={isActive('/')}>
                Ballina
              </NavLink>
              
              <NavLink to="/listings" isActive={isActive('/listings')}>
                Shpallje
              </NavLink>
              
              <NavLink to="/premium" isActive={isActive('/premium')}>
                Premium
                <Star className="ml-1 h-4 w-4" />
              </NavLink>
              
              <NavLink to="/si-funksionon" isActive={isActive('/si-funksionon')}>
                Si funksionon
                <Lightbulb className="ml-1 h-4 w-4" />
              </NavLink>
              
              <NavLink to="/blog" isActive={isActive('/blog')}>
                Blog
                <BookOpen className="ml-1 h-4 w-4" />
              </NavLink>
              
              <NavLink to="/agjencite" isActive={isActive('/agjencite')}>
                Agjencitë
                <Briefcase className="ml-1 h-4 w-4" />
              </NavLink>
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Dark mode toggle button */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            
            {/* Search button */}
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all">
              <Search className="h-5 w-5" />
            </button>
            
            {/* Authentication/User actions */}
            {authState.isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50"
                >
                  <Building className="h-5 w-5 mr-1.5" />
                  <span>Paneli im</span>
                </Link>
                
                <Link 
                  to="/add-property" 
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  <span>Shto pronë</span>
                </Link>
                
                <div className="border-l border-gray-200 h-6 mx-2"></div>
                
                <div className="group relative">
                  <button className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-2 ring-2 ring-white">
                      {authState.user?.profile?.name.charAt(0)}
                    </div>
                    <span className="hidden xl:block">
                      {authState.user?.profile?.name.split(' ')[0]}
                    </span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                      Paneli im
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                      Profili im
                    </Link>
                    <Link to="/my-properties" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                      Pronat e mia
                    </Link>
                    <button 
                      onClick={logout}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Dilni
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Kyçu
                </Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow">
                  Regjistrohu
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {authState.isAuthenticated && (
              <Link 
                to="/add-property" 
                className="mr-2 flex items-center bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="h-5 w-5" />
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-md ${
                isMenuOpen ? 'bg-gray-100' : 'text-gray-500 hover:text-gray-600 hover:bg-gray-100'
              } focus:outline-none transition-colors`}
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
      <div className={`md:hidden transition-all duration-300 ${isMenuOpen ? 'max-h-screen' : 'max-h-0 invisible'} overflow-hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-md border-t">
          <MobileNavLink to="/" isActive={isActive('/')}>
            <Home className="mr-3 h-5 w-5" />
            Ballina
          </MobileNavLink>
          
          <MobileNavLink to="/listings" isActive={isActive('/listings')}>
            <Building className="mr-3 h-5 w-5" />
            Shpallje
          </MobileNavLink>
          
          <MobileNavLink to="/premium" isActive={isActive('/premium')}>
            <Star className="mr-3 h-5 w-5" />
            Premium
          </MobileNavLink>
          
          <MobileNavLink to="/si-funksionon" isActive={isActive('/si-funksionon')}>
            <Lightbulb className="mr-3 h-5 w-5" />
            Si funksionon
          </MobileNavLink>
          
          <MobileNavLink to="/blog" isActive={isActive('/blog')}>
            <BookOpen className="mr-3 h-5 w-5" />
            Blog
          </MobileNavLink>
          
          <MobileNavLink to="/agjencite" isActive={isActive('/agjencite')}>
            <Briefcase className="mr-3 h-5 w-5" />
            Agjencitë
          </MobileNavLink>
          
          {authState.isAuthenticated ? (
            <>
              <div className="border-t border-gray-200 my-3"></div>
              
              <MobileNavLink to="/dashboard" isActive={isActive('/dashboard')}>
                <Building className="mr-3 h-5 w-5" />
                Paneli im
              </MobileNavLink>
              
              <MobileNavLink to="/my-properties" isActive={isActive('/my-properties')}>
                <Building className="mr-3 h-5 w-5" />
                Pronat e mia
              </MobileNavLink>
              
              <MobileNavLink to="/profile" isActive={isActive('/profile')}>
                <User className="mr-3 h-5 w-5" />
                Profili im
              </MobileNavLink>
              
              <button
                onClick={logout}
                className="w-full flex items-center px-3 py-2 text-base font-medium rounded-md text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Dilni
              </button>
            </>
          ) : (
            <div className="pt-4 flex flex-col space-y-3">
              <Link 
                to="/login" 
                className="w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Kyçu
              </Link>
              <Link 
                to="/register" 
                className="w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Regjistrohu
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// Desktop navigation link component
interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      {children}
    </Link>
  );
};

// Mobile navigation link component
interface MobileNavLinkProps {
  to: string;
  children: React.ReactNode;
  isActive: boolean;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, children, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;