import { useEffect } from 'react';
import { Link, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PropertyGrid from './components/PropertyGrid';
import PremiumFeatures from './components/PremiumFeatures';
import Footer from './components/Footer';
import { mockProperties } from './data/mockData';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Building, ArrowRight, Home, Check, Star } from 'lucide-react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ListingsPage from './pages/ListingsPage';
import MyPropertiesPage from './pages/MyPropertiesPage';
import PremiumPage from './pages/PremiumPage';

// The main app content for non-authenticated users
const LandingPage = () => {
  return (
    <>
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
            <Link to="/listings" className="text-blue-600 hover:text-blue-800 font-medium">
              Shiko të gjitha
            </Link>
          </div>
          <PropertyGrid properties={mockProperties.slice(0, 4)} />
        </div>
      </section>
      
      <section className="bg-blue-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Pse të regjistroheni?
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Përfitimet e përdorimit të platformës sonë
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gjetja e pronës ideale</h3>
              <p className="text-gray-600 mb-4">
                Përdorni filtrat tanë të avancuar për të gjetur pikërisht atë që po kërkoni, qoftë për blerje apo qira.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Mijëra prona në platformë</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Filtro sipas preferencave tuaja</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Shiko pamje dhe planimetri</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Shitni apo jepni me qira</h3>
              <p className="text-gray-600 mb-4">
                Shtoni pronat tuaja për ti parë mijëra blerës dhe qiramarrës potencialë çdo ditë.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Shpallje falas bazike</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Ngarkoni deri në 10 foto</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Menaxhoni kërkesat direkt</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Bëhuni premium</h3>
              <p className="text-gray-600 mb-4">
                Shpalljet tuaja në krye të listës dhe përparësi ndaj të tjerëve me abonim premium.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Shpallje në krye të listës</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Shpallje të pakufizuara</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Statistika të detajuara</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              to="/register" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Regjistrohu falas tani
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              Tashmë keni llogari? <Link to="/login" className="text-blue-600 font-medium">Kyçuni</Link>
            </p>
          </div>
        </div>
      </section>
      
      <PremiumFeatures />
      
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Si funksionon?
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Tre hapa të thjeshtë për të filluar
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
        
        <div className="mt-10 text-center">
          <Link 
            to="/register" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Filloni udhëtimin tuaj tani
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
};

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState.isAuthenticated && !authState.isLoading) {
      navigate('/login');
    }
  }, [authState.isAuthenticated, authState.isLoading, navigate]);

  if (authState.isLoading) {
    return <div>Loading...</div>;
  }

  return authState.isAuthenticated ? <>{children}</> : null;
};

function App() {
  const { authState } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    if (authState.isAuthenticated) {
      const path = window.location.pathname;
      if (path === '/login' || path === '/register') {
        navigate('/dashboard');
      }
    }
  }, [authState.isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/my-properties" element={<ProtectedRoute><MyPropertiesPage /></ProtectedRoute>} />
          <Route path="/premium" element={<ProtectedRoute><PremiumPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

// We need this wrapper component to properly use the useAuth hook
const AppWithAuth = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default AppWithAuth;