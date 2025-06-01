import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { 
  Bell, 
  Check, 
  Loader2, 
  AlertCircle, 
  Clock,
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Building,
  Calendar,
  RefreshCcw,
  Trash2
} from 'lucide-react';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  property_id: string | null;
}

const NotificationsPage: React.FC = () => {
  const { authState } = useAuth();
  const { darkMode } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  
  // State for pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const notificationsPerPage = 20;
  
  // Filter state
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  
  useEffect(() => {
    if (authState.user) {
      fetchNotifications();
    }
  }, [authState.user, page, filter]);
  
  const fetchNotifications = async () => {
    if (!authState.user) return;
    
    try {
      setLoading(true);
      
      // Start building the query
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', authState.user.id)
        .order('created_at', { ascending: false });
      
      // Apply filters
      if (filter === 'unread') {
        query = query.eq('is_read', false);
      } else if (filter === 'read') {
        query = query.eq('is_read', true);
      }
      
      // Apply pagination
      const from = (page - 1) * notificationsPerPage;
      const to = from + notificationsPerPage - 1;
      
      const { data, error, count } = await query
        .range(from, to)
        .limit(notificationsPerPage);
      
      if (error) {
        throw error;
      }
      
      setNotifications(prev => page === 1 ? data || [] : [...prev, ...(data || [])]);
      
      // Check if there are more notifications to load
      if (data && data.length < notificationsPerPage) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Ndodhi një gabim gjatë marrjes së njoftimeve');
    } finally {
      setLoading(false);
    }
  };
  
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      
      if (error) {
        throw error;
      }
      
      // Update the local state to reflect the change
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true } 
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };
  
  const markAllAsRead = async () => {
    if (!authState.user || notifications.length === 0) return;
    
    try {
      setIsMarkingAllRead(true);
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', authState.user.id)
        .eq('is_read', false);
      
      if (error) {
        throw error;
      }
      
      // Update the local state to reflect all notifications as read
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    } finally {
      setIsMarkingAllRead(false);
    }
  };
  
  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      
      if (error) {
        throw error;
      }
      
      // Update the local state to remove the deleted notification
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };
  
  const loadMoreNotifications = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sq-AL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <CheckCircle className="h-6 w-6 text-green-500 dark:text-green-400" />;
      case 'rejection':
        return <XCircle className="h-6 w-6 text-red-500 dark:text-red-400" />;
      case 'message':
        return <MessageSquare className="h-6 w-6 text-blue-500 dark:text-blue-400" />;
      case 'property_view':
        return <Building className="h-6 w-6 text-purple-500 dark:text-purple-400" />;
      case 'status_change':
        return <RefreshCcw className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />;
      case 'reminder':
        return <Calendar className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500 dark:text-gray-400" />;
    }
  };
  
  const getNotificationBgColor = (type: string, isRead: boolean) => {
    if (isRead) {
      return darkMode ? 'bg-gray-800' : 'bg-white';
    }
    
    switch (type) {
      case 'approval':
        return darkMode ? 'bg-green-900/20' : 'bg-green-50';
      case 'rejection':
        return darkMode ? 'bg-red-900/20' : 'bg-red-50';
      case 'message':
        return darkMode ? 'bg-blue-900/20' : 'bg-blue-50';
      case 'status_change':
        return darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50';
      default:
        return darkMode ? 'bg-blue-900/10' : 'bg-blue-50/50';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Njoftimet e mia</h1>
          
          <div className="flex gap-4">
            <div className={`border ${darkMode ? 'border-gray-700' : 'border-gray-300'} rounded-md overflow-hidden`}>
              <select 
                className={`px-3 py-2 ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900'}`}
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value as 'all' | 'unread' | 'read');
                  setPage(1); // Reset pagination when filter changes
                }}
              >
                <option value="all">Të gjitha</option>
                <option value="unread">Të palexuara</option>
                <option value="read">Të lexuara</option>
              </select>
            </div>
            
            <button 
              onClick={markAllAsRead}
              disabled={isMarkingAllRead || notifications.every(n => n.is_read)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isMarkingAllRead || notifications.every(n => n.is_read)
                  ? darkMode 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : darkMode 
                    ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30' 
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              {isMarkingAllRead ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Shëno të gjitha si të lexuara
            </button>
          </div>
        </div>
        
        {/* Loading state */}
        {loading && page === 1 && (
          <div className={`flex justify-center items-center p-12 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
            <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            <span className={`ml-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Duke ngarkuar njoftimet...</span>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className={`p-6 ${darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-600'} rounded-lg shadow-md flex items-start`}>
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        
        {/* Empty state */}
        {!loading && notifications.length === 0 && !error && (
          <div className={`p-12 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md text-center`}>
            <Bell className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`mt-4 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Nuk keni asnjë njoftim
            </h3>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {filter === 'all' 
                ? 'Do të shihni këtu të gjitha njoftimet tuaja' 
                : filter === 'unread' 
                  ? 'Nuk keni njoftime të palexuara' 
                  : 'Nuk keni njoftime të lexuara'}
            </p>
          </div>
        )}
        
        {/* Notifications list */}
        {notifications.length > 0 && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 ${getNotificationBgColor(notification.type, notification.is_read)} relative group
                    ${!notification.is_read ? 'border-l-4 border-blue-500 dark:border-blue-400' : ''}`}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        notification.type === 'approval' 
                          ? 'bg-green-100 dark:bg-green-900/40' 
                          : notification.type === 'rejection'
                            ? 'bg-red-100 dark:bg-red-900/40'
                            : notification.type === 'message'
                              ? 'bg-blue-100 dark:bg-blue-900/40'
                              : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          <p className={`mt-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {notification.message}
                          </p>
                          <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(notification.created_at)}
                            
                            {notification.property_id && (
                              <a 
                                href={`/property/${notification.property_id}`} 
                                className="ml-4 text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                              >
                                <Building className="h-3 w-3 mr-1" />
                                Shiko pronën
                              </a>
                            )}
                          </div>
                        </div>
                        
                        <div className="ml-4 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {!notification.is_read && (
                    <div className="absolute top-4 right-4">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Load more button */}
            {hasMore && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
                <button 
                  onClick={loadMoreNotifications}
                  disabled={loading && page > 1}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    loading && page > 1
                      ? darkMode 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : darkMode 
                        ? 'bg-gray-700 text-white hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {loading && page > 1 ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Duke ngarkuar...
                    </span>
                  ) : (
                    'Ngarko më shumë'
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;