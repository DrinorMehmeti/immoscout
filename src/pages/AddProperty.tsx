import React from 'react';
import AddPropertyForm from '../components/AddPropertyForm';
import { useTheme } from '../context/ThemeContext';

const AddProperty: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 ${darkMode ? 'text-white' : ''}`}>
      <div className="mb-6">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Shto një pronë të re</h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Plotësoni formularin më poshtë për të shtuar një pronë të re në platformën tonë
        </p>
      </div>
      
      <AddPropertyForm 
        onSuccess={() => {
          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};

export default AddProperty;