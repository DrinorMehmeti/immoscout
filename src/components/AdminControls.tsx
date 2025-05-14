import React, { useState } from 'react';
import { Check, UserCheck, Mail, Key, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';

interface AdminControlsProps {
  onUserUpdated?: () => void;
}

const AdminControls: React.FC<AdminControlsProps> = ({ onUserUpdated }) => {
  const { darkMode } = useTheme();
  const [method, setMethod] = useState<'personal_id' | 'email' | 'uuid'>('personal_id');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSetAdmin = async () => {
    if (!inputValue.trim()) {
      setResult({
        success: false,
        message: 'Ju lutemi plotësoni fushën e kërkuar.'
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      let success = false;

      switch (method) {
        case 'personal_id':
          // Use the RPC function for personal_id
          const { data: personalIdResult, error: personalIdError } = await supabase.rpc(
            'set_user_as_admin',
            { user_personal_id: inputValue }
          );
          
          if (personalIdError) throw personalIdError;
          success = personalIdResult;
          break;

        case 'email':
          // For email, we'll use a direct query approach since the RPC function has issues
          const { data: userByEmail, error: emailLookupError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', inputValue)
            .maybeSingle();
          
          if (emailLookupError) throw emailLookupError;
          
          if (userByEmail) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ is_admin: true })
              .eq('id', userByEmail.id);
            
            if (updateError) throw updateError;
            success = true;
          } else {
            success = false;
          }
          break;

        case 'uuid':
          // For UUID, directly update the profile
          const { error: uuidError } = await supabase
            .from('profiles')
            .update({ is_admin: true })
            .eq('id', inputValue);
          
          if (uuidError) throw uuidError;
          
          // Check if any rows were affected
          const { count, error: countError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('id', inputValue);
          
          if (countError) throw countError;
          success = count ? count > 0 : false;
          break;
      }

      if (success) {
        setResult({
          success: true,
          message: 'Përdoruesi u bë administrator me sukses!'
        });
        
        // Call onUserUpdated to refresh user list if needed
        if (onUserUpdated) onUserUpdated();
        
        // Reset form
        setInputValue('');
      } else {
        setResult({
          success: false,
          message: `Përdoruesi nuk u gjet ose nuk u bë administrator. Sigurohuni që ${method === 'personal_id' ? 'ID personale' : method === 'email' ? 'email' : 'ID UUID'} është i saktë.`
        });
      }
    } catch (error) {
      console.error('Error setting admin status:', error);
      setResult({
        success: false,
        message: `Ndodhi një gabim: ${error instanceof Error ? error.message : 'Gabim i panjohur'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateAllAdminsByType = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      // Direct SQL approach since the RPC function has issues
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .in('user_type', ['seller', 'landlord'])
        .select();
      
      if (error) throw error;
      
      setResult({
        success: true,
        message: `${data?.length || 0} përdorues u bënë administratorë me sukses!`
      });
      
      // Call onUserUpdated to refresh user list if needed
      if (onUserUpdated) onUserUpdated();
    } catch (error) {
      console.error('Error updating all users:', error);
      setResult({
        success: false,
        message: `Ndodhi një gabim: ${error instanceof Error ? error.message : 'Gabim i panjohur'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
        Menaxhimi i administratorëve
      </h2>
      
      <div className="mb-4">
        <div className="flex flex-col space-y-2 mb-4">
          <label className="flex items-center cursor-pointer">
            <input 
              type="radio" 
              name="admin-method" 
              checked={method === 'personal_id'} 
              onChange={() => setMethod('personal_id')}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Me ID personale (p.sh. USER-XXXXXX)
            </span>
          </label>
          
          <label className="flex items-center cursor-pointer">
            <input 
              type="radio" 
              name="admin-method" 
              checked={method === 'email'} 
              onChange={() => setMethod('email')}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Me email (p.sh. user@example.com)
            </span>
          </label>
          
          <label className="flex items-center cursor-pointer">
            <input 
              type="radio" 
              name="admin-method" 
              checked={method === 'uuid'} 
              onChange={() => setMethod('uuid')}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Me ID UUID (p.sh. 123e4567-e89b-...)
            </span>
          </label>
        </div>
        
        <div className="mt-6">
          <label htmlFor="admin-input" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            {method === 'personal_id' && 'ID Personale e përdoruesit'}
            {method === 'email' && 'Email i përdoruesit'}
            {method === 'uuid' && 'UUID i përdoruesit'}
          </label>
          
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {method === 'personal_id' && <Key className="h-5 w-5 text-gray-400" />}
              {method === 'email' && <Mail className="h-5 w-5 text-gray-400" />}
              {method === 'uuid' && <UserCheck className="h-5 w-5 text-gray-400" />}
            </div>
            <input
              id="admin-input"
              type={method === 'email' ? 'email' : 'text'}
              placeholder={
                method === 'personal_id' ? 'USER-XXXXXX' :
                method === 'email' ? 'user@example.com' :
                'UUID i përdoruesit'
              }
              className={`block w-full pl-10 pr-4 py-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          
          <button
            type="button"
            disabled={isLoading || !inputValue.trim()}
            onClick={handleSetAdmin}
            className={`mt-4 flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading || !inputValue.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Duke përpunuar...
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-5 w-5" />
                Bëj administrator
              </>
            )}
          </button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Përditëso të gjithë shitësit/qiradhënësit
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
            Kjo veprim do t'i bëjë automatikisht administratorë të gjithë përdoruesit me user_type 'seller' ose 'landlord'.
          </p>
          <button
            type="button"
            disabled={isLoading}
            onClick={updateAllAdminsByType}
            className={`flex items-center justify-center w-full px-4 py-2 border ${
              darkMode 
                ? 'border-blue-600 bg-blue-900/30 text-blue-300 hover:bg-blue-900/50' 
                : 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Duke përpunuar...' : 'Përditëso të gjithë shitësit/qiradhënësit'}
          </button>
        </div>
      </div>
      
      {result && (
        <div className={`mt-4 p-4 rounded-md ${
          result.success 
            ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
            : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {result.success ? (
                <Check className="h-5 w-5 text-green-500 dark:text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                result.success 
                  ? 'text-green-800 dark:text-green-300' 
                  : 'text-red-800 dark:text-red-300'
              }`}>
                {result.message}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className={`mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
          <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" /> 
          Informacione të rëndësishme
        </h3>
        <ul className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} list-disc pl-5 space-y-1`}>
          <li>ID personale mund ta shihni në listën e përdoruesve ose të pyesni përdoruesin për ID-në e tij</li>
          <li>Për tu bërë admin menjëherë, përdorni opsionin "Përditëso të gjithë shitësit/qiradhënësit"</li>
          <li>Pasi përdoruesi bëhet admin, ai do të ketë qasje në panelin e administratorit</li>
          <li>Ndryshimet aplikohen menjëherë, pa nevojë për rifreskim të faqes</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminControls;