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
  const [viewerCount, setViewerCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Generate or get existing session ID from localStorage
    let sessionId = localStorage.getItem('property_viewer_session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('property_viewer_session_id', sessionId);
    }
    
    // Function to register this viewer and get count
    const registerAndGetCount = async () => {
      try {
        // Try to register this viewer
        try {
          await supabase.rpc('register_property_viewer', {
            p_property_id: propertyId,
            p_session_id: sessionId
          });
        } catch (err) {
          console.error('Error registering as viewer:', err);
          // Continue anyway to get the count
        }
        
        // Get the current viewer count
        const { data, error } = await supabase.rpc('count_current_viewers', {
          p_property_id: propertyId
        });
        
        if (error) throw error;
        
        // Update state with viewer count
        setViewerCount(data || 0);
        setError(null);
      } catch (err) {
        console.error('Error fetching viewer count:', err);
        setError('Could not get current viewer count');
        setViewerCount(null);
      }
    };
    
    // Register and get count immediately
    registerAndGetCount();
    
    // Set up interval to refresh count and keep session active
    const intervalId = setInterval(registerAndGetCount, 30000); // Every 30 seconds
    
    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [propertyId]);
  
  // Don't show anything while loading or if there's an error or no viewers
  if (error || viewerCount === null || viewerCount === 0) {
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