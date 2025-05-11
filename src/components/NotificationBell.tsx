import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

const NotificationBell: React.FC = () => {
  const { authState } = useAuth();
  const { darkMode } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tableExists, setTableExists] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications when user is authenticated
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      fetchNotifications();
      
      // Set up real-time subscription for new notifications
      // Only set up if the table exists
      if (tableExists) {
        const subscription = supabase
          .channel('public:notifications')
          .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'notifications',
            filter: `user_id=eq.${authState.user.id}`
          }, (payload) => {
            // Add the new notification to the list
            const newNotification = payload.new as Notification;
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
          })
          .subscribe();
          
        return () => {
          subscription.unsubscribe();
        };
      }
    }
  }, [authState.isAuthenticated, authState.user, tableExists]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    if (!authState.user) return;
    
    try {
      setLoading(true);
      
      // Check if the notifications table exists
      const { error: tableCheckError } = await supabase
        .from('notifications')
        .select('id')
        .limit(1);
      
      // If the table doesn't exist yet, handle gracefully
      if (tableCheckError && tableCheckError.message.includes('relation "public.notifications" does not exist')) {
        console.log('Notifications table does not exist yet');
        setTableExists(false);
        setNotifications([]);
        setUnreadCount(0);
        setLoading(false);
        return;
      }
      
      setTableExists(true);
      
      // Fetch notifications
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', authState.user.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }
      
      if (data) {
        setNotifications(data);
        
        // Count unread notifications
        const unread = data.filter(notification => !notification.is_read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Exception fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!tableExists) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
        
      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true } 
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Exception marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    if (!tableExists || notifications.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', authState.user?.id)
        .in('id', notifications.map(n => n.id));
        
      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
    } catch (err) {
      console.error('Exception marking all notifications as read:', err);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return '✅';
      case 'rejection':
        return '❌';
      case 'status_change':
        return '🔄';
      default:
        return '📢';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!authState.isAuthenticated) {
    return null;
  }

  // If the table doesn't exist, just show the button without the notification count
  if (!tableExists) {
    return (
      <button
        className={`relative p-1 rounded-full ${
          darkMode 
            ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-1 rounded-full ${
          darkMode 
            ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
        )}
      </button>
      
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-80 rounded-md shadow-lg ${
          darkMode ? 'bg-gray-800 ring-1 ring-gray-700' : 'bg-white ring-1 ring-black ring-opacity-5'
        } z-50 origin-top-right`}>
          <div className="py-2">
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Njoftimet</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className={`text-xs font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                >
                  Shëno të gjitha si të lexuara
                </button>
              )}
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {loading ? (
                <div className="px-4 py-6 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                  <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Duke ngarkuar njoftimet...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nuk keni njoftime</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id}
                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                    className={`px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                      !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          notification.type === 'approval' 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' 
                            : notification.type === 'rejection'
                              ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                              : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {notification.title}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <a 
                href="#" 
                className={`block text-center text-sm font-medium ${
                  darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                Shiko të gjitha njoftimet
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;