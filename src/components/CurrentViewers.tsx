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
    
    // Initial fetch of viewer count and register as viewer
    const fetchViewerCount = async () => {
      try {
        setLoading(true);
        
        // Register this user as currently viewing
        await supabase.rpc('register_property_viewer', {
          p_property_id: propertyId,
          p_session_id: sessionId
        });
        
        // Get the current viewer count for this property
        // Using get_property_view_stats instead of count_current_viewers
        const { data, error } = await supabase
          .rpc('get_property_view_stats', {
            p_property_id: propertyId
          });
        
        if (error) {
          throw error;
        }
        
        // Assuming get_property_view_stats returns an object with a current_viewers field
        // If the structure is different, this might need adjustment
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
    
    // Set up interval to refresh and keep session active
    const intervalId = setInterval(fetchViewerCount, 10000); // Every 10 seconds
    
    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [propertyId]);
  
  // Only show if there are more than 1 viewers (more than just the current user)
  if (loading || error || viewerCount <= 1) {
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