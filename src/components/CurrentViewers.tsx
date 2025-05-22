import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface CurrentViewersProps {
  propertyId: string;
}

const CurrentViewers: React.FC<CurrentViewersProps> = ({ propertyId }) => {
  const { darkMode } = useTheme();
  const [viewerCount, setViewerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Generate or get existing session ID from localStorage
    let sessionId = localStorage.getItem('property_viewer_session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('property_viewer_session_id', sessionId);
    }
    
    // Initial fetch of viewer count
    const fetchViewerCount = async () => {
      try {
        setLoading(true);
        
        // Note: We've removed the call to register_property_viewer since it doesn't exist
        
        // Get the current viewer count for this property
        const { data, error } = await supabase
          .rpc('get_property_view_stats', {
            days_param: 30, // Default to 30 days of stats
            property_id_param: propertyId
          });
        
        if (error) {
          throw error;
        }
        
        // Assuming get_property_view_stats returns an object with a current_viewers field
        setViewerCount(data?.current_viewers || 0);
      } catch (err) {
        console.error('Error fetching viewer count:', err);
        setError('Could not get current viewer count');
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch immediately
    fetchViewerCount();
    
    // Set up interval to refresh
    const intervalId = setInterval(fetchViewerCount, 10000); // Every 10 seconds
    
    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [propertyId]);
  
  // Only show if there are viewers
  if (loading || error || viewerCount === 0) {
    return null;
  }
  
  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
      darkMode 
        ? 'bg-red-900/30 text-red-300' 
        : 'bg-red-100 text-red-800'
    } animate-pulse`}>
      <Users className="h-4 w-4 mr-2" />
      <span>{viewerCount} duke shikuar tani</span>
    </div>
  );
};

export default CurrentViewers;