import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';

const ContactPage: React.FC = () => {
  const { darkMode } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    if (!name || !email || !message) {
      setError('Ju lutemi plotësoni të gjitha fushat e detyrueshme.');
      setIsSubmitting(false);
      return;
    }

    // Email validation with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Ju lutemi jepni një adresë email valide.');
      setIsSubmitting(false);
      return;
    }

    try {
      // In a real application, this would send the contact message to a database or email service
      // For demo purposes, we'll use a delay to simulate sending
      
      // This is just an example - in production you would have a proper contact submissions table
      // or use a serverless function to send an email
      // const { data, error: submitError } = await supabase
      //   .from('contact_messages')
      //   .insert({
      //     name,
      //     email,
      //     subject,
      //     message
      //   });
      
      // if (submitError) throw submitError;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success!
      setSubmitSuccess(true);
      
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setError('Ndodhi një gabim gjatë dërgimit të mesazhit tuaj. Ju lutemi provoni përsëri.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen pt-24 pb-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Na Kontaktoni</h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-500 dark:text-gray-400">
            Keni pyetje, kërkesa apo sugjerime? Jemi këtu për t'ju ndihmuar. Plotësoni formularin më poshtë ose përdorni informacionet e kontaktit.
          </p>
        </div>
        
        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
              <h2 className="text-2xl font-semibold mb-6">Dërgoni një mesazh</h2>
              
              {submitSuccess ? (
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-green-900/20 text-green-200' : 'bg-green-50 text-green-800'} flex items-start`}>
                  <CheckCircle className="h-6 w-6 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Faleminderit për mesazhin tuaj!</h3>
                    <p>Mesazhi juaj u dërgua me sukses. Do t'ju kontaktojmë sa më shpejt të jetë e mundur.</p>
                    <button 
                      onClick={() => setSubmitSuccess(false)}
                      className={`mt-4 px-4 py-2 rounded-md ${darkMode ? 'bg-green-800 hover:bg-green-700' : 'bg-green-100 hover:bg-green-200'} transition-colors`}
                    >
                      Dërgo një mesazh tjetër
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className={`p-4 rounded-md ${darkMode ? 'bg-red-900/20 text-red-200' : 'bg-red-50 text-red-800'} flex items-start`}>
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Emri i plotë <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                            : 'bg-gray-50 border-gray-300 focus:border-blue-600'
                        } border focus:ring-2 focus:ring-blue-500`}
                        placeholder="Emri juaj"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                            : 'bg-gray-50 border-gray-300 focus:border-blue-600'
                        } border focus:ring-2 focus:ring-blue-500`}
                        placeholder="emailijuaj@shembull.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Tema
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-300 focus:border-blue-600'
                      } border focus:ring-2 focus:ring-blue-500`}
                      placeholder="Tema e mesazhit tuaj"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Mesazhi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-300 focus:border-blue-600'
                      } border focus:ring-2 focus:ring-blue-500`}
                      placeholder="Shkruani mesazhin tuaj këtu..."
                      required
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full sm:w-auto flex items-center justify-center px-8 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Duke dërguar...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Dërgo mesazhin
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 mb-8`}>
              <h2 className="text-2xl font-semibold mb-6">Detajet e kontaktit</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className={`p-3 rounded-full ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-600'} mr-4`}>
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Email</h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                      <a href="mailto:info@realestate-kosovo.com" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                        info@realestate-kosovo.com
                      </a>
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                      Ne përgjigjem brenda 24 orëve
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`p-3 rounded-full ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-600'} mr-4`}>
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Telefoni</h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                      <a href="tel:+38344123456" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                        +383 44 123 456
                      </a>
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                      E hënë - E premte: 9:00 - 17:00
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-600'} mr-4`}>
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Adresa</h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                      Rruga "Luan Haradinaj"<br />
                      10000 Prishtinë, Kosovë
                    </p>
                    <p className="mt-2">
                      <a 
                        href="https://maps.google.com/?q=Prishtine+Kosovo" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`inline-flex items-center text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Shiko në hartë
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
              <h2 className="text-2xl font-semibold mb-6">Orari ynë i punës</h2>
              <div className="space-y-3">
                <div className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                  <span>E Hënë - E Premte</span>
                  <span className="font-medium">9:00 - 17:00</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                  <span>E Shtunë</span>
                  <span className="font-medium">10:00 - 14:00</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span>E Dielë</span>
                  <span className="font-medium">Mbyllur</span>
                </div>
              </div>
              
              <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 text-blue-200' : 'bg-blue-50 text-blue-800'}`}>
                <h3 className="text-lg font-medium mb-2">Takimet</h3>
                <p className="text-sm">
                  Për takimet personale, ju lutemi caktoni një takim paraprakisht përmes telefonit ose email-it.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Na gjeni në hartë</h2>
          <div className={`w-full h-96 rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            {/* This would be a map component in a real application */}
            <div className="w-full h-full flex items-center justify-center text-center">
              <div>
                <MapPin className={`h-12 w-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Në një implementim të vërtetë, këtu do të shihni hartën e Google<br />
                  me lokacionin tonë të shënuar.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">Pyetje të shpeshta</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h3 className="text-xl font-medium mb-3">Si mund të listoj një pronë?</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Për të listuar një pronë, regjistrohuni në platformën tonë, navigoni te "Shto pronë" dhe ndiqni udhëzimet për të ngarkuar informacionet dhe fotot e pronës suaj.
              </p>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h3 className="text-xl font-medium mb-3">Sa kushton listimi i pronave?</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Listimi bazë është falas. Ofrojmë edhe plane premium me veçori shtesë si shpallje të theksuara dhe statistika të detajuara.
              </p>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h3 className="text-xl font-medium mb-3">Si funksionon procesi i kontaktit?</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Blerësit dhe qiramarrësit potencialë mund të kontaktojnë direkt pronarët e pronave përmes formularit të kontaktit të integruar në platformë.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;