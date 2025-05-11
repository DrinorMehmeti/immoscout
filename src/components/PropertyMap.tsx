import React from 'react';

interface PropertyMapProps {
  location: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ location }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Standort</h3>
      <p className="text-gray-600 dark:text-gray-300">{location}</p>
    </div>
  );
};

export default PropertyMap; 