import React from 'react';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
import AddPropertyForm from '../components/AddPropertyForm';
import { useAuth } from '../context/AuthContext';
import { Building, LogIn } from 'lucide-react';

const AddPropertyPage: React.FC = () => {
  const { authState } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* <Navbar /> */}
      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {authState.isAuthenticated ? (
            <>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Shto një pronë të re</h1>
                <p className="mt-2 text-gray-600">Plotësoni formularin më poshtë për të shtuar një pronë të re në platformën tonë</p>
              </div>
              <AddPropertyForm 
                onSuccess={() => {
                  // Scroll to top
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-medium text-gray-900 mb-2">Ju nuk jeni të kyçur</h2>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Ju duhet të kyçeni ose të regjistroheni për të shtuar një pronë në platformën tonë
              </p>
              <a
                href="#login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Kyçu tani
              </a>
            </div>
          )}
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default AddPropertyPage;