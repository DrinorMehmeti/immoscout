import React from 'react';
import { createRoot } from 'react-dom/client';
import AddPropertyPage from './pages/AddPropertyPage';
import { AuthProvider } from './context/AuthContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AddPropertyPage />
    </AuthProvider>
  </React.StrictMode>
);