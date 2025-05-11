import React, { useState, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  property_id?: string;
}

const NotificationBell: React.FC = () => {
  const { authState } = useAuth();
  const { darkMode } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch notifications when component mounts or user changes
  useEffect(() => {
    if (!authState.isAuthenticated || !authState.user) return;
    
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', authState.user!.id)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) {
          console.error('Error fetching notifications:', error);
          return;
        }
        
        setNotifications(data || []);
        setUnreadCount(data?.filter(n => !n.is_read).length || 0);
      } catch (err) {
        console.error('Exception fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Subscribe to notification changes
    const subscription = supabase
      .channel('public:notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${authState.user.id}`
      }, payload => {
        // Add new notification to the list
        setNotifications(prev => [payload.new as Notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [authState.isAuthenticated, authState.user]);
  
  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
        
      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }
      
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };
  
  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', authState.user!.id)
        .eq('is_read', false);
        
      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? '' : ''} më parë`;
    } else if (diffHours < 24) {
      return `${diffHours} orë më parë`;
    } else if (diffDays < 7) {
      return `${diffDays} ditë më parë`;
    } else {
      return date.toLocaleDateString('sq-AL');
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'rejection':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'approval':
        return darkMode ? 'bg-green-900/20' : 'bg-green-50';
      case 'rejection':
        return darkMode ? 'bg-red-900/20' : 'bg-red-50';
      default:
        return darkMode ? 'bg-blue-900/20' : 'bg-blue-50';
    }
  };
  
  if (!authState.isAuthenticated) return null;
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span className="sr-only">View notifications</span>
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          ></div>
          
          <div className={`absolute right-0 z-50 mt-2 w-80 sm:w-96 rounded-md shadow-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } ring-1 ring-black ring-opacity-5 overflow-hidden`}>
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Njoftimet</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500"
                >
                  Shënoji të gjitha si të lexuara
                </button>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="py-6 px-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                  <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Duke ngarkuar njoftimet...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-6 px-4 text-center">
                  <Bell className={`h-8 w-8 mx-auto ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <p className={`mt-2 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nuk keni njoftime</p>
                  <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Do t'ju njoftojmë kur të ndodhë diçka e rëndësishme.</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 ${
                        !notification.is_read ? (darkMode ? 'bg-gray-700' : 'bg-blue-50') : ''
                      } hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}
                    >
                      <div className="flex">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full ${getNotificationColor(notification.type)} flex items-center justify-center mr-3`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {notification.title}
                          </p>
                          <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center mt-1 space-x-2">
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {formatDate(notification.created_at)}
                            </p>
                            {notification.property_id && (
                              <Link 
                                to={`/property/${notification.property_id}`} 
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Shiko pronën
                              </Link>
                            )}
                          </div>
                        </div>
                        {!notification.is_read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className={`ml-2 flex-shrink-0 p-1 rounded-full ${
                              darkMode ? 'text-gray-400 hover:bg-gray-600' : 'text-gray-400 hover:bg-gray-200'
                            }`}
                            aria-label="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <a
                href="#"
                className={`block text-center text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                }}
              >
                Shiko të gjitha njoftimet
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;