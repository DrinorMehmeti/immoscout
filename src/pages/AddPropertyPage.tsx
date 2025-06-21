import React from 'react';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
import AddPropertyForm from '../components/AddPropertyForm';
import { useAuth } from '../context/AuthContext';
import { Building, LogIn, Plus } from 'lucide-react';

const AddPropertyPage: React.FC = () => {
  const { authState } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* <Navbar /> */}
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {authState.isAuthenticated ? (
            <div className="space-y-8">
              {/* Header Section */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-6">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Shto një pronë të re
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Plotësoni formularin më poshtë për të shtuar një pronë të re në platformën tonë
                </p>
              </div>

              {/* Form Container */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 lg:p-12">
                <AddPropertyForm 
                  onSuccess={() => {
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl mb-8">
                  <Building className="h-10 w-10 text-gray-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Ju nuk jeni të kyçur
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Ju duhet të kyçeni ose të regjistroheni për të shtuar një pronë në platformën tonë
                </p>
                <a
                  href="#login"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <LogIn className="h-5 w-5 mr-3" />
                  Kyçu tani
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default AddPropertyPage;