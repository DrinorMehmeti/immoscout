import React from 'react';
import { createRoot } from 'react-dom/client';
import ListingsPage from './pages/ListingsPage';
import { AuthProvider } from './context/AuthContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ListingsPage />
    </AuthProvider>
  </React.StrictMode>
);