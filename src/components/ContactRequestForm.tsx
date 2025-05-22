import React, { useState } from 'react';
import { Send, Phone, Mail, Info, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface ContactRequestFormProps {
  propertyId: string;
  ownerId: string;
  onClose?: () => void;
}

const ContactRequestForm: React.FC<ContactRequestFormProps> = ({ propertyId, ownerId, onClose }) => {
  const { authState } = useAuth();
  const { darkMode } = useTheme();
  const [message, setMessage] = useState('');
  const [contactType, setContactType] = useState<'viewing' | 'question' | 'offer' | 'other'>('viewing');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState(authState.user?.email || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authState.user) {
      setError('Ju duhet të jeni të kyçur për të dërguar kërkesa kontakti.');
      return;
    }
    
    if (!message.trim()) {
      setError('Ju lutem shkruani një mesazh.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: submitError } = await supabase
        .from('contact_requests')
        .insert({
          property_id: propertyId,
          requester_id: authState.user.id,
          owner_id: ownerId,
          message: message.trim(),
          contact_type: contactType,
          phone_number: phoneNumber.trim() || null,
          email: email.trim() || null
        })
        .select()
        .single();
      
      if (submitError) throw submitError;
      
      setSuccess(true);
      setMessage('');
      setPhoneNumber('');
      
      // Close the form after success (if onClose is provided)
      if (onClose) {
        setTimeout(onClose, 3000);
      }
    } catch (err) {
      console.error('Error submitting contact request:', err);
      setError('Ndodhi një gabim gjatë dërgimit të kërkesës. Ju lutemi provoni përsëri.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-lg`}>
      <h2 className="text-xl font-bold mb-4 flex items-center">
        {success ? (
          <>
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            Kërkesa juaj u dërgua me sukses!
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5 text-blue-500" />
            Dërgoni një kërkesë kontakti
          </>
        )}
      </h2>
      
      {success ? (
        <div className={`p-4 rounded-md ${darkMode ? 'bg-green-900/20 text-green-300' : 'bg-green-50 text-green-700'}`}>
          <p>Faleminderit për kërkesën tuaj! Pronari do të njoftohet dhe do t'ju kontaktojë së shpejti.</p>
          <p className="mt-2 font-medium">Kërkesa juaj është në status "në pritje".</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className={`p-4 mb-4 rounded-md ${darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700'}`}>
              <div className="flex">
                <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Lloji i kërkesës</label>
            <div className="grid grid-cols-2 gap-2">
              <label className={`flex items-center p-3 rounded-md cursor-pointer ${
                contactType === 'viewing'
                  ? darkMode
                    ? 'bg-blue-900/30 border border-blue-700'
                    : 'bg-blue-50 border border-blue-200'
                  : darkMode
                    ? 'bg-gray-700 border border-gray-600 hover:bg-gray-650'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}>
                <input
                  type="radio"
                  name="contactType"
                  value="viewing"
                  checked={contactType === 'viewing'}
                  onChange={() => setContactType('viewing')}
                  className="sr-only"
                />
                <div className={`w-4 h-4 mr-2 rounded-full flex items-center justify-center border ${
                  contactType === 'viewing'
                    ? darkMode
                      ? 'border-blue-400 bg-blue-500'
                      : 'border-blue-500 bg-blue-600'
                    : darkMode
                      ? 'border-gray-400'
                      : 'border-gray-400'
                }`}>
                  {contactType === 'viewing' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span>Dua ta shoh</span>
              </label>
              
              <label className={`flex items-center p-3 rounded-md cursor-pointer ${
                contactType === 'question'
                  ? darkMode
                    ? 'bg-blue-900/30 border border-blue-700'
                    : 'bg-blue-50 border border-blue-200'
                  : darkMode
                    ? 'bg-gray-700 border border-gray-600 hover:bg-gray-650'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}>
                <input
                  type="radio"
                  name="contactType"
                  value="question"
                  checked={contactType === 'question'}
                  onChange={() => setContactType('question')}
                  className="sr-only"
                />
                <div className={`w-4 h-4 mr-2 rounded-full flex items-center justify-center border ${
                  contactType === 'question'
                    ? darkMode
                      ? 'border-blue-400 bg-blue-500'
                      : 'border-blue-500 bg-blue-600'
                    : darkMode
                      ? 'border-gray-400'
                      : 'border-gray-400'
                }`}>
                  {contactType === 'question' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span>Kam pyetje</span>
              </label>
              
              <label className={`flex items-center p-3 rounded-md cursor-pointer ${
                contactType === 'offer'
                  ? darkMode
                    ? 'bg-blue-900/30 border border-blue-700'
                    : 'bg-blue-50 border border-blue-200'
                  : darkMode
                    ? 'bg-gray-700 border border-gray-600 hover:bg-gray-650'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}>
                <input
                  type="radio"
                  name="contactType"
                  value="offer"
                  checked={contactType === 'offer'}
                  onChange={() => setContactType('offer')}
                  className="sr-only"
                />
                <div className={`w-4 h-4 mr-2 rounded-full flex items-center justify-center border ${
                  contactType === 'offer'
                    ? darkMode
                      ? 'border-blue-400 bg-blue-500'
                      : 'border-blue-500 bg-blue-600'
                    : darkMode
                      ? 'border-gray-400'
                      : 'border-gray-400'
                }`}>
                  {contactType === 'offer' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span>Dua të bëj ofertë</span>
              </label>
              
              <label className={`flex items-center p-3 rounded-md cursor-pointer ${
                contactType === 'other'
                  ? darkMode
                    ? 'bg-blue-900/30 border border-blue-700'
                    : 'bg-blue-50 border border-blue-200'
                  : darkMode
                    ? 'bg-gray-700 border border-gray-600 hover:bg-gray-650'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}>
                <input
                  type="radio"
                  name="contactType"
                  value="other"
                  checked={contactType === 'other'}
                  onChange={() => setContactType('other')}
                  className="sr-only"
                />
                <div className={`w-4 h-4 mr-2 rounded-full flex items-center justify-center border ${
                  contactType === 'other'
                    ? darkMode
                      ? 'border-blue-400 bg-blue-500'
                      : 'border-blue-500 bg-blue-600'
                    : darkMode
                      ? 'border-gray-400'
                      : 'border-gray-400'
                }`}>
                  {contactType === 'other' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span>Tjetër</span>
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Mesazhi juaj
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`w-full p-3 border rounded-md resize-none ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
              }`}
              rows={4}
              placeholder="Shkruani mesazhin tuaj këtu..."
              required
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Numri i telefonit (opsional)
              </label>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`w-full pl-10 p-3 border rounded-md ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  placeholder="+383 44 123 456"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email (opsional)
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 p-3 border rounded-md ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  placeholder="emailijuaj@shembull.com"
                />
              </div>
            </div>
          </div>
          
          <div className={`p-3 rounded-md mb-4 flex items-start ${
            darkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'
          }`}>
            <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm">Detajet tuaja të kontaktit do të përdoren vetëm për këtë kërkesë dhe do të jenë të dukshme vetëm për pronarin e pronës.</p>
          </div>
          
          <div className="flex justify-end space-x-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Anulo
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Duke dërguar...
                </div>
              ) : (
                'Dërgo kërkesën'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactRequestForm;