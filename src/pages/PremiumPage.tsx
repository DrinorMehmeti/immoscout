import React, { useState } from 'react';
import { Star, Check, ArrowRight, CreditCard, Calendar, Shield, Award, Zap, BarChart4, Users, BellRing } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const PremiumPage: React.FC = () => {
  const { authState } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Here you would normally redirect to payment processor
      alert('Payment process would start here');
    }, 1500);
  };

  const getPrice = () => {
    return billingPeriod === 'monthly' ? 9.99 : 99.99;
  };

  const getSavings = () => {
    // Annual is equivalent to 10 months (2 months free)
    return billingPeriod === 'annual' ? 19.98 : 0;
  };

  const premiumFeatures = [
    { 
      icon: <Star className="h-5 w-5 text-yellow-400" />, 
      title: 'Shpalljet tuaja në krye të listës',
      description: 'Shpalljet tuaja renditen përpara të gjitha shpalljeve tjera'
    },
    { 
      icon: <BarChart4 className="h-5 w-5 text-blue-500" />, 
      title: 'Statistika të avancuara për shpalljet',
      description: 'Shihni sa persona kanë parë shpalljet tuaja dhe sa kanë klikuar në to'
    },
    { 
      icon: <BellRing className="h-5 w-5 text-purple-500" />, 
      title: 'Mbështetje prioritare',
      description: 'Merrni përgjigje brenda 24 orëve për çdo pyetje apo problem'
    },
    { 
      icon: <Users className="h-5 w-5 text-green-500" />, 
      title: 'Shpallje të pakufizuara',
      description: 'Nuk ka kufizim në numrin e shpalljeve që mund të shtoni'
    }
  ];

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-xl overflow-hidden">
        <div className="relative px-6 py-8 md:px-10 md:py-10">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 bg-yellow-300 opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-60 w-60 bg-blue-400 opacity-10 rounded-full"></div>
          
          {/* Header */}
          <div className="relative text-center max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="h-10 w-10 text-yellow-500" />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Bëhu Premium</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Përfito nga të gjitha avantazhet e një llogarie premium dhe rrit shanset për të shitur ose dhënë me qira pronën tënde më shpejt!
            </p>
          </div>
          
          {/* Plan selection */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="bg-white p-4 rounded-lg shadow-md mb-8">
              <div className="flex justify-center">
                <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                  <button
                    onClick={() => setBillingPeriod('monthly')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      billingPeriod === 'monthly' 
                        ? 'bg-white shadow-sm text-blue-600' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Mujore
                  </button>
                  <button
                    onClick={() => setBillingPeriod('annual')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center ${
                      billingPeriod === 'annual' 
                        ? 'bg-white shadow-sm text-blue-600' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Vjetore
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">20% zbritje</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Pricing card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-[1.02]">
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Premium {billingPeriod === 'annual' ? 'Vjetor' : 'Mujor'}</h3>
                    <p className="text-gray-500 mt-1">
                      {billingPeriod === 'annual' ? 'Paguaj një herë për një vit të plotë' : 'Paguaj çdo muaj'}
                    </p>
                  </div>
                  <div className="flex items-end">
                    <span className="text-4xl font-extrabold text-blue-600">{getPrice().toFixed(2)}€</span>
                    <span className="text-gray-500 ml-1 mb-1">{billingPeriod === 'annual' ? '/vit' : '/muaj'}</span>
                  </div>
                </div>
                
                {billingPeriod === 'annual' && (
                  <div className="mt-4 bg-green-50 text-green-700 px-4 py-2 rounded-lg flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    <span>Kurseni {getSavings().toFixed(2)}€ me paketën vjetore</span>
                  </div>
                )}
                
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Çfarë përfshihet:</h4>
                  <ul className="space-y-4">
                    {premiumFeatures.map((feature, index) => (
                      <li key={index} className="flex">
                        <div className="flex-shrink-0 mt-1">
                          {feature.icon}
                        </div>
                        <div className="ml-3">
                          <p className="text-base font-medium text-gray-900">{feature.title}</p>
                          <p className="text-sm text-gray-500">{feature.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-8">
                  <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className={`w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transition-all ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Duke procesuar...
                      </span>
                    ) : (
                      <>
                        Bëhu Premium tani
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span>Paguaj sigurt me kartë krediti</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Anulo kurdo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Why premium section */}
          <div className="max-w-3xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Pse të zgjidhni Premium?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                  <Award className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Dallohuni nga të tjerët</h3>
                <p className="text-gray-600">Shpalljet tuaja do të shfaqen përpara të gjitha shpalljeve tjera, duke rritur mundësinë për t'u vënë re.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-green-100 mb-4">
                  <Zap className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Rezultate më të shpejta</h3>
                <p className="text-gray-600">Pronat premium shiten ose jepen me qira mesatarisht 2x më shpejt se shpalljet e zakonshme.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-purple-100 mb-4">
                  <BarChart4 className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Analiza të detajuara</h3>
                <p className="text-gray-600">Merrni statistika të detajuara për shpalljet tuaja dhe kuptoni më mirë audiencën tuaj të synuar.</p>
              </div>
            </div>
          </div>
          
          {/* Testimonials section */}
          <div className="max-w-3xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Çfarë thonë përdoruesit tanë premium</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    AB
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">Arbër Berisha</h4>
                    <p className="text-sm text-gray-500">Agjent Imobiliar</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"Që kur u bëra premium, pronat e mia marrin dyfish më shumë shikime. Kam arritur të shes 3 prona brenda një muaji!"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" />
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">
                    FM
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">Fjolla Maliqi</h4>
                    <p className="text-sm text-gray-500">Pronare apartamentesh</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"Statistikat e detajuara më ndihmojnë të optimizoj shpalljet e mia. Tashmë kam dhënë me qira të gjitha apartamentet që kisha të lira!"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Pyetje të shpeshta</h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-medium text-lg text-gray-900 mb-2">Si funksionon abonimi premium?</h3>
                <p className="text-gray-600">Abonimi premium është një shërbim i bazuar në pagesë mujore ose vjetore që ju jep qasje në funkcionet e avancuara të platformës sonë. Pasi të bëheni premium, të gjitha shpalljet tuaja do të shfaqen në krye të listës dhe do të keni qasje në statistika të detajuara.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-medium text-lg text-gray-900 mb-2">A mund ta anuloj abonimin tim premium?</h3>
                <p className="text-gray-600">Po, abonimi premium mund të anulohet në çdo kohë. Pasi ta anuloni, do të vazhdoni të keni qasje në funksionet premium deri në fund të periudhës së paguar.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-medium text-lg text-gray-900 mb-2">Cilat janë metodat e pagesës që pranoni?</h3>
                <p className="text-gray-600">Pranojmë pagesa me kartë krediti/debiti (Visa, Mastercard, American Express), si dhe përmes PayPal-it. Të gjitha transaksionet janë të sigurta dhe të enkriptuara.</p>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="max-w-3xl mx-auto mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-xl p-10">
              <h2 className="text-3xl font-bold text-white mb-4">Gati për të filluar?</h2>
              <p className="text-blue-100 text-lg mb-8">Bëhu premium sot dhe shiko ndryshimin në suksesin e shpalljeve tuaja</p>
              <button
                onClick={handleSubscribe}
                className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-lg font-bold text-lg shadow-lg transition-all flex items-center mx-auto"
              >
                Bëhu Premium tani
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PremiumPage;