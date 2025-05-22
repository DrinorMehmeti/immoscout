import React, { useState, useEffect } from 'react';
import { Eye, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import { v4 as uuidv4 } from 'uuid';

interface CurrentViewersProps {
  propertyId: string;
}

const CurrentViewers: React.FC<CurrentViewersProps> = ({ propertyId }) => {
  const { darkMode } = useTheme();
  const [viewerCount, setViewerCount] = useState<number>(1); // Start with 1 (self)
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Create or get session ID from localStorage
    let sid = localStorage.getItem('property_viewer_session_id');
    if (!sid) {
      sid = uuidv4();
      localStorage.setItem('property_viewer_session_id', sid);
    }
    setSessionId(sid);
  }, []);

  useEffect(() => {
    if (!propertyId || !sessionId) return;

    // Register the current viewer
    const registerViewer = async () => {
      try {
        await supabase.rpc('register_property_viewer', {
          p_property_id: propertyId,
          p_session_id: sessionId
        });
      } catch (error) {
        console.error('Error registering viewer:', error);
      }
    };

    // Get current viewer count
    const getViewerCount = async () => {
      try {
        const { data, error } = await supabase.rpc('count_current_viewers', {
          p_property_id: propertyId
        });
        
        if (error) throw error;
        setViewerCount(data || 1); // Default to 1 if no data
      } catch (error) {
        console.error('Error getting viewer count:', error);
      }
    };

    // Initial registration and count
    registerViewer();
    getViewerCount();

    // Set up interval to update registration and count
    const registrationInterval = setInterval(registerViewer, 30000); // Every 30 seconds
    const countInterval = setInterval(getViewerCount, 10000); // Every 10 seconds

    // Cleanup on unmount
    return () => {
      clearInterval(registrationInterval);
      clearInterval(countInterval);
    };
  }, [propertyId, sessionId]);

  // Don't show if there's only the current user viewing
  if (viewerCount <= 1) return null;

  return (
    <div className={`flex items-center ${darkMode ? 'text-blue-400' : 'text-blue-600'} text-sm font-medium mt-2`}>
      <Users className="h-4 w-4 mr-1.5" />
      <span>
        {viewerCount} {viewerCount === 1 ? 'person' : 'persona'} duke shikuar tani
      </span>
    </div>
  );
};

export default CurrentViewers;