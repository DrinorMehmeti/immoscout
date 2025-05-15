import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  Save, 
  Settings as SettingsIcon, 
  Mail, 
  Globe, 
  UserCog, 
  Bell, 
  Shield, 
  Database, 
  Image as ImageIcon,
  RefreshCw,
  Trash2,
  AlertTriangle,
  Check,
  ChevronRight,
  HelpCircle,
  Info
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Define types for settings
interface SiteSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  footer_text: string;
  max_upload_size: number;
  currency: string;
}

interface NotificationSettings {
  enable_email_notifications: boolean;
  notify_on_new_property: boolean;
  notify_on_user_register: boolean;
  admin_email: string;
}

interface PropertySettings {
  require_approval: boolean;
  max_images_per_property: number;
  allow_premium_features: boolean;
  default_listing_duration: number;
  featured_properties_limit: number;
}

const AdminSettings: React.FC = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'properties' | 'users' | 'system'>('general');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Settings state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    site_name: 'RealEstate Kosovo',
    site_description: 'Platforma më e madhe e patundshmërive në Kosovë',
    contact_email: 'info@realestate-kosovo.com',
    contact_phone: '+383 44 123 456',
    footer_text: '© 2025 RealEstate Kosovo. Të gjitha të drejtat e rezervuara.',
    max_upload_size: 10,
    currency: 'EUR',
  });
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enable_email_notifications: true,
    notify_on_new_property: true,
    notify_on_user_register: false,
    admin_email: 'admin@realestate-kosovo.com',
  });
  
  const [propertySettings, setPropertySettings] = useState<PropertySettings>({
    require_approval: true,
    max_images_per_property: 10,
    allow_premium_features: true,
    default_listing_duration: 30,
    featured_properties_limit: 10,
  });
  
  // System stats
  const [systemStats, setSystemStats] = useState({
    total_users: 0,
    total_properties: 0,
    storage_used: 0,
    database_size: 0,
  });
  
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetConfirmation, setResetConfirmation] = useState('');
  
  // Load settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        
        // In a real app, we would fetch settings from the database
        // For this example, we'll simulate a short delay
        setTimeout(() => {
          // Use the default state values set above
          setLoading(false);
        }, 500);
        
        // Also fetch some system stats
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        const { count: propertyCount } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true });
          
        setSystemStats({
          total_users: userCount || 0,
          total_properties: propertyCount || 0,
          storage_used: Math.floor(Math.random() * 1000), // Simulated MB
          database_size: Math.floor(Math.random() * 50), // Simulated MB
        });
        
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Ndodhi një gabim gjatë marrjes së të dhënave');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  // Handle settings save
  const handleSaveSettings = () => {
    setLoading(true);
    setError(null);
    
    // Simulate saving settings
    setTimeout(() => {
      setLoading(false);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 800);
  };
  
  // Handle maintenance mode toggle
  const toggleMaintenanceMode = () => {
    setIsMaintenanceMode(!isMaintenanceMode);
    // In a real app, this would update a setting in the database
  };
  
  // Handle database reset
  const handleDatabaseReset = () => {
    if (resetConfirmation !== 'RESET') {
      setError('Ju lutemi shkruani "RESET" për të konfirmuar');
      return;
    }
    
    // In a real app, this would be a dangerous operation that would need proper authorization
    setLoading(true);
    
    // Simulate database reset
    setTimeout(() => {
      setLoading(false);
      setIsResetModalOpen(false);
      setResetConfirmation('');
      alert('Database reset would happen here in a real app');
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cilësimet e platformës</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Konfigurimi dhe personalizimi i platformës
        </p>
      </div>
      
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Sidebar navigation */}
          <div className="md:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                    activeTab === 'general'
                      ? darkMode 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : darkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Globe className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span>Të përgjithshme</span>
                  {activeTab === 'general' && <ChevronRight className="ml-auto h-5 w-5" />}
                </button>
                
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                    activeTab === 'notifications'
                      ? darkMode 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                      : darkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Bell className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span>Njoftimet</span>
                  {activeTab === 'notifications' && <ChevronRight className="ml-auto h-5 w-5" />}
                </button>
                
                <button
                  onClick={() => setActiveTab('properties')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                    activeTab === 'properties'
                      ? darkMode 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : darkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ImageIcon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span>Pronat</span>
                  {activeTab === 'properties' && <ChevronRight className="ml-auto h-5 w-5" />}
                </button>
                
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                    activeTab === 'users'
                      ? darkMode 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : darkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <UserCog className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span>Përdoruesit</span>
                  {activeTab === 'users' && <ChevronRight className="ml-auto h-5 w-5" />}
                </button>
                
                <button
                  onClick={() => setActiveTab('system')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                    activeTab === 'system'
                      ? darkMode 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : darkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Database className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span>Sistemi</span>
                  {activeTab === 'system' && <ChevronRight className="ml-auto h-5 w-5" />}
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="md:col-span-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              {/* Error/Success messages */}
              {error && (
                <div className={`mb-6 p-4 rounded-md ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-800'} flex items-start`}>
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
              
              {saveSuccess && (
                <div className={`mb-6 p-4 rounded-md ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-800'} flex items-start`}>
                  <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p>Cilësimet u ruajtën me sukses!</p>
                </div>
              )}
              
              {/* General Settings */}
              {activeTab === 'general' && (
                <div>
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Cilësimet e përgjithshme</h3>
                  <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Konfigurimet e platformës dhe informacionet e kontaktit</p>
                  
                  <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="site_name" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Emri i faqes
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="site_name"
                            id="site_name"
                            value={siteSettings.site_name}
                            onChange={(e) => setSiteSettings({...siteSettings, site_name: e.target.value})}
                            className={`block w-full rounded-md ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'border-gray-300 text-gray-900'
                            } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="currency" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Valuta
                        </label>
                        <div className="mt-1">
                          <select
                            id="currency"
                            name="currency"
                            value={siteSettings.currency}
                            onChange={(e) => setSiteSettings({...siteSettings, currency: e.target.value})}
                            className={`block w-full rounded-md ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'border-gray-300 text-gray-900'
                            } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                          >
                            <option value="EUR">Euro (€)</option>
                            <option value="USD">US Dollar ($)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="sm:col-span-6">
                        <label htmlFor="site_description" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Përshkrimi i faqes
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="site_description"
                            name="site_description"
                            rows={3}
                            value={siteSettings.site_description}
                            onChange={(e) => setSiteSettings({...siteSettings, site_description: e.target.value})}
                            className={`block w-full rounded-md ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'border-gray-300 text-gray-900'
                            } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                          />
                        </div>
                        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Një përshkrim i shkurtër i platformës së patundshmërive
                        </p>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="contact_email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Email-i i kontaktit
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            name="contact_email"
                            id="contact_email"
                            value={siteSettings.contact_email}
                            onChange={(e) => setSiteSettings({...siteSettings, contact_email: e.target.value})}
                            className={`block w-full rounded-md ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'border-gray-300 text-gray-900'
                            } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="contact_phone" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Telefoni i kontaktit
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="contact_phone"
                            id="contact_phone"
                            value={siteSettings.contact_phone}
                            onChange={(e) => setSiteSettings({...siteSettings, contact_phone: e.target.value})}
                            className={`block w-full rounded-md ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'border-gray-300 text-gray-900'
                            } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-6">
                        <label htmlFor="footer_text" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Teksti i footer-it
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="footer_text"
                            id="footer_text"
                            value={siteSettings.footer_text}
                            onChange={(e) => setSiteSettings({...siteSettings, footer_text: e.target.value})}
                            className={`block w-full rounded-md ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'border-gray-300 text-gray-900'
                            } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="max_upload_size" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Madhësia maksimale e ngarkimit (MB)
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="max_upload_size"
                            id="max_upload_size"
                            min="1"
                            max="50"
                            value={siteSettings.max_upload_size}
                            onChange={(e) => setSiteSettings({...siteSettings, max_upload_size: parseInt(e.target.value)})}
                            className={`block w-full rounded-md ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'border-gray-300 text-gray-900'
                            } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Cilësimet e njoftimeve</h3>
                  <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Konfigurimi i njoftimeve të sistemit dhe emaileve</p>
                  
                  <div className="mt-6 space-y-6">
                    <div>
                      <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <input
                          id="enable_email_notifications"
                          name="enable_email_notifications"
                          type="checkbox"
                          checked={notificationSettings.enable_email_notifications}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings, 
                            enable_email_notifications: e.target.checked
                          })}
                          className={`h-4 w-4 rounded ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-blue-600' 
                              : 'border-gray-300 text-blue-600'
                          } focus:ring-blue-500`}
                        />
                        <label htmlFor="enable_email_notifications" className="ml-3 text-sm font-medium">
                          Aktivizo njoftimet me email
                        </label>
                      </div>
                      <p className={`mt-1 ml-7 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Dërgimi i njoftimeve me email për veprime të caktuara në platformë
                      </p>
                    </div>
                    
                    <div>
                      <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <input
                          id="notify_on_new_property"
                          name="notify_on_new_property"
                          type="checkbox"
                          checked={notificationSettings.notify_on_new_property}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings, 
                            notify_on_new_property: e.target.checked
                          })}
                          disabled={!notificationSettings.enable_email_notifications}
                          className={`h-4 w-4 rounded ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-blue-600' 
                              : 'border-gray-300 text-blue-600'
                          } focus:ring-blue-500 ${!notificationSettings.enable_email_notifications ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                        <label 
                          htmlFor="notify_on_new_property" 
                          className={`ml-3 text-sm font-medium ${!notificationSettings.enable_email_notifications ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Njofto kur shtohet një pronë e re
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <input
                          id="notify_on_user_register"
                          name="notify_on_user_register"
                          type="checkbox"
                          checked={notificationSettings.notify_on_user_register}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings, 
                            notify_on_user_register: e.target.checked
                          })}
                          disabled={!notificationSettings.enable_email_notifications}
                          className={`h-4 w-4 rounded ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-blue-600' 
                              : 'border-gray-300 text-blue-600'
                          } focus:ring-blue-500 ${!notificationSettings.enable_email_notifications ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                        <label 
                          htmlFor="notify_on_user_register" 
                          className={`ml-3 text-sm font-medium ${!notificationSettings.enable_email_notifications ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Njofto kur regjistrohet një përdorues i ri
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="admin_email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Emaili i administratorit
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="admin_email"
                          id="admin_email"
                          value={notificationSettings.admin_email}
                          onChange={(e) => setNotificationSettings({...notificationSettings, admin_email: e.target.value})}
                          className={`block w-full rounded-md ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'border-gray-300 text-gray-900'
                          } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                        />
                      </div>
                      <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Emaili ku do të dërgohen të gjitha njoftimet administrative
                      </p>
                    </div>
                    
                    <div className={`p-4 rounded-md ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} flex items-start`}>
                      <Info className={`h-5 w-5 mr-2 flex-shrink-0 mt-0.5 ${darkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                          Konfigurimi i SMTP-së
                        </p>
                        <p className={`mt-1 text-sm ${darkMode ? 'text-blue-300/80' : 'text-blue-600'}`}>
                          Për të dërguar emaile, duhet të konfiguroni një shërbim SMTP. Aktualisht, kjo funksionalitet nuk është i disponueshëm në versionin demo.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Property Settings */}
              {activeTab === 'properties' && (
                <div>
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Cilësimet e pronave</h3>
                  <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Konfigurimi i opsioneve për pronat dhe shpalljet</p>
                  
                  <div className="mt-6 space-y-6">
                    <div>
                      <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <input
                          id="require_approval"
                          name="require_approval"
                          type="checkbox"
                          checked={propertySettings.require_approval}
                          onChange={(e) => setPropertySettings({
                            ...propertySettings, 
                            require_approval: e.target.checked
                          })}
                          className={`h-4 w-4 rounded ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-blue-600' 
                              : 'border-gray-300 text-blue-600'
                          } focus:ring-blue-500`}
                        />
                        <label htmlFor="require_approval" className="ml-3 text-sm font-medium">
                          Kërko konfirmim për shpallje të reja
                        </label>
                      </div>
                      <p className={`mt-1 ml-7 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Shpalljet e reja duhet të konfirmohen nga administratori para se të publikohen
                      </p>
                    </div>
                    
                    <div>
                      <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <input
                          id="allow_premium_features"
                          name="allow_premium_features"
                          type="checkbox"
                          checked={propertySettings.allow_premium_features}
                          onChange={(e) => setPropertySettings({
                            ...propertySettings, 
                            allow_premium_features: e.target.checked
                          })}
                          className={`h-4 w-4 rounded ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-blue-600' 
                              : 'border-gray-300 text-blue-600'
                          } focus:ring-blue-500`}
                        />
                        <label htmlFor="allow_premium_features" className="ml-3 text-sm font-medium">
                          Aktivizo veçoritë premium
                        </label>
                      </div>
                      <p className={`mt-1 ml-7 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Lejon përdoruesit premium të kenë qasje në funksionalitete të avancuara
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="max_images" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Numri maksimal i fotove për pronë
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="max_images"
                          id="max_images"
                          min="1"
                          max="50"
                          value={propertySettings.max_images_per_property}
                          onChange={(e) => setPropertySettings({
                            ...propertySettings, 
                            max_images_per_property: parseInt(e.target.value)
                          })}
                          className={`block w-full rounded-md ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'border-gray-300 text-gray-900'
                          } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="listing_duration" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Kohëzgjatja e shpalljes (ditë)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="listing_duration"
                          id="listing_duration"
                          min="1"
                          max="365"
                          value={propertySettings.default_listing_duration}
                          onChange={(e) => setPropertySettings({
                            ...propertySettings, 
                            default_listing_duration: parseInt(e.target.value)
                          })}
                          className={`block w-full rounded-md ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'border-gray-300 text-gray-900'
                          } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                        />
                      </div>
                      <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Numri i ditëve që një shpallje mbetet aktive para se të skadojë
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="featured_limit" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Numri maksimal i pronave të veçanta në faqen kryesore
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="featured_limit"
                          id="featured_limit"
                          min="1"
                          max="50"
                          value={propertySettings.featured_properties_limit}
                          onChange={(e) => setPropertySettings({
                            ...propertySettings, 
                            featured_properties_limit: parseInt(e.target.value)
                          })}
                          className={`block w-full rounded-md ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'border-gray-300 text-gray-900'
                          } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* User Settings */}
              {activeTab === 'users' && (
                <div>
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Cilësimet e përdoruesve</h3>
                  <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Konfigurimi i politikave për përdoruesit</p>
                  
                  <div className="mt-6 space-y-6">
                    <div>
                      <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <input
                          id="allow_registration"
                          name="allow_registration"
                          type="checkbox"
                          checked={true}
                          className={`h-4 w-4 rounded ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-blue-600' 
                              : 'border-gray-300 text-blue-600'
                          } focus:ring-blue-500`}
                        />
                        <label htmlFor="allow_registration" className="ml-3 text-sm font-medium">
                          Lejo regjistrimin e përdoruesve të rinj
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <input
                          id="auto_verify"
                          name="auto_verify"
                          type="checkbox"
                          checked={true}
                          className={`h-4 w-4 rounded ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-blue-600' 
                              : 'border-gray-300 text-blue-600'
                          } focus:ring-blue-500`}
                        />
                        <label htmlFor="auto_verify" className="ml-3 text-sm font-medium">
                          Verifiko automatikisht përdoruesit e rinj
                        </label>
                      </div>
                      <p className={`mt-1 ml-7 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Përdoruesit e rinj nuk do të kenë nevojë të konfirmojnë emailin
                      </p>
                    </div>
                    
                    <div className="pt-4">
                      <h4 className={`text-md font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Kufizimet e llogarisë</h4>
                      
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="free_listings" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Numri maksimal i shpalljeve për llogari falas
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              name="free_listings"
                              id="free_listings"
                              min="1"
                              max="100"
                              defaultValue={3}
                              className={`block w-full rounded-md ${
                                darkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white' 
                                  : 'border-gray-300 text-gray-900'
                              } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="premium_listings" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Numri maksimal i shpalljeve për llogari premium
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              name="premium_listings"
                              id="premium_listings"
                              min="1"
                              max="1000"
                              defaultValue={999}
                              className={`block w-full rounded-md ${
                                darkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white' 
                                  : 'border-gray-300 text-gray-900'
                              } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h4 className={`text-md font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Çmimi premium</h4>
                      
                      <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                        <div>
                          <label htmlFor="monthly_price" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Çmimi mujor (€)
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              name="monthly_price"
                              id="monthly_price"
                              min="1"
                              step="0.01"
                              defaultValue={9.99}
                              className={`block w-full rounded-md ${
                                darkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white' 
                                  : 'border-gray-300 text-gray-900'
                              } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="yearly_price" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Çmimi vjetor (€)
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              name="yearly_price"
                              id="yearly_price"
                              min="1"
                              step="0.01"
                              defaultValue={99.99}
                              className={`block w-full rounded-md ${
                                darkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white' 
                                  : 'border-gray-300 text-gray-900'
                              } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* System Settings */}
              {activeTab === 'system' && (
                <div>
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Cilësimet e sistemit</h3>
                  <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Informacione dhe veprime të sistemit</p>
                  
                  <div className="mt-6 space-y-6">
                    <div className={`bg-gray-100 dark:bg-gray-700 rounded-lg p-4`}>
                      <h4 className={`text-md font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                        Statistikat e sistemit
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Numri total i përdoruesve</p>
                          <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{systemStats.total_users}</p>
                        </div>
                        
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Numri total i pronave</p>
                          <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{systemStats.total_properties}</p>
                        </div>
                        
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hapësira e përdorur në storage</p>
                          <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{systemStats.storage_used} MB</p>
                        </div>
                        
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Madhësia e bazës së të dhënave</p>
                          <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{systemStats.database_size} MB</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Maintenance Mode */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className={`text-md font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                        Modaliteti i mirëmbajtjes
                      </h4>
                      
                      <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <input
                          id="maintenance_mode"
                          name="maintenance_mode"
                          type="checkbox"
                          checked={isMaintenanceMode}
                          onChange={toggleMaintenanceMode}
                          className={`h-4 w-4 rounded ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-blue-600' 
                              : 'border-gray-300 text-blue-600'
                          } focus:ring-blue-500`}
                        />
                        <label htmlFor="maintenance_mode" className="ml-3 text-sm font-medium">
                          Aktivizo modalitetin e mirëmbajtjes
                        </label>
                      </div>
                      <p className={`mt-1 ml-7 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Kur është aktiv, faqja do të shfaqë një mesazh mirëmbajtjeje për të gjithë vizitorët që nuk janë administratorë
                      </p>
                    </div>
                    
                    {/* System Actions */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className={`text-md font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                        Veprime të sistemit
                      </h4>
                      
                      <div className="space-y-4">
                        <button
                          type="button"
                          className={`flex items-center px-4 py-2 ${
                            darkMode 
                              ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50' 
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          } rounded-md`}
                        >
                          <RefreshCw className="mr-2 h-5 w-5" />
                          Pastro cache-in e sistemit
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setIsResetModalOpen(true)}
                          className={`flex items-center px-4 py-2 ${
                            darkMode 
                              ? 'bg-red-900/30 text-red-300 hover:bg-red-900/50' 
                              : 'bg-red-50 text-red-700 hover:bg-red-100'
                          } rounded-md`}
                        >
                          <Trash2 className="mr-2 h-5 w-5" />
                          Reseto të dhënat e demo-s
                        </button>
                      </div>
                      
                      <div className={`mt-4 p-4 rounded-md ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'} flex items-start`}>
                        <AlertTriangle className={`h-5 w-5 mr-2 flex-shrink-0 mt-0.5 ${darkMode ? 'text-yellow-300' : 'text-yellow-400'}`} />
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                            Kujdes me veprimet e sistemit
                          </p>
                          <p className={`mt-1 text-sm ${darkMode ? 'text-yellow-300/80' : 'text-yellow-700'}`}>
                            Disa veprime janë të pakthyeshme dhe mund të rezultojnë në humbje të të dhënave. Kërkoni konsultë teknike para se të procedoni me këto veprime.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Save button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className={`flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Duke ruajtur...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Ruaj cilësimet
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reset data confirmation modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsResetModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 overflow-hidden shadow-xl transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900 rounded-full mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-300" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 dark:text-white mb-4">
                Konfirmo resetimin e të dhënave
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                Jeni i sigurt që dëshironi të resetoni të gjitha të dhënat e demo-s? Ky veprim është i pakthyeshëm dhe do të fshijë të gjitha të dhënat ekzistuese.
              </p>
              
              <div className="mb-4">
                <label htmlFor="reset_confirmation" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Shkruani "RESET" për të konfirmuar
                </label>
                <input
                  type="text"
                  id="reset_confirmation"
                  value={resetConfirmation}
                  onChange={(e) => setResetConfirmation(e.target.value)}
                  className={`block w-full rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300 text-gray-900'
                  } shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm`}
                  placeholder="RESET"
                />
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className={`px-4 py-2 ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 border-gray-600' 
                      : 'bg-white text-gray-700 border-gray-300'
                  } border rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  onClick={() => setIsResetModalOpen(false)}
                >
                  Anulo
                </button>
                <button
                  type="button"
                  disabled={resetConfirmation !== 'RESET' || loading}
                  className={`px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                    resetConfirmation !== 'RESET' || loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={handleDatabaseReset}
                >
                  {loading ? 'Duke procesuar...' : 'Reseto të dhënat'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSettings;