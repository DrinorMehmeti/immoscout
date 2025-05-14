import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  MapPin, 
  Users, 
  Building,
  Eye,
  Heart,
  Calendar,
  Filter,
  ArrowUpRight,
  Clock,
  Star,
  RefreshCw
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTheme } from '../../context/ThemeContext';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DateRange {
  label: string;
  value: 'last7' | 'last30' | 'thisMonth' | 'allTime';
  start: Date;
  end: Date;
}

// Stats interfaces
interface OverviewStats {
  totalProperties: number;
  activeProperties: number;
  totalUsers: number;
  totalViews: number;
  propertiesThisMonth: number;
  averagePrice: number;
  totalFavorites: number;
  premiumUsers: number;
}

interface PropertyTypeData {
  labels: string[];
  counts: number[];
}

interface UserTypeData {
  labels: string[];
  counts: number[];
}

interface LocationData {
  name: string;
  count: number;
}

interface PropertyPriceData {
  labels: string[];
  data: number[];
}

interface TimeseriesData {
  labels: string[];
  properties: number[];
  users: number[];
  views: number[];
}

const AdminAnalytics: React.FC = () => {
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange['value']>('last30');
  const [overviewStats, setOverviewStats] = useState<OverviewStats>({
    totalProperties: 0,
    activeProperties: 0,
    totalUsers: 0,
    totalViews: 0,
    propertiesThisMonth: 0,
    averagePrice: 0,
    totalFavorites: 0,
    premiumUsers: 0,
  });
  const [propertyTypeData, setPropertyTypeData] = useState<PropertyTypeData>({
    labels: [],
    counts: [],
  });
  const [userTypeData, setUserTypeData] = useState<UserTypeData>({
    labels: [],
    counts: [],
  });
  const [topLocations, setTopLocations] = useState<LocationData[]>([]);
  const [priceRangeData, setPriceRangeData] = useState<PropertyPriceData>({
    labels: [],
    data: [],
  });
  const [timeseriesData, setTimeseriesData] = useState<TimeseriesData>({
    labels: [],
    properties: [],
    users: [],
    views: [],
  });
  const [viewsPerProperty, setViewsPerProperty] = useState<{ top: any[]; average: number }>({
    top: [],
    average: 0,
  });
  
  // Date ranges
  const dateRanges: DateRange[] = [
    {
      label: '7 ditët e fundit',
      value: 'last7',
      start: subDays(new Date(), 7),
      end: new Date()
    },
    {
      label: '30 ditët e fundit',
      value: 'last30',
      start: subDays(new Date(), 30),
      end: new Date()
    },
    {
      label: 'Ky muaj',
      value: 'thisMonth',
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date())
    },
    {
      label: 'Gjithë kohërat',
      value: 'allTime',
      start: new Date(2020, 0, 1),
      end: new Date()
    }
  ];

  const getCurrentDateRange = (): DateRange => {
    return dateRanges.find(range => range.value === selectedRange)!;
  };

  // Refresh all data
  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchAllData();
    setIsRefreshing(false);
  };
  
  // Fetch all data
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      
      const range = getCurrentDateRange();
      
      await Promise.all([
        fetchOverviewStats(),
        fetchPropertyTypeDistribution(),
        fetchUserTypeDistribution(),
        fetchTopLocations(),
        fetchPriceRangeDistribution(),
        fetchTimeseriesData(range.start, range.end),
        fetchTopViewedProperties(),
      ]);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch overview statistics
  const fetchOverviewStats = async () => {
    try {
      // Total properties
      const { count: totalProperties } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });
      
      // Active properties
      const { count: activeProperties } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      
      // Total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      // Total views
      const { count: totalViews } = await supabase
        .from('property_views')
        .select('*', { count: 'exact', head: true });
      
      // Properties this month
      const startOfThisMonth = startOfMonth(new Date()).toISOString();
      const { count: propertiesThisMonth } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfThisMonth);
      
      // Average price
      const { data: priceData } = await supabase
        .from('properties')
        .select('price')
        .eq('status', 'active');
      
      let averagePrice = 0;
      if (priceData && priceData.length > 0) {
        const sum = priceData.reduce((acc, curr) => acc + curr.price, 0);
        averagePrice = Math.round(sum / priceData.length);
      }
      
      // Total favorites
      const { count: totalFavorites } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true });
      
      // Premium users
      const { count: premiumUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_premium', true);
      
      setOverviewStats({
        totalProperties: totalProperties || 0,
        activeProperties: activeProperties || 0,
        totalUsers: totalUsers || 0,
        totalViews: totalViews || 0,
        propertiesThisMonth: propertiesThisMonth || 0,
        averagePrice,
        totalFavorites: totalFavorites || 0,
        premiumUsers: premiumUsers || 0
      });
      
    } catch (error) {
      console.error('Error fetching overview stats:', error);
    }
  };
  
  // Fetch property type distribution
  const fetchPropertyTypeDistribution = async () => {
    try {
      const { data } = await supabase
        .from('properties')
        .select('type');
      
      if (data) {
        const typeCounts: Record<string, number> = {};
        const propertyTypeLabels: Record<string, string> = {
          'apartment': 'Banesë',
          'house': 'Shtëpi',
          'commercial': 'Lokal',
          'land': 'Tokë'
        };
        
        data.forEach(property => {
          const type = property.type || 'unknown';
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });
        
        const labels = Object.keys(typeCounts).map(key => propertyTypeLabels[key] || key);
        const counts = Object.values(typeCounts);
        
        setPropertyTypeData({ labels, counts });
      }
    } catch (error) {
      console.error('Error fetching property types:', error);
    }
  };
  
  // Fetch user type distribution
  const fetchUserTypeDistribution = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('user_type');
      
      if (data) {
        const typeCounts: Record<string, number> = {};
        const userTypeLabels: Record<string, string> = {
          'buyer': 'Blerës',
          'seller': 'Shitës',
          'renter': 'Qiramarrës',
          'landlord': 'Qiradhënës'
        };
        
        data.forEach(profile => {
          const type = profile.user_type || 'unknown';
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });
        
        const labels = Object.keys(typeCounts).map(key => userTypeLabels[key] || key);
        const counts = Object.values(typeCounts);
        
        setUserTypeData({ labels, counts });
      }
    } catch (error) {
      console.error('Error fetching user types:', error);
    }
  };
  
  // Fetch top locations
  const fetchTopLocations = async () => {
    try {
      const { data } = await supabase
        .from('properties')
        .select('location');
      
      if (data) {
        const locationCounts: Record<string, number> = {};
        
        data.forEach(property => {
          if (property.location) {
            locationCounts[property.location] = (locationCounts[property.location] || 0) + 1;
          }
        });
        
        const locations = Object.entries(locationCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
        
        setTopLocations(locations);
      }
    } catch (error) {
      console.error('Error fetching top locations:', error);
    }
  };
  
  // Fetch price range distribution
  const fetchPriceRangeDistribution = async () => {
    try {
      const { data } = await supabase
        .from('properties')
        .select('price, listing_type')
        .eq('status', 'active');
      
      if (data) {
        // Create bins for price ranges
        const priceRanges = [
          { label: '0-50k', min: 0, max: 50000, count: 0 },
          { label: '50k-100k', min: 50000, max: 100000, count: 0 },
          { label: '100k-200k', min: 100000, max: 200000, count: 0 },
          { label: '200k-300k', min: 200000, max: 300000, count: 0 },
          { label: '300k-500k', min: 300000, max: 500000, count: 0 },
          { label: '500k+', min: 500000, max: Infinity, count: 0 }
        ];
        
        // For rental properties, use different bins
        const rentalRanges = [
          { label: '0-300', min: 0, max: 300, count: 0 },
          { label: '300-500', min: 300, max: 500, count: 0 },
          { label: '500-800', min: 500, max: 800, count: 0 },
          { label: '800-1000', min: 800, max: 1000, count: 0 },
          { label: '1000-1500', min: 1000, max: 1500, count: 0 },
          { label: '1500+', min: 1500, max: Infinity, count: 0 }
        ];
        
        // Count properties in each price range
        data.forEach(property => {
          const price = property.price;
          const isRental = property.listing_type === 'rent';
          const ranges = isRental ? rentalRanges : priceRanges;
          
          const range = ranges.find(r => price >= r.min && price < r.max);
          if (range) {
            range.count++;
          }
        });
        
        // Combine sale and rental ranges
        const labels = [...priceRanges.map(r => `€${r.label} (shitje)`), ...rentalRanges.map(r => `€${r.label} (qira)`)];
        const counts = [...priceRanges.map(r => r.count), ...rentalRanges.map(r => r.count)];
        
        setPriceRangeData({ 
          labels,
          data: counts
        });
      }
    } catch (error) {
      console.error('Error fetching price range distribution:', error);
    }
  };
  
  // Fetch timeseries data
  const fetchTimeseriesData = async (startDate: Date, endDate: Date) => {
    try {
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();
      
      // Calculate the days between start and end date
      const dayDiff = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Generate date labels
      const labels: string[] = [];
      const dateFormat = dayDiff <= 30 ? 'dd/MM' : 'MM/yyyy';
      
      for (let i = 0; i < dayDiff; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        labels.push(format(date, dateFormat));
      }
      
      // Fetch properties created over time
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('created_at')
        .gte('created_at', startDateStr)
        .lte('created_at', endDateStr);
      
      // Fetch users created over time
      const { data: usersData } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', startDateStr)
        .lte('created_at', endDateStr);
      
      // Fetch views over time
      const { data: viewsData } = await supabase
        .from('property_views')
        .select('viewed_at')
        .gte('viewed_at', startDateStr)
        .lte('viewed_at', endDateStr);
      
      // Initialize counts for each day
      const propertyCounts = new Array(dayDiff).fill(0);
      const userCounts = new Array(dayDiff).fill(0);
      const viewCounts = new Array(dayDiff).fill(0);
      
      // Process properties data
      if (propertiesData) {
        propertiesData.forEach(property => {
          if (property.created_at) {
            const date = new Date(property.created_at);
            const dayIndex = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            if (dayIndex >= 0 && dayIndex < dayDiff) {
              propertyCounts[dayIndex]++;
            }
          }
        });
      }
      
      // Process users data
      if (usersData) {
        usersData.forEach(user => {
          if (user.created_at) {
            const date = new Date(user.created_at);
            const dayIndex = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            if (dayIndex >= 0 && dayIndex < dayDiff) {
              userCounts[dayIndex]++;
            }
          }
        });
      }
      
      // Process views data
      if (viewsData) {
        viewsData.forEach(view => {
          if (view.viewed_at) {
            const date = new Date(view.viewed_at);
            const dayIndex = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            if (dayIndex >= 0 && dayIndex < dayDiff) {
              viewCounts[dayIndex]++;
            }
          }
        });
      }
      
      setTimeseriesData({
        labels,
        properties: propertyCounts,
        users: userCounts,
        views: viewCounts,
      });
      
    } catch (error) {
      console.error('Error fetching timeseries data:', error);
    }
  };
  
  // Fetch top viewed properties
  const fetchTopViewedProperties = async () => {
    try {
      // Get view counts for each property
      const { data: viewCounts } = await supabase.rpc('get_property_view_counts');
      
      if (!viewCounts) {
        // If the RPC call fails, use a manual query
        const { data: propertyViews } = await supabase
          .from('property_views')
          .select('property_id');
        
        if (propertyViews) {
          // Count views per property
          const viewCountMap = propertyViews.reduce<Record<string, number>>((acc, view) => {
            const propertyId = view.property_id;
            acc[propertyId] = (acc[propertyId] || 0) + 1;
            return acc;
          }, {});
          
          // Convert to array of { property_id, view_count }
          const manualViewCounts = Object.entries(viewCountMap).map(([property_id, view_count]) => ({
            property_id,
            view_count
          }));
          
          // Sort by view count (descending)
          manualViewCounts.sort((a, b) => b.view_count - a.view_count);
          
          // Get top 5 properties
          const top5PropertyIds = manualViewCounts.slice(0, 5).map(item => item.property_id);
          
          // Fetch property details
          const { data: topProperties } = await supabase
            .from('properties')
            .select('id, title, location, price, listing_type, status')
            .in('id', top5PropertyIds);
          
          if (topProperties) {
            // Combine with view counts
            const topPropertiesWithViews = topProperties.map(property => {
              const viewCount = viewCountMap[property.id] || 0;
              return { ...property, view_count: viewCount };
            }).sort((a, b) => b.view_count - a.view_count);
            
            // Get total view count to calculate average
            const totalViews = Object.values(viewCountMap).reduce((sum, count) => sum + count, 0);
            const propertyCount = Object.keys(viewCountMap).length || 1; // Avoid division by zero
            
            setViewsPerProperty({
              top: topPropertiesWithViews,
              average: Math.round(totalViews / propertyCount)
            });
          }
        }
      } else {
        // If the RPC call succeeds, use its result
        // Get the top 5 viewed properties
        const top5 = viewCounts.slice(0, 5);
        
        // Fetch property details for the top 5
        const { data: topProperties } = await supabase
          .from('properties')
          .select('id, title, location, price, listing_type, status')
          .in('id', top5.map(item => item.property_id));
        
        if (topProperties) {
          // Combine with view counts
          const topPropertiesWithViews = topProperties.map(property => {
            const viewItem = top5.find(item => item.property_id === property.id);
            return { ...property, view_count: viewItem?.view_count || 0 };
          }).sort((a, b) => b.view_count - a.view_count);
          
          // Calculate average views per property
          const totalViews = viewCounts.reduce((sum, item) => sum + item.view_count, 0);
          const averageViews = Math.round(totalViews / viewCounts.length);
          
          setViewsPerProperty({
            top: topPropertiesWithViews,
            average: averageViews
          });
        }
      }
    } catch (error) {
      console.error('Error fetching top viewed properties:', error);
      // Set empty data on error
      setViewsPerProperty({
        top: [],
        average: 0
      });
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, []);
  
  // Fetch data when date range changes
  useEffect(() => {
    const range = getCurrentDateRange();
    fetchTimeseriesData(range.start, range.end);
  }, [selectedRange]);
  
  // Chart colors for dark/light mode
  const chartColors = {
    properties: darkMode ? 'rgba(59, 130, 246, 0.8)' : 'rgba(37, 99, 235, 0.8)',
    propertiesBackground: darkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.2)',
    users: darkMode ? 'rgba(16, 185, 129, 0.8)' : 'rgba(5, 150, 105, 0.8)',
    usersBackground: darkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(5, 150, 105, 0.2)',
    views: darkMode ? 'rgba(245, 158, 11, 0.8)' : 'rgba(217, 119, 6, 0.8)',
    viewsBackground: darkMode ? 'rgba(245, 158, 11, 0.2)' : 'rgba(217, 119, 6, 0.2)',
  };
  
  // Common chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: darkMode ? 'rgba(229, 231, 235, 1)' : 'rgba(17, 24, 39, 1)',
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.2)',
        },
        ticks: {
          color: darkMode ? 'rgba(209, 213, 219, 1)' : 'rgba(55, 65, 81, 1)',
        },
      },
      y: {
        grid: {
          color: darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.2)',
        },
        ticks: {
          color: darkMode ? 'rgba(209, 213, 219, 1)' : 'rgba(55, 65, 81, 1)',
        },
        beginAtZero: true
      },
    },
  };
  
  // Prepare time series data for chart
  const timeseriesChartData = {
    labels: timeseriesData.labels,
    datasets: [
      {
        label: 'Prona',
        data: timeseriesData.properties,
        borderColor: chartColors.properties,
        backgroundColor: chartColors.propertiesBackground,
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Përdorues',
        data: timeseriesData.users,
        borderColor: chartColors.users,
        backgroundColor: chartColors.usersBackground,
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Shikime',
        data: timeseriesData.views,
        borderColor: chartColors.views,
        backgroundColor: chartColors.viewsBackground,
        tension: 0.3,
        fill: false,
      },
    ],
  };
  
  // Prepare property type data for chart
  const propertyTypeChartData = {
    labels: propertyTypeData.labels,
    datasets: [
      {
        data: propertyTypeData.counts,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderWidth: 1,
        borderColor: darkMode ? 'rgba(17, 24, 39, 0.8)' : 'white',
      },
    ],
  };
  
  // Prepare user type data for chart
  const userTypeChartData = {
    labels: userTypeData.labels,
    datasets: [
      {
        data: userTypeData.counts,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderWidth: 1,
        borderColor: darkMode ? 'rgba(17, 24, 39, 0.8)' : 'white',
      },
    ],
  };
  
  // Format numbers with thousands separator
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };
  
  return (
    <AdminLayout>
      <div className="px-4 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analiza dhe Raporte</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Statistika dhe informacione për të monitoruar performancën e platformës
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value as DateRange['value'])}
                className={`pl-10 pr-10 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-blue-500 focus:border-blue-500`}
              >
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                darkMode
                  ? 'text-white bg-blue-600 hover:bg-blue-700'
                  : 'text-white bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isRefreshing ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                  Duke përditësuar...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Rifresko të dhënat
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 px-4 sm:px-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-start">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-4">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Prona totale</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(overviewStats.totalProperties)}</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <span className="font-medium">{formatNumber(overviewStats.activeProperties)}</span>
                  <span className="ml-1">aktive</span>
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-start">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Përdorues</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(overviewStats.totalUsers)}</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <span className="font-medium">{formatNumber(overviewStats.premiumUsers)}</span>
                  <span className="ml-1">premium</span>
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-start">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 mr-4">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Shikime totale</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(overviewStats.totalViews)}</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <span className="font-medium">{viewsPerProperty.average}</span>
                  <span className="ml-1">mesatarisht/pronë</span>
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-start">
              <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 mr-4">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Favorite</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(overviewStats.totalFavorites)}</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>këtë muaj</span>
                </p>
              </div>
            </div>
          </div>

          {/* Activity and Trends Charts */}
          <div className="grid grid-cols-1 gap-4 mb-6 px-4 sm:px-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Aktiviteti përdoruesve</h3>
              </div>
              
              <div className="h-80">
                <Line data={timeseriesChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Distribution Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 px-4 sm:px-6">
            {/* Property Type Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Llojet e pronave</h3>
              <div className="h-64">
                <Doughnut 
                  data={propertyTypeChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          color: darkMode ? 'rgba(229, 231, 235, 1)' : 'rgba(17, 24, 39, 1)',
                        },
                      },
                    },
                  }} 
                />
              </div>
            </div>
            
            {/* User Type Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Llojet e përdoruesve</h3>
              <div className="h-64">
                <Pie 
                  data={userTypeChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          color: darkMode ? 'rgba(229, 231, 235, 1)' : 'rgba(17, 24, 39, 1)',
                        },
                      },
                    },
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Top Locations and Most Viewed Properties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 px-4 sm:px-6">
            {/* Top Locations */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top lokacionet</h3>
              </div>
              
              <div className="space-y-4">
                {topLocations.slice(0, 5).map((location, index) => (
                  <div key={location.name} className="flex items-center">
                    <div className="w-8 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                      {index + 1}.
                    </div>
                    <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {location.name}
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="relative h-4 overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
                        <div 
                          className="absolute h-4 rounded bg-blue-600" 
                          style={{ width: `${(location.count / topLocations[0].count) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                      {location.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Most Viewed Properties */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pronat më të shikuara</h3>
              </div>
              
              {viewsPerProperty.top.length > 0 ? (
                <div className="overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Titulli
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Lokacioni
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Çmimi
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Shikime
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {viewsPerProperty.top.map((property) => (
                        <tr key={property.id}>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              <Link to={`/admin/properties/${property.id}`}>
                                {property.title.length > 20 
                                  ? property.title.substring(0, 20) + '...' 
                                  : property.title}
                              </Link>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <MapPin className="h-3 w-3 mr-1" />
                              {property.location}
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {formatNumber(property.price)}€
                              {property.listing_type === 'rent' && 
                                <span className="text-xs text-gray-500 dark:text-gray-400">/muaj</span>
                              }
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                              {property.view_count}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  Nuk ka të dhëna të mjaftueshme për shikime të pronave
                </div>
              )}
            </div>
          </div>
          
          {/* Additional Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 px-4 sm:px-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Prona këtë muaj</h3>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  +{overviewStats.propertiesThisMonth}
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex-1 text-center">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {overviewStats.propertiesThisMonth}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">prona të reja</p>
                </div>
                <div className="flex-1 text-center border-l border-gray-200 dark:border-gray-700">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {((overviewStats.propertiesThisMonth / (overviewStats.totalProperties || 1)) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">rritje</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Çmimi mesatar</h3>
                <span className="flex items-center px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Aktuale
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex-1 text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(overviewStats.averagePrice)}€
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">prona në shitje</p>
                </div>
                <div className="flex-1 text-center border-l border-gray-200 dark:border-gray-700">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(Math.round(overviewStats.averagePrice / 100))}€
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">me qira mesatarisht</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Premium</h3>
                <span className="flex items-center px-2 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                  <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                  VIP
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex-1 text-center">
                  <p className="text-3xl font-bold text-yellow-500">
                    {overviewStats.premiumUsers}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">përdorues premium</p>
                </div>
                <div className="flex-1 text-center border-l border-gray-200 dark:border-gray-700">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {((overviewStats.premiumUsers / (overviewStats.totalUsers || 1)) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">e përdoruesve</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminAnalytics;