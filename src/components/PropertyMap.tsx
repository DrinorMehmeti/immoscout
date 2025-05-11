import React from 'react';

interface PropertyMapProps {
  location: string;
  tags?: string[];
}

const PropertyMap: React.FC<PropertyMapProps> = ({ location, tags = [] }) => {
  const getTagColor = (tag: string) => {
    // Hier können Sie die Farben nach Bedarf anpassen
    const colors: { [key: string]: string } = {
      'E mobiluar': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Afër qendrës': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Investim i mirë': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'default': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };

    return colors[tag] || colors.default;
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Standort</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{location}</p>
      
      {tags.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">🏷️ Tags oder Eigenschaften</h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColor(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap; 