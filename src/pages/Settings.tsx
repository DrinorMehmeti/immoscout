import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import { 
  Save, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Bell, 
  Check, 
  AlertTriangle, 
  Eye, 
  EyeOff,
  HelpCircle,
  Info,
  Trash2
} from 'lucide-react';

const Settings: React.FC = () => {
  const { authState } = useAuth();
  const { darkMode } = useTheme();
  
  // User profile state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [propertyAlerts, setPropertyAlerts] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  // Load user data when component mounts
  useEffect(() => {
    if (authState.user && authState.user.profile) {
      setName(authState.user.profile.name || '');
      setEmail(authState.user.email || '');
      // In a real app, you'd load phone and notification preferences from the database
      setPhone('+383 44 123 456'); // Demo data
    }
  }, [authState.user]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setProfileSuccess(false);
    
    try {
      if (!authState.user) {
        throw new Error('User not found');
      }
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name
        })
        .eq('id', authState.user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Show success message
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Ndodhi një gabim gjatë përditësimit të profilit');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordError('Fjalëkalimet e reja nuk përputhen');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Fjalëkalimi duhet të ketë të paktën 6 karaktere');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Show success message
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating password:', err);
      setPasswordError('Ndodhi një gabim gjatë ndryshimit të fjalëkalimit');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would update notification preferences in the database
    alert('Preferencat e njoftimeve u ruajtën me sukses!');
  };
  
  const handleDeleteAccount = () => {
    // In a real app, this would show a confirmation dialog and then delete the account
    alert('Ky funksionalitet do të implementohet së shpejti');
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Cilësimet e llogarisë</h1>
        
        {/* Profile Settings */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-6`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Profili im
          </h2>
          
          {error && (
            <div className={`mb-4 p-4 rounded-md flex items-start ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-800'}`}>
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
          
          {profileSuccess && (
            <div className={`mb-4 p-4 rounded-md flex items-start ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-800'}`}>
              <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>Profili u përditësua me sukses!</p>
            </div>
          )}
          
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label htmlFor="name" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Emri i plotë
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`pl-10 block w-full rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300 text-gray-900'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  placeholder="Emri Mbiemri"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Adresa e emailit
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  readOnly
                  className={`pl-10 block w-full rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  placeholder="ju@shembull.com"
                />
              </div>
              <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Adresa e emailit nuk mund të ndryshohet
              </p>
            </div>
            
            <div>
              <label htmlFor="phone" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Numri i telefonit
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`pl-10 block w-full rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300 text-gray-900'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  placeholder="+383 44 123 456"
                />
              </div>
              <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Numri i telefonit përdoret vetëm për qëllime verifikimi dhe nuk ndahet me palë të treta
              </p>
            </div>
            
            <div className={`pt-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p>
                <span className="font-medium">ID Personale: </span> 
                <span className="font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-blue-600 dark:text-blue-400">
                  {authState.user?.profile?.personal_id || 'N/A'}
                </span>
              </p>
              <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                ID-ja personale përdoret për identifikim dhe nuk mund të ndryshohet
              </p>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
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
                    Ruaj ndryshimet
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Password Settings */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-6`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Ndrysho fjalëkalimin
          </h2>
          
          {passwordError && (
            <div className={`mb-4 p-4 rounded-md flex items-start ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-800'}`}>
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{passwordError}</p>
            </div>
          )}
          
          {passwordSuccess && (
            <div className={`mb-4 p-4 rounded-md flex items-start ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-800'}`}>
              <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>Fjalëkalimi u ndryshua me sukses!</p>
            </div>
          )}
          
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label htmlFor="current_password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Fjalëkalimi aktual
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="current_password"
                  id="current_password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`pl-10 pr-10 block w-full rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300 text-gray-900'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="new_password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Fjalëkalimi i ri
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="new_password"
                  id="new_password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`pl-10 block w-full rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300 text-gray-900'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="confirm_password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Konfirmo fjalëkalimin e ri
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirm_password"
                  id="confirm_password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 block w-full rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300 text-gray-900'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className={`pt-2 flex flex-col xs:flex-row xs:justify-between xs:items-center gap-4`}>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Fjalëkalimi duhet të ketë të paktën 6 karaktere
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Duke ndryshuar...
                  </>
                ) : (
                  'Ndrysho fjalëkalimin'
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Notification Settings */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-6`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Preferencat e njoftimeve
          </h2>
          
          <form onSubmit={handleUpdateNotifications} className="space-y-4">
            <div className={`rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4`}>
              <div className="space-y-4">
                <div className={`flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className="flex items-center h-5">
                    <input
                      id="email_notifications"
                      name="email_notifications"
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className={`h-4 w-4 rounded ${
                        darkMode 
                          ? 'bg-gray-900 border-gray-600 text-blue-600' 
                          : 'border-gray-300 text-blue-600'
                      } focus:ring-blue-500`}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="email_notifications" className="font-medium">
                      Njoftimet me email
                    </label>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Merr njoftime me email për aktivitetet e rëndësishme
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'} ${!emailNotifications ? 'opacity-50' : ''}`}>
                  <div className="flex items-center h-5">
                    <input
                      id="property_alerts"
                      name="property_alerts"
                      type="checkbox"
                      checked={propertyAlerts}
                      onChange={(e) => setPropertyAlerts(e.target.checked)}
                      disabled={!emailNotifications}
                      className={`h-4 w-4 rounded ${
                        darkMode 
                          ? 'bg-gray-900 border-gray-600 text-blue-600' 
                          : 'border-gray-300 text-blue-600'
                      } focus:ring-blue-500`}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="property_alerts" className="font-medium">
                      Njoftime për pronat
                    </label>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Njoftime për prona të reja që përputhen me kriteret tuaja
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'} ${!emailNotifications ? 'opacity-50' : ''}`}>
                  <div className="flex items-center h-5">
                    <input
                      id="message_notifications"
                      name="message_notifications"
                      type="checkbox"
                      checked={messageNotifications}
                      onChange={(e) => setMessageNotifications(e.target.checked)}
                      disabled={!emailNotifications}
                      className={`h-4 w-4 rounded ${
                        darkMode 
                          ? 'bg-gray-900 border-gray-600 text-blue-600' 
                          : 'border-gray-300 text-blue-600'
                      } focus:ring-blue-500`}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="message_notifications" className="font-medium">
                      Njoftime për mesazhet
                    </label>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Njoftime kur dikush ju dërgon një mesazh
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-md ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} flex items-start`}>
              <HelpCircle className={`h-5 w-5 mr-2 flex-shrink-0 mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                Gjithmonë do të merrni emailet e rëndësishme si konfirmimet e pronave, ndryshimet e statusit dhe njoftimet e sigurisë, pavarësisht nga këto cilësime.
              </p>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                <Save className="mr-2 h-4 w-4" />
                Ruaj preferencat
              </button>
            </div>
          </form>
        </div>
        
        {/* Account Management */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-6`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Menaxhimi i llogarisë
          </h2>
          
          <div className={`p-4 border ${darkMode ? 'border-red-800 bg-red-900/20' : 'border-red-200 bg-red-50'} rounded-md`}>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-red-300' : 'text-red-800'} flex items-center`}>
              <AlertTriangle className="h-5 w-5 mr-2" />
              Zona e rrezikshme
            </h3>
            <p className={`mt-1 text-sm ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
              Veprimet në këtë zonë mund të çojnë në humbje të përhershme të të dhënave
            </p>
            
            <div className="mt-4">
              <button
                type="button"
                onClick={handleDeleteAccount}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                  darkMode 
                    ? 'text-red-300 bg-red-900/30 hover:bg-red-900/50' 
                    : 'text-red-700 bg-red-100 hover:bg-red-200'
                }`}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Fshij llogarinë time
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;