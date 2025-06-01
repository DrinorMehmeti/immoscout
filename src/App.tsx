import { useEffect } from 'react';
import { Link, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HomepageProperties from './components/HomepageProperties';
import PremiumFeatures from './components/PremiumFeatures';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { Building, ArrowRight, Home, Check, Star } from 'lucide-react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ListingsPage from './pages/ListingsPage';
import MyPropertiesPage from './pages/MyPropertiesPage';
import PremiumPage from './pages/PremiumPage';
import AddPropertyPage from './pages/AddPropertyPage';
import EditPropertyPage from './pages/EditPropertyPage';
import PropertyDetail from './pages/PropertyDetail';
import Settings from './pages/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProperties from './pages/admin/AdminProperties';
import AdminPropertyDetail from './pages/admin/AdminPropertyDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

// The main app content for non-authenticated users
const LandingPage = () => {
  const { darkMode } = useTheme();
  
  return (
    <>
      <HeroSection />
      
      <HomepageProperties />
      
      <section className={`${darkMode ? 'bg-gray-800' : 'bg-blue-50'} py-16 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} sm:text-4xl`}>
              Pse të regjistroheni?
            </h2>
            <p className={`mt-3 max-w-2xl mx-auto text-xl ${darkMode ? 'text-gray-300' : 'text-gray-500'} sm:mt-4`}>
              Përfitimet e përdorimit të platformës sonë
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} p-6 rounded-lg shadow-md`}>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Gjetja e pronës ideale</h3>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Përdorni filtrat tanë të avancuar për të gjetur pikërisht atë që po kërkoni, qoftë për blerje apo qira.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className={darkMode ? 'text-gray-300' : ''}>Mijëra prona në platformë</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className={darkMode ? 'text-gray-300' : ''}>Filtro sipas preferencave tuaja</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className={darkMode ? 'text-gray-300' : ''}>Shiko pamje dhe planimetri</span>
                </li>
              </ul>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} p-6 rounded-lg shadow-md`}>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Shitni apo jepni me qira</h3>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Shtoni pronat tuaja për ti parë mijëra blerës dhe qiramarrës potencialë çdo ditë.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className={darkMode ? 'text-gray-300' : ''}>Shpallje falas bazike</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className={darkMode ? 'text-gray-300' : ''}>Ngarkoni deri në 10 foto</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className={darkMode ? 'text-gray-300' : ''}>Menaxhoni kërkesat direkt</span>
                </li>
              </ul>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} p-6 rounded-lg shadow-md`}>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Bëhuni premium</h3>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Shpalljet tuaja në krye të listës dhe përparësi ndaj të tjerëve me abonim premium.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className={darkMode ? 'text-gray-300' : ''}>Shpallje në krye të listës</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className={darkMode ? 'text-gray-300' : ''}>Shpallje të pakufizuara</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className={darkMode ? 'text-gray-300' : ''}>Statistika të detajuara</span>
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
            <p className={`mt-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Tashmë keni llogari? <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium">Kyçuni</Link>
            </p>
          </div>
        </div>
      </section>
      
      <PremiumFeatures />
      
      <section className={`py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${darkMode ? 'text-white' : ''}`}>
        <div className="text-center mb-10">
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} sm:text-4xl`}>
            Si funksionon?
          </h2>
          <p className={`mt-3 max-w-2xl mx-auto text-xl ${darkMode ? 'text-gray-300' : 'text-gray-500'} sm:mt-4`}>
            Tre hapa të thjeshtë për të filluar
          </p>
        </div>
        
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-700 font-bold text-lg">1</span>
            </div>
            <h3 className={`mt-6 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Regjistrohuni falas</h3>
            <p className={`mt-2 text-base ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Krijoni llogarinë tuaj falas dhe tregoni nëse jeni duke kërkuar për të blerë, shitur, dhënë apo marrë me qira.
            </p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-700 font-bold text-lg">2</span>
            </div>
            <h3 className={`mt-6 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Kërkoni ose shtoni pronë</h3>
            <p className={`mt-2 text-base ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Përdorni filtrat e avancuar për të gjetur pronën që dëshironi ose shtoni pronën tuaj nëse doni ta shitni apo jepni me qira.
            </p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-700 font-bold text-lg">3</span>
            </div>
            <h3 className={`mt-6 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Kontaktoni dhe finalizoni</h3>
            <p className={`mt-2 text-base ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
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

// Admin specific protected route
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  // Check for admin role
  const isAdmin = authState.isAuthenticated && authState.user?.profile?.is_admin;

  useEffect(() => {
    if (authState.isLoading) {
      return; // Wait until loading is complete
    }
    
    if (!authState.isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    
    if (!isAdmin) {
      navigate('/');
    }
  }, [authState.isAuthenticated, isAdmin, authState.isLoading, navigate]);

  if (authState.isLoading) {
    return <div>Loading...</div>;
  }

  return isAdmin ? <>{children}</> : null;
};

function App() {
  const { authState } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

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
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Don't show navbar on admin pages */}
      {!window.location.pathname.startsWith('/admin') && <Navbar />}
      
      <main className={`flex-grow ${!window.location.pathname.startsWith('/admin') ? 'pt-16' : ''}`}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/my-properties" element={<ProtectedRoute><MyPropertiesPage /></ProtectedRoute>} />
          <Route path="/add-property" element={<ProtectedRoute><AddPropertyPage /></ProtectedRoute>} />
          <Route path="/edit-property/:id" element={<ProtectedRoute><EditPropertyPage /></ProtectedRoute>} />
          <Route path="/premium" element={<ProtectedRoute><PremiumPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/properties" element={<AdminRoute><AdminProperties /></AdminRoute>} />
          <Route path="/admin/properties/:id" element={<AdminRoute><AdminPropertyDetail /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {!window.location.pathname.startsWith('/admin') && <Footer />}
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