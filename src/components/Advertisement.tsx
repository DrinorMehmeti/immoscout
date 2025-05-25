import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface AdvertisementProps {
  position: 'left' | 'right';
}

const Advertisement: React.FC<AdvertisementProps> = ({ position }) => {
  const { darkMode } = useTheme();

  return (
    <div 
      className={`
        fixed ${position}-0 top-1/2 -translate-y-1/2 w-[160px] h-[600px]
        ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}
        rounded-lg shadow-lg p-4 mx-4
        flex flex-col items-center justify-center
        transition-all duration-300 hover:scale-105
      `}
    >
      <div className="text-center">
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Reklamë
        </p>
        {/* Hier könnte der eigentliche Werbeinhalt eingefügt werden */}
        <div className="mt-2">
          <div className={`w-full h-[500px] ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded`}>
            {/* Platzhalter für Werbebanner */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advertisement; 