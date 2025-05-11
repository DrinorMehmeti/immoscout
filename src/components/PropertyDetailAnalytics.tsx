import React, { useEffect, useState } from 'react';
import { Eye, Star, TrendingUp, Calendar, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';

interface PropertyDetailAnalyticsProps {
  propertyId: string;
  isOwner: boolean;
}

interface AnalyticsData {
  totalViews: number;
  viewsThisWeek: number;
  viewsThisMonth: number;
  totalFavorites: number;
  favoriteRatio: number; // favorites per 100 views
}

const PropertyDetailAnalytics: React.FC<PropertyDetailAnalyticsProps> = ({ propertyId, isOwner }) => {
  const { darkMode } = useTheme();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    viewsThisWeek: 0,
    viewsThisMonth: 0,
    totalFavorites: 0,
    favoriteRatio: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!propertyId || !isOwner) return;
      
      try {
        setLoading(true);
        
        // Get total views
        const { count: totalViews, error: viewsError } = await supabase
          .from('property_views')
          .select('*', { count: 'exact', head: true })
          .eq('property_id', propertyId);
        
        if (viewsError) {
          console.error('Error fetching views:', viewsError);
          return;
        }
        
        // Get views from the last 7 days
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const { count: weeklyViews, error: weeklyError } = await supabase
          .from('property_views')
          .select('*', { count: 'exact', head: true })
          .eq('property_id', propertyId)
          .gte('viewed_at', weekAgo.toISOString());
        
        if (weeklyError) {
          console.error('Error fetching weekly views:', weeklyError);
          return;
        }
        
        // Get views from the last 30 days
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        
        const { count: monthlyViews, error: monthlyError } = await supabase
          .from('property_views')
          .select('*', { count: 'exact', head: true })
          .eq('property_id', propertyId)
          .gte('viewed_at', monthAgo.toISOString());
        
        if (monthlyError) {
          console.error('Error fetching monthly views:', monthlyError);
          return;
        }
        
        // Get total favorites
        const { count: totalFavorites, error: favError } = await supabase
          .from('favorites')
          .select('*', { count: 'exact', head: true })
          .eq('property_id', propertyId);
        
        if (favError) {
          console.error('Error fetching favorites:', favError);
          return;
        }
        
        // Calculate favorite ratio (favorites per 100 views)
        const ratio = totalViews && totalViews > 0 
          ? (totalFavorites || 0) / totalViews * 100 
          : 0;
        
        setAnalytics({
          totalViews: totalViews || 0,
          viewsThisWeek: weeklyViews || 0,
          viewsThisMonth: monthlyViews || 0,
          totalFavorites: totalFavorites || 0,
          favoriteRatio: parseFloat(ratio.toFixed(1))
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [propertyId, isOwner]);
  
  if (!isOwner || loading) return null;
  
  return (
    <div className={`mt-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
        <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
        Statistikat e Pronës
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <div className="flex justify-between items-start">
            <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-blue-700'}`}>{analytics.totalViews}</div>
            <Eye className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Totali i shikimeve</div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
          <div className="flex justify-between items-start">
            <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-green-700'}`}>{analytics.viewsThisWeek}</div>
            <Calendar className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Javën e fundit</div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
          <div className="flex justify-between items-start">
            <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-purple-700'}`}>{analytics.totalFavorites}</div>
            <Star className={`h-5 w-5 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Në favorite</div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
          <div className="flex justify-between items-start">
            <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-yellow-700'}`}>{analytics.favoriteRatio}%</div>
            <Users className={`h-5 w-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Raporti i interesit</div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Statistikat janë përditësuar së fundmi më {new Date().toLocaleString()}
      </div>
    </div>
  );
};

export default PropertyDetailAnalytics;