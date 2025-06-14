import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  Save, 
  Globe, 
  Settings as SettingsIcon, 
  Mail, 
  Phone, 
  DollarSign, 
  Image, 
  Clock, 
  Star, 
  Users, 
  Building, 
  Bell, 
  AlertTriangle, 
  Check,
  Info,
  RotateCcw,
  Database,
  Shield,
  Server,
  Trash2
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Add type definitions for Supabase functions
type SupabaseFunction = 'get_setting' | 'update_setting';

interface SettingsState {
  site: {
    name: string;
    description: string;
    contact_email: string;
    contact_phone: string;
    footer_text: string;
    max_upload_size: number;
    currency: string;
  };
  properties: {
    require_approval: boolean;
    max_images_per_property: number;
    allow_premium_features: boolean;
    default_listing_duration: number;
    featured_properties_limit: number;
    free_user_image_limit: number;
    premium_user_image_limit: number;
  };
  premium: {
    monthly_price: number;
    yearly_price: number;
    features: string[];
  };
  system: {
    maintenance_mode: boolean;
    version: string;
    last_backup: string | null;
  };
}

const AdminSettings: React.FC = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Settings state
  const [settings, setSettings] = useState<SettingsState>({
    site: {
      name: 'RealEstate Kosovo',
      description: 'Platforma më e madhe e patundshmërive në Kosovë',
      contact_email: 'info@realestate-kosovo.com',
      contact_phone: '+383 44 123 456',
      footer_text: '© 2025 RealEstate Kosovo. Të gjitha të drejtat e rezervuara.',
      max_upload_size: 10,
      currency: 'EUR'
    },
    properties: {
      require_approval: true,
      max_images_per_property: 15,
      allow_premium_features: true,
      default_listing_duration: 30,
      featured_properties_limit: 10,
      free_user_image_limit: 3,
      premium_user_image_limit: 15
    },
    premium: {
      monthly_price: 9.99,
      yearly_price: 99.99,
      features: ['featured_listings', 'unlimited_properties', 'advanced_statistics', 'priority_support', 'more_images']
    },
    system: {
      maintenance_mode: false,
      version: '1.0.0',
      last_backup: null
    }
  });
  
  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch site settings
      const { data: siteData, error: siteError } = await supabase.rpc('get_setting', {
        setting_name: 'site'
      });
      
      if (siteError) throw siteError;
      
      // Fetch property settings
      const { data: propertiesData, error: propertiesError } = await supabase.rpc('get_setting', {
        setting_name: 'properties'
      });
      
      if (propertiesError) throw propertiesError;
      
      // Fetch premium settings
      const { data: premiumData, error: premiumError } = await supabase.rpc('get_setting', {
        setting_name: 'premium'
      });
      
      if (premiumError) throw premiumError;
      
      // Fetch system settings
      const { data: systemData, error: systemError } = await supabase.rpc('get_setting', {
        setting_name: 'system'
      });
      
      if (systemError) throw systemError;
      
      // Update settings state with fetched data
      setSettings({
        site: siteData || settings.site,
        properties: propertiesData || settings.properties,
        premium: premiumData || settings.premium,
        system: systemData || settings.system
      });
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Ndodhi një gabim gjatë marrjes së cilësimeve');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveSettings = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Save site settings
      const { data: siteResult, error: siteError } = await supabase.rpc('update_setting', {
        setting_name: 'site',
        setting_value: settings.site
      });
      
      if (siteError) throw siteError;
      
      // Save property settings
      const { data: propertiesResult, error: propertiesError } = await supabase.rpc('update_setting', {
        setting_name: 'properties',
        setting_value: settings.properties
      });
      
      if (propertiesError) throw propertiesError;
      
      // Save premium settings
      const { data: premiumResult, error: premiumError } = await supabase.rpc('update_setting', {
        setting_name: 'premium',
        setting_value: settings.premium
      });
      
      if (premiumError) throw premiumError;
      
      // Save system settings
      const { data: systemResult, error: systemError } = await supabase.rpc('update_setting', {
        setting_name: 'system',
        setting_value: settings.system
      });
      
      if (systemError) throw systemError;
      
      // Show success message
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Ndodhi një gabim gjatë ruajtjes së cilësimeve');
    } finally {
      setSaving(false);
    }
  };
  
  const updateSiteSettings = (key: string, value: any) => {
    setSettings({
      ...settings,
      site: {
        ...settings.site,
        [key]: value
      }
    });
  };
  
  const updatePropertySettings = (key: string, value: any) => {
    setSettings({
      ...settings,
      properties: {
        ...settings.properties,
        [key]: value
      }
    });
  };
  
  const updatePremiumSettings = (key: string, value: any) => {
    setSettings({
      ...settings,
      premium: {
        ...settings.premium,
        [key]: value
      }
    });
  };
  
  const updateSystemSettings = (key: string, value: any) => {
    setSettings({
      ...settings,
      system: {
        ...settings.system,
        [key]: value
      }
    });
  };
  
  const handleMaintenanceToggle = async () => {
    // Toggle maintenance mode
    updateSystemSettings('maintenance_mode', !settings.system.maintenance_mode);
  };
  
  const handleBackupDatabase = async () => {
    alert('Funksionaliteti i backup-it do të implementohet së shpejti');
    // In a real app, you would call an API endpoint to trigger a database backup
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Informacioni i platformës</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                Informacionet bazë për platformën tuaj
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="site_name" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Emri i platformës
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="site_name"
                    id="site_name"
                    value={settings.site.name}
                    onChange={(e) => updateSiteSettings('name', e.target.value)}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
                    }`}
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
                    value={settings.site.currency}
                    onChange={(e) => updateSiteSettings('currency', e.target.value)}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
                    }`}
                  >
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="CHF">Franga Zvicerane (CHF)</option>
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="description" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Përshkrimi
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={settings.site.description}
                    onChange={(e) => updateSiteSettings('description', e.target.value)}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
                    }`}
                  />
                </div>
                <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Një përshkrim i shkurtër i platformës që do të shfaqet në meta tags dhe në kërkimet në Google
                </p>
              </div>
            </div>
            
            <div className={`pt-5 mt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Informacioni i kontaktit</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                Informacionet e kontaktit të platformës
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="contact_email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email-i i kontaktit
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="email"
                    name="contact_email"
                    id="contact_email"
                    value={settings.site.contact_email}
                    onChange={(e) => updateSiteSettings('contact_email', e.target.value)}
                    className={`pl-10 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
                    }`}
                    placeholder="contact@example.com"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="contact_phone" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Numri i telefonit
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="text"
                    name="contact_phone"
                    id="contact_phone"
                    value={settings.site.contact_phone}
                    onChange={(e) => updateSiteSettings('contact_phone', e.target.value)}
                    className={`pl-10 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
                    }`}
                    placeholder="+383 44 123 456"
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
                    value={settings.site.footer_text}
                    onChange={(e) => updateSiteSettings('footer_text', e.target.value)}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
                    }`}
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="max_upload_size" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Madhësia maksimale e upload-it (MB)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    name="max_upload_size"
                    id="max_upload_size"
                    value={settings.site.max_upload_size}
                    onChange={(e) => updateSiteSettings('max_upload_size', parseInt(e.target.value) || 10)}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
                    }`}
                  />
                </div>
                <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Madhësia maksimale e secilës foto që përdoruesit mund të ngarkojnë
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'properties':
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Cilësimet e pronave</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                Konfiguro se si funksionojnë pronat në platformë
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <div className={`flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className="flex items-center h-5">
                    <input
                      id="require_approval"
                      name="require_approval"
                      type="checkbox"
                      checked={settings.properties.require_approval}
                      onChange={(e) => updatePropertySettings('require_approval', e.target.checked)}
                      className={`h-4 w-4 rounded ${
                        darkMode 
                          ? 'bg-gray-900 border-gray-600 text-blue-600' 
                          : 'border-gray-300 text-blue-600'
                      } focus:ring-blue-500`}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="require_approval" className="font-medium">
                      Kërko aprovim për pronat e reja
                    </label>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Pronat do të jenë në gjendje "në pritje" derisa një admin t'i aprovojë
                    </p>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-3">
                <div className={`flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className="flex items-center h-5">
                    <input
                      id="allow_premium"
                      name="allow_premium"
                      type="checkbox"
                      checked={settings.properties.allow_premium_features}
                      onChange={(e) => updatePropertySettings('allow_premium_features', e.target.checked)}
                      className={`h-4 w-4 rounded ${
                        darkMode 
                          ? 'bg-gray-900 border-gray-600 text-blue-600' 
                          : 'border-gray-300 text-blue-600'
                      } focus:ring-blue-500`}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="allow_premium" className="font-medium">
                      Lejo veçoritë premium
                    </label>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Aktivizo funksionalitetet premium për pronat (shpallje të reklamuara, etj.)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="max_images" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nr. maksimal i fotove për pronë
                </label>
                <div className="mt-1">
                  <input
                    id="max_images"
                    name="max_images"
                    type="number"
                    min="1"
                    max="50"
                    value={settings.properties.max_images_per_property}
                    onChange={(e) => updatePropertySettings('max_images_per_property', parseInt(e.target.value) || 10)}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
                    }`}
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="listing_duration" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Kohëzgjatja e shpalljes (ditë)
                </label>
                <div className="mt-1">
                  <input
                    id="listing_duration"
                    name="listing_duration"
                    type="number"
                    min="1"
                    max="365"
                    value={settings.properties.default_listing_duration}
                    onChange={(e) => updatePropertySettings('default_listing_duration', parseInt(e.target.value) || 30)}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
                    }`}
                  />
                </div>
                <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Numri i ditëve që një shpallje standarde është aktive para se të skadojë
                </p>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="featured_limit" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Limiti i pronave të reklamuara
                </label>
                <div className="mt-1">
                  <input
                    id="featured_limit"
                    name="featured_limit"
                    type="number"
                    min="1"
                    max="50"
                    value={settings.properties.featured_properties_limit}
                    onChange={(e) => updatePropertySettings('featured_properties_limit', parseInt(e.target.value) || 10)}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
                    }`}
                  />
                </div>
                <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Numri maksimal i pronave të reklamuara që shfaqen në faqen kryesore
                </p>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="free_user_image_limit" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Maximale Bilder für Free-User
                </label>
                <div className="mt-1">
                  <input
                    id="free_user_image_limit"
                    name="free_user_image_limit"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.properties.free_user_image_limit}
                    onChange={(e) => updatePropertySettings('free_user_image_limit', parseInt(e.target.value) || 3)}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
                    }`}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="premium_user_image_limit" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Maximale Bilder für Premium-User
                </label>
                <div className="mt-1">
                  <input
                    id="premium_user_image_limit"
                    name="premium_user_image_limit"
                    type="number"
                    min="1"
                    max="50"
                    value={settings.properties.premium_user_image_limit}
                    onChange={(e) => updatePropertySettings('premium_user_image_limit', parseInt(e.target.value) || 15)}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'premium':
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Cilësimet Premium
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                Konfiguro detajet e abonimeve premium
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="monthly_price" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Çmimi mujor (€)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="monthly_price"
                    id="monthly_price"
                    value={settings.premium.monthly_price}
                    onChange={(e) => updatePremiumSettings('monthly_price', parseFloat(e.target.value) || 0)}
                    className={`pl-10 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
                    }`}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="yearly_price" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Çmimi vjetor (€)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="yearly_price"
                    id="yearly_price"
                    value={settings.premium.yearly_price}
                    onChange={(e) => updatePremiumSettings('yearly_price', parseFloat(e.target.value) || 0)}
                    className={`pl-10 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
                    }`}
                  />
                </div>
                <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Zakonisht vendoset më pak se sa 12x çmimi mujor për të ofruar zbritje
                </p>
              </div>
              
              <div className="sm:col-span-6">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Veçoritë e përfshira në abonim premium
                </label>
                
                <div className={`mt-2 p-4 border rounded-md ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="space-y-4">
                    <div className={`flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-center h-5">
                        <input
                          id="featured_listings"
                          name="featured_listings"
                          type="checkbox"
                          checked={settings.premium.features.includes('featured_listings')}
                          onChange={(e) => {
                            const newFeatures = e.target.checked
                              ? [...settings.premium.features, 'featured_listings']
                              : settings.premium.features.filter(f => f !== 'featured_listings');
                            updatePremiumSettings('features', newFeatures);
                          }}
                          className={`h-4 w-4 rounded ${
                            darkMode 
                              ? 'bg-gray-900 border-gray-600 text-blue-600' 
                              : 'border-gray-300 text-blue-600'
                          } focus:ring-blue-500`}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="featured_listings" className="font-medium">
                          Shpalljet në krye të listës
                        </label>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Pronat e përdoruesve premium shfaqen në krye të rezultateve të kërkimit
                        </p>
                      </div>
                    </div>
                    
                    <div className={`flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-center h-5">
                        <input
                          id="unlimited_properties"
                          name="unlimited_properties"
                          type="checkbox"
                          checked={settings.premium.features.includes('unlimited_properties')}
                          onChange={(e) => {
                            const newFeatures = e.target.checked
                              ? [...settings.premium.features, 'unlimited_properties']
                              : settings.premium.features.filter(f => f !== 'unlimited_properties');
                            updatePremiumSettings('features', newFeatures);
                          }}
                          className={`h-4 w-4 rounded ${
                            darkMode 
                              ? 'bg-gray-900 border-gray-600 text-blue-600' 
                              : 'border-gray-300 text-blue-600'
                          } focus:ring-blue-500`}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="unlimited_properties" className="font-medium">
                          Prona të pakufizuara
                        </label>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Përdoruesit premium mund të shtojnë prona pa kufizim
                        </p>
                      </div>
                    </div>
                    
                    <div className={`flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-center h-5">
                        <input
                          id="advanced_statistics"
                          name="advanced_statistics"
                          type="checkbox"
                          checked={settings.premium.features.includes('advanced_statistics')}
                          onChange={(e) => {
                            const newFeatures = e.target.checked
                              ? [...settings.premium.features, 'advanced_statistics']
                              : settings.premium.features.filter(f => f !== 'advanced_statistics');
                            updatePremiumSettings('features', newFeatures);
                          }}
                          className={`h-4 w-4 rounded ${
                            darkMode 
                              ? 'bg-gray-900 border-gray-600 text-blue-600' 
                              : 'border-gray-300 text-blue-600'
                          } focus:ring-blue-500`}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="advanced_statistics" className="font-medium">
                          Statistika të avancuara
                        </label>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Statistika dhe analiza të detajuara për pronat
                        </p>
                      </div>
                    </div>
                    
                    <div className={`flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-center h-5">
                        <input
                          id="priority_support"
                          name="priority_support"
                          type="checkbox"
                          checked={settings.premium.features.includes('priority_support')}
                          onChange={(e) => {
                            const newFeatures = e.target.checked
                              ? [...settings.premium.features, 'priority_support']
                              : settings.premium.features.filter(f => f !== 'priority_support');
                            updatePremiumSettings('features', newFeatures);
                          }}
                          className={`h-4 w-4 rounded ${
                            darkMode 
                              ? 'bg-gray-900 border-gray-600 text-blue-600' 
                              : 'border-gray-300 text-blue-600'
                          } focus:ring-blue-500`}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="priority_support" className="font-medium">
                          Mbështetje me prioritet
                        </label>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Qasje në mbështetje të dedikuar me prioritet më të lartë
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'system':
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Cilësimet e sistemit
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                Konfiguro parametrat e sistemit dhe mirëmbajtjes
              </p>
            </div>
            
            <div className={`rounded-lg p-4 ${
              darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                    Informacioni i sistemit
                  </h3>
                  <div className={`mt-2 text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    <p>Versioni i platformës: <span className="font-mono font-medium">{settings.system.version}</span></p>
                    <p className="mt-1">
                      Backup i fundit: {settings.system.last_backup 
                        ? new Date(settings.system.last_backup).toLocaleDateString('sq-AL', {
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) 
                        : 'Asnjëherë'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4">
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <h4 className={`text-sm font-medium ${darkMode ? 'text-yellow-300' : 'text-yellow-800'} mb-2`}>
                  Modaliteti i mirëmbajtjes
                </h4>
                <div className="flex justify-between items-center">
                  <p className={`text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>
                    Kur aktivizohet, platforma është e padisponueshme për përdoruesit normalë dhe shfaq një mesazh mirëmbajtjeje
                  </p>
                  <div className="ml-4">
                    <button
                      type="button"
                      onClick={handleMaintenanceToggle}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                        settings.system.maintenance_mode 
                          ? 'bg-yellow-600' 
                          : darkMode ? 'bg-gray-600' : 'bg-gray-200'
                      } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      <span
                        className={`${
                          settings.system.maintenance_mode ? 'translate-x-6' : 'translate-x-1'
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
              }`}>
                <h4 className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-800'} mb-2`}>
                  Backup i bazës së të dhënave
                </h4>
                <div className="flex justify-between items-center">
                  <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                    Krijo një backup të plotë të të dhënave të platformës
                  </p>
                  <div className="ml-4">
                    <button
                      type="button"
                      onClick={handleBackupDatabase}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Database className="mr-2 h-4 w-4" />
                      Backup
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
            } mt-4`}>
              <h4 className={`text-sm font-medium ${darkMode ? 'text-red-300' : 'text-red-800'} mb-2 flex items-center`}>
                <AlertTriangle className="h-5 w-5 mr-1" /> 
                Zona e rrezikshme
              </h4>
              <p className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-700'} mb-4`}>
                Këto veprime mund të jenë të rrezikshme dhe duhet të përdoren me kujdes
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md ${
                    darkMode 
                      ? 'bg-red-900 text-red-100 hover:bg-red-800' 
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                  onClick={() => alert('Funksionaliteti i pastrimit të cache do të implementohet së shpejti')}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Pastro cache
                </button>
                
                <button
                  type="button"
                  className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md ${
                    darkMode 
                      ? 'bg-red-900 text-red-100 hover:bg-red-800' 
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                  onClick={() => alert('Funksionaliteti i rivendosjes së statuseve do të implementohet së shpejti')}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Rivendos statuset e pronave
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cilësimet e platformës</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Konfiguroni të gjitha aspektet e platformës nga një vend
        </p>
      </div>
      
      {/* Content */}
      <div className="px-4 sm:px-6 pb-6">
        {error && (
          <div className={`mb-6 p-4 rounded-md ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-800'} flex items-start`}>
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className={`mb-6 p-4 rounded-md ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-800'} flex items-start`}>
            <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>Cilësimet u ruajtën me sukses!</span>
          </div>
        )}
        
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden`}>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <aside className={`w-64 bg-gray-50 dark:bg-gray-900 p-5`}>
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab('general')}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                      activeTab === 'general' 
                        ? darkMode 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-white text-blue-700 border border-gray-300'
                        : darkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Globe className="mr-3 h-5 w-5 flex-shrink-0" />
                    Të përgjithshme
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('properties')}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                      activeTab === 'properties' 
                        ? darkMode 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-white text-blue-700 border border-gray-300'
                        : darkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Building className="mr-3 h-5 w-5 flex-shrink-0" />
                    Cilësimet e pronave
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('premium')}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                      activeTab === 'premium' 
                        ? darkMode 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-white text-blue-700 border border-gray-300'
                        : darkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Star className="mr-3 h-5 w-5 flex-shrink-0" />
                    Cilësimet premium
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('system')}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                      activeTab === 'system' 
                        ? darkMode 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-white text-blue-700 border border-gray-300'
                        : darkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Server className="mr-3 h-5 w-5 flex-shrink-0" />
                    Sistemi
                  </button>
                </nav>
              </aside>
              
              <div className="flex-1 p-6">
                {loading ? (
                  <div className="flex justify-center items-center h-full py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  renderTabContent()
                )}
              </div>
            </div>
            
            <div className="px-6 py-4 flex justify-end bg-gray-50 dark:bg-gray-700">
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={saving}
                className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  saving ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {saving ? (
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
                    Ruaj të gjitha cilësimet
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;