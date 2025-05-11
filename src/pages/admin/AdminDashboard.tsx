import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  BarChart3, 
  Users, 
  Building, 
  Eye, 
  Heart, 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight, 
  Calendar,
  DollarSign,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalUsers: number;
  totalProperties: number;
  totalViews: number;
  totalFavorites: number;
  premiumUsers: number;
  propertiesThisMonth: number;
  viewsToday: number;
  activeListings: number;
}

interface PropertyType {
  type: string;
  count: number;
}

interface LocationData {
  location: string;
  count: number;
}

const AdminDashboard: React.FC = () => {
  const { authState } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProperties: 0,
    totalViews: 0,
    totalFavorites: 0,
    premiumUsers: 0,
    propertiesThisMonth: 0,
    viewsToday: 0,
    activeListings: 0
  });
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [topLocations, setTopLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentProperties, setRecentProperties] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch total users
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch premium users
        const { count: premiumUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('is_premium', true);

        // Fetch total properties
        const { count: totalProperties } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true });

        // Fetch active listings
        const { count: activeListings } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        // Fetch properties added this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const { count: propertiesThisMonth } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfMonth.toISOString());

        // Fetch total views
        const { count: totalViews } = await supabase
          .from('property_views')
          .select('*', { count: 'exact', head: true });

        // Fetch views today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        
        const { count: viewsToday } = await supabase
          .from('property_views')
          .select('*', { count: 'exact', head: true })
          .gte('viewed_at', startOfDay.toISOString());

        // Fetch total favorites
        const { count: totalFavorites } = await supabase
          .from('favorites')
          .select('*', { count: 'exact', head: true });

        // Fetch property types distribution
        const { data: typesData } = await supabase
          .from('properties')
          .select('type')
          .eq('status', 'active');

        if (typesData) {
          const typeCount: Record<string, number> = {};
          typesData.forEach(item => {
            if (item.type) {
              typeCount[item.type] = (typeCount[item.type] || 0) + 1;
            }
          });
          
          const typeArray = Object.entries(typeCount).map(([type, count]) => ({
            type,
            count
          }));
          
          setPropertyTypes(typeArray);
        }

        // Fetch top locations
        const { data: locationsData } = await supabase
          .from('properties')
          .select('location')
          .eq('status', 'active');

        if (locationsData) {
          const locationCount: Record<string, number> = {};
          locationsData.forEach(item => {
            if (item.location) {
              locationCount[item.location] = (locationCount[item.location] || 0) + 1;
            }
          });
          
          const locationArray = Object.entries(locationCount)
            .map(([location, count]) => ({ location, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
          
          setTopLocations(locationArray);
        }

        // Fetch recent properties
        const { data: recentProps } = await supabase
          .from('properties')
          .select(`
            id,
            title,
            location,
            price,
            created_at,
            status,
            type,
            listing_type,
            profiles(name)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentProps) {
          setRecentProperties(recentProps);
        }

        // Fetch recent users
        const { data: recentUsrs } = await supabase
          .from('profiles')
          .select(`
            id,
            name,
            user_type,
            is_premium,
            created_at
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentUsrs) {
          setRecentUsers(recentUsrs);
        }

        // Update stats
        setStats({
          totalUsers: totalUsers || 0,
          totalProperties: totalProperties || 0,
          totalViews: totalViews || 0,
          totalFavorites: totalFavorites || 0,
          premiumUsers: premiumUsers || 0,
          propertiesThisMonth: propertiesThisMonth || 0,
          viewsToday: viewsToday || 0,
          activeListings: activeListings || 0
        });

      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format property type for display
  const formatPropertyType = (type: string) => {
    const types: Record<string, string> = {
      'apartment': 'Banesë',
      'house': 'Shtëpi',
      'land': 'Tokë',
      'commercial': 'Lokal'
    };
    return types[type] || type;
  };

  // Format listing type for display
  const formatListingType = (type: string) => {
    return type === 'rent' ? 'Me qira' : 'Në shitje';
  };

  // Format status for display with color
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string, label: string }> = {
      'active': { color: 'bg-green-100 text-green-800', label: 'Aktiv' },
      'inactive': { color: 'bg-gray-100 text-gray-800', label: 'Joaktiv' },
      'sold': { color: 'bg-blue-100 text-blue-800', label: 'Shitur' },
      'rented': { color: 'bg-purple-100 text-purple-800', label: 'Dhënë me qira' }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Paneli i Drejtorit</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Pasqyrë e statistikave dhe aktivitetit të platformës
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 px-4 sm:px-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-start">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Përdorues</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <span className="font-medium">{stats.premiumUsers}</span>
                  <span className="ml-1">premium</span>
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-start">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mr-4">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Prona</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProperties}</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <span className="font-medium">{stats.activeListings}</span>
                  <span className="ml-1">aktive</span>
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-start">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 mr-4">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Shikime</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalViews}</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  +<span className="font-medium">{stats.viewsToday}</span>
                  <span className="ml-1">sot</span>
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-start">
              <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 mr-4">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Favorite</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalFavorites}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>të këtij muaji</span>
                </p>
              </div>
            </div>
          </div>

          {/* Second row - Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 px-4 sm:px-6">
            {/* Distribution by property type */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Llojet e pronave</h3>
              <div className="space-y-4">
                {propertyTypes.map((type) => (
                  <div key={type.type} className="flex items-center">
                    <div className="w-16 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {formatPropertyType(type.type)}
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="relative h-4 overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
                        <div 
                          className="absolute h-4 rounded bg-blue-600" 
                          style={{ width: `${(type.count / stats.activeListings) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-10 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                      {type.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top locations */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top lokacionet</h3>
              <div className="space-y-4">
                {topLocations.map((item) => (
                  <div key={item.location} className="flex items-center">
                    <div className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {item.location}
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="relative h-4 overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
                        <div 
                          className="absolute h-4 rounded bg-green-600" 
                          style={{ width: `${(item.count / topLocations[0].count) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-10 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statistikat e shpejta</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Prona këtë muaj</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">{stats.propertiesThisMonth}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="flex items-center">
                    <ShieldCheck className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Abonim. premium</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {Math.round((stats.premiumUsers / stats.totalUsers) * 100)}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Çmimi mesatar</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">125,000€</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Kohëz. mesatar</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">32 ditë</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent properties */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 px-4 sm:px-6">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pronat e fundit</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Pronat e shtuara së fundmi në platformë</p>
              </div>
              <Link 
                to="/admin/properties" 
                className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center"
              >
                Shiko të gjitha
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Titulli
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Pronari
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Lokacioni
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Çmimi
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Lloji
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Statusi
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {recentProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                          {property.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {property.profiles?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {property.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {property.price.toLocaleString()}€
                          {property.listing_type === 'rent' && <span className="text-xs text-gray-500 dark:text-gray-400">/muaj</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatPropertyType(property.type)} ({formatListingType(property.listing_type)})
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(property.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(property.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent users */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-4 sm:px-6">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Përdoruesit e fundit</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Përdoruesit e regjistruar së fundmi</p>
              </div>
              <Link 
                to="/admin/users" 
                className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center"
              >
                Shiko të gjithë
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Emri
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Lloji
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Statusi
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Data e regj.
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                            {user.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {user.user_type === 'buyer' && 'Blerës'}
                          {user.user_type === 'seller' && 'Shitës'}
                          {user.user_type === 'renter' && 'Qiramarrës'}
                          {user.user_type === 'landlord' && 'Qiradhënës'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_premium 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {user.is_premium ? 'Premium' : 'Bazik'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(user.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;