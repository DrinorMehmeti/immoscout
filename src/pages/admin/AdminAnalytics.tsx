import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../layouts/AdminLayout';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building, 
  Eye, 
  Heart, 
  Calendar, 
  ArrowUpRight,
  MapPin,
  Euro,
  Clock
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface AnalyticsData {
  totalUsers: number;
  totalProperties: number;
  totalViews: number;
  totalFavorites: number;
  newUsersThisMonth: number;
  newPropertiesThisMonth: number;
  viewsThisMonth: number;
  favoritesThisMonth: number;
}

interface PropertyTypeData {
  type: string;
  count: number;
}

interface LocationData {
  location: string;
  count: number;
}

interface PriceRangeData {
  range: string;
  count: number;
}

interface MonthlyData {
  month: string;
  users: number;
  properties: number;
  views: number;
}

const AdminAnalytics: React.FC = () => {
  const { darkMode } = useTheme();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 0,
    totalProperties: 0,
    totalViews: 0,
    totalFavorites: 0,
    newUsersThisMonth: 0,
    newPropertiesThisMonth: 0,
    viewsThisMonth: 0,
    favoritesThisMonth: 0
  });
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeData[]>([]);
  const [topLocations, setTopLocations] = useState<LocationData[]>([]);
  const [priceRanges, setPriceRanges] = useState<PriceRangeData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'30days' | '90days' | '6months' | '1year'>('30days');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Get date range based on selected time range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '30days':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '6months':
          startDate.setMonth(endDate.getMonth() - 6);
          break;
        case '1year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }
      
      // Format dates for database queries
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();
      
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      // Get new users this month
      const { count: newUsersThisMonth } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDateStr);
      
      // Get total properties
      const { count: totalProperties } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });
      
      // Get new properties this month
      const { count: newPropertiesThisMonth } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDateStr);
      
      // Get total views
      const { count: totalViews } = await supabase
        .from('property_views')
        .select('*', { count: 'exact', head: true });
      
      // Get views this month
      const { count: viewsThisMonth } = await supabase
        .from('property_views')
        .select('*', { count: 'exact', head: true })
        .gte('viewed_at', startDateStr);
      
      // Get total favorites
      const { count: totalFavorites } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true });
      
      // Get favorites this month
      const { count: favoritesThisMonth } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDateStr);
      
      // Set analytics data
      setAnalyticsData({
        totalUsers: totalUsers || 0,
        totalProperties: totalProperties || 0,
        totalViews: totalViews || 0,
        totalFavorites: totalFavorites || 0,
        newUsersThisMonth: newUsersThisMonth || 0,
        newPropertiesThisMonth: newPropertiesThisMonth || 0,
        viewsThisMonth: viewsThisMonth || 0,
        favoritesThisMonth: favoritesThisMonth || 0
      });
      
      // Get property types distribution
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('type');
      
      if (propertiesData) {
        const typeCount: Record<string, number> = {};
        propertiesData.forEach(item => {
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
      
      // Get top locations
      const { data: locationsData } = await supabase
        .from('properties')
        .select('location');
      
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
      
      // Get price ranges
      const { data: pricesData } = await supabase
        .from('properties')
        .select('price, listing_type');
      
      if (pricesData) {
        const priceRangesCount: Record<string, number> = {
          'Under €50k': 0,
          '€50k - €100k': 0,
          '€100k - €200k': 0,
          '€200k - €500k': 0,
          'Over €500k': 0,
          'Under €500/month': 0,
          '€500 - €1000/month': 0,
          'Over €1000/month': 0
        };
        
        pricesData.forEach(item => {
          const price = item.price;
          const isRent = item.listing_type === 'rent';
          
          if (isRent) {
            if (price < 500) priceRangesCount['Under €500/month']++;
            else if (price >= 500 && price < 1000) priceRangesCount['€500 - €1000/month']++;
            else priceRangesCount['Over €1000/month']++;
          } else {
            if (price < 50000) priceRangesCount['Under €50k']++;
            else if (price >= 50000 && price < 100000) priceRangesCount['€50k - €100k']++;
            else if (price >= 100000 && price < 200000) priceRangesCount['€100k - €200k']++;
            else if (price >= 200000 && price < 500000) priceRangesCount['€200k - €500k']++;
            else priceRangesCount['Over €500k']++;
          }
        });
        
        const priceRangeArray = Object.entries(priceRangesCount)
          .map(([range, count]) => ({ range, count }))
          .filter(item => item.count > 0);
        
        setPriceRanges(priceRangeArray);
      }
      
      // Generate monthly data for charts
      // For simplicity, we'll generate mock data here
      // In a real application, you would query the database for this data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      
      const mockMonthlyData = Array.from({ length: 6 }, (_, i) => {
        const monthIndex = (currentMonth - 5 + i + 12) % 12; // Get the last 6 months
        return {
          month: months[monthIndex],
          users: Math.floor(Math.random() * 50) + 10,
          properties: Math.floor(Math.random() * 30) + 5,
          views: Math.floor(Math.random() * 500) + 100
        };
      });
      
      setMonthlyData(mockMonthlyData);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
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

  // Calculate percentage change
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Get the highest value in monthly data for chart scaling
  const getMaxValue = () => {
    let max = 0;
    monthlyData.forEach(data => {
      if (data.users > max) max = data.users;
      if (data.properties > max) max = data.properties;
      if (data.views / 10 > max) max = data.views / 10; // Scale down views for better visualization
    });
    return max;
  };

  const maxValue = getMaxValue();

  return (
    <AdminLayout>
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analiza dhe Statistika</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Pasqyrë e detajuar e performancës së platformës
        </p>
      </div>

      {/* Time range selector */}
      <div className="px-4 sm:px-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTimeRange('30days')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                timeRange === '30days'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              30 ditët e fundit
            </button>
            <button
              onClick={() => setTimeRange('90days')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                timeRange === '90days'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              90 ditët e fundit
            </button>
            <button
              onClick={() => setTimeRange('6months')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                timeRange === '6months'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              6 muajt e fundit
            </button>
            <button
              onClick={() => setTimeRange('1year')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                timeRange === '1year'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Viti i fundit
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Key metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 px-4 sm:px-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-4">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Përdorues</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.totalUsers}</p>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs font-medium ${
                      analyticsData.newUsersThisMonth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {analyticsData.newUsersThisMonth > 0 ? '+' : ''}{analyticsData.newUsersThisMonth}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      në {timeRange === '30days' ? '30 ditë' : timeRange === '90days' ? '90 ditë' : timeRange === '6months' ? '6 muaj' : '1 vit'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mr-4">
                  <Building className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Prona</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.totalProperties}</p>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs font-medium ${
                      analyticsData.newPropertiesThisMonth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {analyticsData.newPropertiesThisMonth > 0 ? '+' : ''}{analyticsData.newPropertiesThisMonth}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      në {timeRange === '30days' ? '30 ditë' : timeRange === '90days' ? '90 ditë' : timeRange === '6months' ? '6 muaj' : '1 vit'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 mr-4">
                  <Eye className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Shikime</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.totalViews}</p>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs font-medium ${
                      analyticsData.viewsThisMonth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {analyticsData.viewsThisMonth > 0 ? '+' : ''}{analyticsData.viewsThisMonth}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      në {timeRange === '30days' ? '30 ditë' : timeRange === '90days' ? '90 ditë' : timeRange === '6months' ? '6 muaj' : '1 vit'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 mr-4">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Favorite</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.totalFavorites}</p>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs font-medium ${
                      analyticsData.favoritesThisMonth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {analyticsData.favoritesThisMonth > 0 ? '+' : ''}{analyticsData.favoritesThisMonth}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      në {timeRange === '30days' ? '30 ditë' : timeRange === '90days' ? '90 ditë' : timeRange === '6months' ? '6 muaj' : '1 vit'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and detailed analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 px-4 sm:px-6">
            {/* Monthly trend chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trendi mujor</h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="h-3 w-3 bg-blue-500 rounded-full mr-1"></span>
                  <span className="mr-4">Përdorues</span>
                  <span className="h-3 w-3 bg-green-500 rounded-full mr-1"></span>
                  <span className="mr-4">Prona</span>
                  <span className="h-3 w-3 bg-purple-500 rounded-full mr-1"></span>
                  <span>Shikime (÷10)</span>
                </div>
              </div>
              
              <div className="h-64 relative">
                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="text-center" style={{ width: `${100 / monthlyData.length}%` }}>
                      {data.month}
                    </div>
                  ))}
                </div>
                
                {/* Y-axis grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pb-6">
                  {[0, 1, 2, 3, 4].map((_, index) => (
                    <div 
                      key={index} 
                      className="w-full h-px bg-gray-200 dark:bg-gray-700"
                      style={{ bottom: `${(index / 4) * 100}%` }}
                    ></div>
                  ))}
                </div>
                
                {/* Chart bars */}
                <div className="absolute inset-0 flex justify-between pb-6 pt-6">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="flex items-end justify-center space-x-1" style={{ width: `${100 / monthlyData.length}%` }}>
                      <div 
                        className="w-3 bg-blue-500 rounded-t"
                        style={{ height: `${(data.users / maxValue) * 100}%` }}
                      ></div>
                      <div 
                        className="w-3 bg-green-500 rounded-t"
                        style={{ height: `${(data.properties / maxValue) * 100}%` }}
                      ></div>
                      <div 
                        className="w-3 bg-purple-500 rounded-t"
                        style={{ height: `${(data.views / 10 / maxValue) * 100}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Property types distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Llojet e pronave</h3>
              <div className="space-y-4">
                {propertyTypes.map((type) => (
                  <div key={type.type} className="flex items-center">
                    <div className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {formatPropertyType(type.type)}
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="relative h-4 overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
                        <div 
                          className={`absolute h-4 rounded ${
                            type.type === 'apartment' ? 'bg-blue-500' :
                            type.type === 'house' ? 'bg-green-500' :
                            type.type === 'land' ? 'bg-yellow-500' :
                            'bg-purple-500'
                          }`} 
                          style={{ width: `${(type.count / analyticsData.totalProperties) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-16 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                      {type.count}
                    </div>
                    <div className="w-16 text-right text-xs text-gray-500 dark:text-gray-400">
                      {Math.round((type.count / analyticsData.totalProperties) * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Additional analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 px-4 sm:px-6">
            {/* Top locations */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Lokacionet më të kërkuara</h3>
              <div className="space-y-4">
                {topLocations.map((location, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-8 text-center">
                      <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        index === 1 ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                        index === 2 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                    <div className="ml-3 flex items-center w-32 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      {location.location}
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="relative h-4 overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
                        <div 
                          className="absolute h-4 rounded bg-blue-500" 
                          style={{ width: `${(location.count / topLocations[0].count) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-16 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                      {location.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price ranges */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Shpërndarja e çmimeve</h3>
              <div className="space-y-4">
                {priceRanges.map((range, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-40 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <Euro className="h-4 w-4 mr-1 text-gray-400" />
                      {range.range}
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="relative h-4 overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
                        <div 
                          className="absolute h-4 rounded bg-green-500" 
                          style={{ width: `${(range.count / Math.max(...priceRanges.map(r => r.count))) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-16 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                      {range.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Performance metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 px-4 sm:px-6">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Metrikat e performancës</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Statistika të detajuara për periudhën e zgjedhur
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Koha mesatare e shitjes</div>
                    <Clock className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">32 ditë</div>
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                    5% më shpejt se periudha e mëparshme
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Çmimi mesatar i shitjes</div>
                    <Euro className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">€125,000</div>
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                    3.5% rritje nga periudha e mëparshme
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Shikime për pronë</div>
                    <Eye className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analyticsData.totalProperties > 0 
                      ? Math.round(analyticsData.totalViews / analyticsData.totalProperties) 
                      : 0}
                  </div>
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                    12% rritje nga periudha e mëparshme
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Konvertimi në favorite</div>
                    <Heart className="h-5 w-5 text-pink-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analyticsData.totalViews > 0 
                      ? `${Math.round((analyticsData.totalFavorites / analyticsData.totalViews) * 100)}%` 
                      : '0%'}
                  </div>
                  <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                    1.2% ulje nga periudha e mëparshme
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 px-4 sm:px-6">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Aktiviteti i fundit</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Veprimet e fundit në platformë
                </p>
              </div>
              <Link 
                to="/admin/properties" 
                className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center"
              >
                Shiko të gjitha
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flow-root">
                <ul className="-mb-8">
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                            <Users className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              <span className="font-medium text-gray-900 dark:text-white">Arben Krasniqi</span> u regjistrua në platformë
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                            <time dateTime="2023-01-23T13:23Z">23 min më parë</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                            <Building className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              <span className="font-medium text-gray-900 dark:text-white">Banesë në qendër të Prishtinës</span> u shtua nga <span className="font-medium text-gray-900 dark:text-white">Blerim Gashi</span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                            <time dateTime="2023-01-23T10:32Z">1 orë më parë</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                            <Eye className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              <span className="font-medium text-gray-900 dark:text-white">Shtëpi në Prizren</span> ka arritur 100 shikime
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                            <time dateTime="2023-01-23T09:12Z">3 orë më parë</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="relative pb-8">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                            <Heart className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              <span className="font-medium text-gray-900 dark:text-white">Lokal në Pejë</span> u shtua në favorite nga 5 përdorues
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                            <time dateTime="2023-01-23T08:45Z">5 orë më parë</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminAnalytics;