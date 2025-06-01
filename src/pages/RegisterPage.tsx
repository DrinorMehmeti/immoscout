import React from 'react';
import { Link } from 'react-router-dom';
import { Building } from 'lucide-react';
import Signup from '../components/ui/signup';
import { useTheme } from '../context/ThemeContext';

const RegisterPage: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col`}>
      <Signup />
      
      {/* Footer/Branding */}
      <div className="mt-8 text-center pb-4">
        <div className="flex justify-center items-center">
          <Building className={`h-6 w-6 ${darkMode ? 'text-white' : 'text-blue-600'} mr-2`} />
          <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            RealEstate Kosovo
          </span>
        </div>
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Platforma më e madhe e patundshmërive në Kosovë
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;