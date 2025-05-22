import React, { useState } from 'react';
import { Star, Check, ArrowRight, CreditCard, Calendar, Shield, Award, Zap, BarChart4, Users, BellRing } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import PaymentInstructions from '../components/PaymentInstructions';

const PremiumPage: React.FC = () => {
  const { authState } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);

  const getPrice = () => {
    return billingPeriod === 'monthly' ? 9.99 : 99.99;
  };

  const getSavings = () => {
    // Annual is equivalent to 10 months (2 months free)
    return billingPeriod === 'annual' ? 19.98 : 0;
  };

  const handleSubscribe = () => {
    setShowPaymentInstructions(true);
    // Scroll to payment instructions
    setTimeout(() => {
      const element = document.getElementById('payment-instructions');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
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
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-xl overflow-hidden dark:from-gray-800 dark:to-gray-900">
        <div className="relative px-6 py-8 md:px-10 md:py-10">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 bg-yellow-300 opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-60 w-60 bg-blue-400 opacity-10 rounded-full"></div>
          
          {/* Header */}
          <div className="relative text-center max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-yellow-100 rounded-full dark:bg-yellow-900/30">
                <Star className="h-10 w-10 text-yellow-500" />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Bëhu Premium</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Përfito nga të gjitha avantazhet e një llogarie premium dhe rrit shanset për të shitur ose dhënë me qira pronën tënde më shpejt!
            </p>
          </div>
          
          {/* Plan selection */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8">
              <div className="flex justify-center">
                <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg inline-flex">
                  <button
                    onClick={() => setBillingPeriod('monthly')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      billingPeriod === 'monthly' 
                        ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Mujore
                  </button>
                  <button
                    onClick={() => setBillingPeriod('annual')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center ${
                      billingPeriod === 'annual' 
                        ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Vjetore
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300">20% zbritje</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Pricing card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-[1.02]">
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Premium {billingPeriod === 'annual' ? 'Vjetor' : 'Mujor'}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      {billingPeriod === 'annual' ? 'Paguaj një herë për një vit të plotë' : 'Paguaj çdo muaj'}
                    </p>
                  </div>
                  <div className="flex items-end">
                    <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">{getPrice().toFixed(2)}€</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1 mb-1">{billingPeriod === 'annual' ? '/vit' : '/muaj'}</span>
                  </div>
                </div>
                
                {billingPeriod === 'annual' && (
                  <div className="mt-4 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-4 py-2 rounded-lg flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    <span>Kurseni {getSavings().toFixed(2)}€ me paketën vjetore</span>
                  </div>
                )}
                
                <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Çfarë përfshihet:</h4>
                  <ul className="space-y-4">
                    {premiumFeatures.map((feature, index) => (
                      <li key={index} className="flex">
                        <div className="flex-shrink-0 mt-1">
                          {feature.icon}
                        </div>
                        <div className="ml-3">
                          <p className="text-base font-medium text-gray-900 dark:text-white">{feature.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-8">
                  <button
                    onClick={handleSubscribe}
                    className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transition-all dark:from-blue-600 dark:to-blue-800 dark:focus:ring-offset-gray-900"
                  >
                    Bëhu Premium tani
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span>Paguaj sigurt me transfertë bankare</span>
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Anulo kurdo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Instructions */}
          {showPaymentInstructions && (
            <div id="payment-instructions">
              <PaymentInstructions
                amount={getPrice()}
                period={billingPeriod}
              />
            </div>
          )}
          
          {/* Why premium section */}
          <div className="max-w-3xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">Pse të zgjidhni Premium?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                  <Award className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Dallohuni nga të tjerët</h3>
                <p className="text-gray-600 dark:text-gray-400">Shpalljet tuaja do të shfaqen përpara të gjitha shpalljeve tjera, duke rritur mundësinë për t'u vënë re.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                  <Zap className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Rezultate më të shpejta</h3>
                <p className="text-gray-600 dark:text-gray-400">Pronat premium shiten ose jepen me qira mesatarisht 2x më shpejt se shpalljet e zakonshme.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
                  <BarChart4 className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Analiza të detajuara</h3>
                <p className="text-gray-600 dark:text-gray-400">Merrni statistika të detajuara për shpalljet tuaja dhe kuptoni më mirë audiencën tuaj të synuar.</p>
              </div>
            </div>
          </div>
          
          {/* Testimonials section */}
          <div className="max-w-3xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">Çfarë thonë përdoruesit tanë premium</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    AB
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Arbër Berisha</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Agjent Imobiliar</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic">"Që kur u bëra premium, pronat e mia marrin dyfish më shumë shikime. Kam arritur të shes 3 prona brenda një muaji!"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" />
                  ))}
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">
                    FM
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Fjolla Maliqi</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pronare apartamentesh</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic">"Statistikat e detajuara më ndihmojnë të optimizoj shpalljet e mia. Tashmë kam dhënë me qira të gjitha apartamentet që kisha të lira!"</p>
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
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">Pyetje të shpeshta</h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-2">Si funksionon abonimi premium?</h3>
                <p className="text-gray-600 dark:text-gray-400">Abonimi premium është një shërbim i bazuar në pagesë mujore ose vjetore që ju jep qasje në funkcionet e avancuara të platformës sonë. Pasi të bëheni premium, të gjitha shpalljet tuaja do të shfaqen në krye të listës dhe do të keni qasje në statistika të detajuara.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-2">Si mund të paguaj për premium?</h3>
                <p className="text-gray-600 dark:text-gray-400">Aktualisht, ne pranojmë pagesa përmes transfertës bankare. Pasi të klikoni në butonin "Bëhu Premium", do të shfaqen udhëzimet e pagesës me IBAN dhe referencën e nevojshme. Ju lutem përdorni ID-në tuaj personale si referencë për pagesën.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-2">Sa kohë duhet që llogaria ime të aktivizohet si premium?</h3>
                <p className="text-gray-600 dark:text-gray-400">Pas kryerjes së pagesës, llogaria juaj zakonisht aktivizohet brenda 1-2 ditëve të punës. Nëse pagesa juaj nuk është aktivizuar pas 2 ditëve, ju lutem na kontaktoni në support@realestate-kosovo.com për ndihmë.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-2">A mund ta anuloj abonimin tim premium?</h3>
                <p className="text-gray-600 dark:text-gray-400">Po, abonimi premium mund të anulohet në çdo kohë. Pasi ta anuloni, do të vazhdoni të keni qasje në funksionet premium deri në fund të periudhës së paguar.</p>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="max-w-3xl mx-auto mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 rounded-xl shadow-xl p-10">
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