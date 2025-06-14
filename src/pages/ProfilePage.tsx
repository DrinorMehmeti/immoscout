import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import { 
  User, 
  Mail, 
  Calendar, 
  Home, 
  Building, 
  Clock, 
  ShieldCheck, 
  Key,
  Star,
  AlertTriangle,
  Copy,
  Check,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Extended profile stats interface
interface ProfileStats {
  totalProperties: number;
  activeProperties: number;
  pendingProperties: number;
  favoriteCount: number;
  totalViews: number;
  accountAge: number; // in days
}

const ProfilePage: React.FC = () => {
  const { authState } = useAuth();
  const { darkMode } = useTheme();
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    totalProperties: 0,
    activeProperties: 0,
    pendingProperties: 0,
    favoriteCount: 0,
    totalViews: 0,
    accountAge: 0
  });
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  
  useEffect(() => {
    // Calculate account age
    if (authState.user?.profile?.created_at) {
      const createdDate = new Date(authState.user.profile.created_at);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setProfileStats(prev => ({ ...prev, accountAge: diffDays }));
    }
    
    fetchProfileStats();
  }, [authState.user]);
  
  const fetchProfileStats = async () => {
    if (!authState.user) return;
    
    setLoading(true);
    
    try {
      // Fetch total properties
      const { count: totalProps, error: propError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', authState.user.id);
      
      if (propError) throw propError;
      
      // Fetch active properties
      const { count: activeProps, error: activeError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', authState.user.id)
        .eq('status', 'active');
      
      if (activeError) throw activeError;
      
      // Fetch pending properties
      const { count: pendingProps, error: pendingError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', authState.user.id)
        .eq('status', 'pending');
      
      if (pendingError) throw pendingError;
      
      // Fetch favorite count (properties this user has favorited)
      const { count: favorites, error: favError } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', authState.user.id);
      
      if (favError) throw favError;
      
      // Fetch property IDs for this user
      const { data: userProps, error: userPropsError } = await supabase
        .from('properties')
        .select('id')
        .eq('owner_id', authState.user.id);
      
      if (userPropsError) throw userPropsError;
      
      // Get total views for all properties owned by this user
      let totalViews = 0;
      
      if (userProps && userProps.length > 0) {
        const propertyIds = userProps.map(p => p.id);
        
        const { count: viewCount, error: viewsError } = await supabase
          .from('property_views')
          .select('*', { count: 'exact', head: true })
          .in('property_id', propertyIds);
        
        if (viewsError) throw viewsError;
        
        totalViews = viewCount || 0;
      }
      
      // Update stats state
      setProfileStats({
        totalProperties: totalProps || 0,
        activeProperties: activeProps || 0,
        pendingProperties: pendingProps || 0,
        favoriteCount: favorites || 0,
        totalViews,
        accountAge: profileStats.accountAge // Keep existing value
      });
      
    } catch (error) {
      console.error('Error fetching profile stats:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('sq-AL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };
  
  // Translate user type
  const translateUserType = (userType?: string) => {
    switch (userType) {
      case 'buyer': return 'Blerës';
      case 'seller': return 'Shitës';
      case 'renter': return 'Qiramarrës';
      case 'landlord': return 'Qiradhënës';
      default: return userType || 'N/A';
    }
  };
  
  if (!authState.user || !authState.user.profile) {
    return (
      <DashboardLayout>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 text-center`}>
          <AlertTriangle className={`mx-auto h-12 w-12 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
          <h2 className={`mt-4 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Informacioni i profilit nuk është i disponueshëm
          </h2>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            Ju lutemi të kyçeni përsëri për të shikuar profilin tuaj
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Profili im
        </h1>
        
        {/* Profile Header */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-6`}>
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <div className={`h-24 w-24 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center text-white text-4xl font-bold`}>
                {authState.user.profile.name.charAt(0)}
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {authState.user.profile.name}
              </h2>
              
              <div className="flex flex-col sm:flex-row sm:items-center mt-2 gap-2 sm:gap-4">
                <div className="flex items-center">
                  <Mail className={`h-4 w-4 mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {authState.user.email}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Home className={`h-4 w-4 mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {translateUserType(authState.user.profile.user_type)}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className={`h-4 w-4 mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Anëtar që nga {formatDate(authState.user.profile.created_at)}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-3">
                {authState.user.profile.is_premium ? (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    darkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <Star className="h-3 w-3 mr-1" />
                    Premium
                  </span>
                ) : (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                  }`}>
                    Përdorues Bazik
                  </span>
                )}
                
                {authState.user.profile.is_admin && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                  }`}>
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Administrator
                  </span>
                )}
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Link 
                to="/settings" 
                className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                Menaxho profilin
              </Link>
            </div>
          </div>
        </div>
        
        {/* Profile Stats */}
        {authState.user?.profile?.is_premium ? (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-6`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Statistikat e profilit
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>Pronat totale</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{loading ? <Clock className="h-5 w-5 animate-pulse" /> : profileStats.totalProperties}</p>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
                <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Prona aktive</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{loading ? <Clock className="h-5 w-5 animate-pulse" /> : profileStats.activeProperties}</p>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>Prona në pritje</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{loading ? <Clock className="h-5 w-5 animate-pulse" /> : profileStats.pendingProperties}</p>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
                <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>Favorite</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{loading ? <Clock className="h-5 w-5 animate-pulse" /> : profileStats.favoriteCount}</p>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'}`}>
                <p className={`text-sm ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>Totali i shikimeve</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{loading ? <Clock className="h-5 w-5 animate-pulse" /> : profileStats.totalViews}</p>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ditët në platformë</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{profileStats.accountAge}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg shadow-md p-6 mb-6 bg-yellow-50 dark:bg-yellow-900/30 text-center">
            <span className="text-yellow-700 dark:text-yellow-300 text-sm font-medium">Statistikat janë të disponueshme vetëm për përdoruesit Premium.</span>
          </div>
        )}
        
        {/* Personal Information */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-6`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Informacioni personal
          </h2>
          
          <div className="space-y-4">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Emri i plotë</p>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {authState.user.profile.name}
              </p>
            </div>
            
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {authState.user.email}
              </p>
            </div>
            
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Lloji i përdoruesit</p>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {translateUserType(authState.user.profile.user_type)}
              </p>
            </div>
            
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Statusi premium</p>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {authState.user.profile.is_premium ? (
                  <span className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    Premium (deri më {formatDate(authState.user.profile.premium_until)})
                  </span>
                ) : (
                  <span className="flex items-center">
                    <span className={`mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>●</span>
                    Bazik
                    {' '}
                    <Link 
                      to="/premium" 
                      className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      (Bëhu Premium)
                    </Link>
                  </span>
                )}
              </p>
            </div>
            
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                ID Personale
                <span className="relative ml-2 group">
                  <Key className="h-3 w-3 text-blue-500 cursor-pointer" />
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Përdoret për identifikim
                  </span>
                </span>
              </p>
              <p className="flex items-center">
                <span className={`font-mono px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-gray-100 text-blue-700'}`}>
                  {authState.user.profile.personal_id}
                </span>
                <button
                  onClick={() => copyToClipboard(authState.user.profile.personal_id)}
                  className={`ml-2 p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  title="Kopjo ID-në"
                >
                  {copySuccess ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
              </p>
            </div>
            
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Data e regjistrimit</p>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatDate(authState.user.profile.created_at)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Veprime të shpejta
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/my-properties"
              className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'
              } flex flex-col items-center justify-center`}
            >
              <Building className={`h-8 w-8 mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Menaxho pronat e mia
              </span>
            </Link>
            
            <Link
              to="/add-property"
              className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'
              } flex flex-col items-center justify-center`}
            >
              <Building className={`h-8 w-8 mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Shto pronë të re
              </span>
            </Link>
            
            <Link
              to="/premium"
              className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'
              } flex flex-col items-center justify-center`}
            >
              <Star className={`h-8 w-8 mb-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Bëhu premium
              </span>
            </Link>
            
            <Link
              to="/settings"
              className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'
              } flex flex-col items-center justify-center`}
            >
              <ShieldCheck className={`h-8 w-8 mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Ndrysho cilësimet
              </span>
            </Link>
            
            <Link
              to="/notifications"
              className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'
              } flex flex-col items-center justify-center`}
            >
              <Bell className={`h-8 w-8 mb-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
              <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Shiko njoftimet
              </span>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;