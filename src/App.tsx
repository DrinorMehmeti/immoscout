import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PropertyGrid from './components/PropertyGrid';
import PremiumFeatures from './components/PremiumFeatures';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import { mockProperties } from './data/mockData';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register'>('login');
  
  const openLoginModal = () => {
    setAuthModalView('login');
    setIsAuthModalOpen(true);
  };
  
  const openRegisterModal = () => {
    setAuthModalView('register');
    setIsAuthModalOpen(true);
  };
  
  // Handle hash-based navigation
  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#login') {
        openLoginModal();
      } else if (window.location.hash === '#register') {
        openRegisterModal();
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check on initial load
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          <HeroSection />
          
          <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Shpalljet e fundit
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                Shikoni pronat më të reja të shtuara në platformën tonë
              </p>
            </div>
            
            <div className="mt-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Të rejat në treg</h3>
                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                  Shiko të gjitha
                </a>
              </div>
              <PropertyGrid properties={mockProperties} />
            </div>
          </section>
          
          <PremiumFeatures />
          
          <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Si funksionon?
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                Gjeni pronën tuaj të ëndrrave me vetëm disa hapa të thjeshtë
              </p>
            </div>
            
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-700 font-bold text-lg">1</span>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Regjistrohuni falas</h3>
                <p className="mt-2 text-base text-gray-500">
                  Krijoni llogarinë tuaj falas dhe tregoni nëse jeni duke kërkuar për të blerë, shitur, dhënë apo marrë me qira.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-700 font-bold text-lg">2</span>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Kërkoni ose shtoni pronë</h3>
                <p className="mt-2 text-base text-gray-500">
                  Përdorni filtrat e avancuar për të gjetur pronën që dëshironi ose shtoni pronën tuaj nëse doni ta shitni apo jepni me qira.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-700 font-bold text-lg">3</span>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Kontaktoni dhe finalizoni</h3>
                <p className="mt-2 text-base text-gray-500">
                  Kontaktoni pronarët direkt në platformë dhe finalizoni transaksionin në mënyrën që ju përshtatet më së miri.
                </p>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
        
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          initialView={authModalView}
        />
      </div>
    </AuthProvider>
  );
}

export default App;