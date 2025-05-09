import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RegisterForm from './components/RegisterForm';
import './index.css';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <RegisterForm onToggleForm={() => window.location.href = '/login.html'} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RegisterPage />
    </AuthProvider>
  </React.StrictMode>
);