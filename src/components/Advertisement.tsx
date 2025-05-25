import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { ShoppingBag, Home, Car } from 'lucide-react';

interface AdvertisementProps {
  position: 'left' | 'right';
}

// This component creates a visually appealing advertisement that rotates between different themes
const Advertisement: React.FC<AdvertisementProps> = ({ position }) => {
  const { darkMode } = useTheme();
  const [adIndex, setAdIndex] = React.useState(0);
  
  // Sample advertisement data
  const advertisements = [
    {
      title: "Bëni shtëpinë tuaj më të bukur",
      description: "Mobilie të reja me 30% zbritje",
      icon: <Home className="h-10 w-10" />,
      bgColor: "from-blue-500 to-blue-700",
      textColor: "text-white",
      cta: "Blej tani"
    },
    {
      title: "Vetura të reja në Prishtinë",
      description: "Financim deri në 7 vjet",
      icon: <Car className="h-10 w-10" />,
      bgColor: "from-green-500 to-green-700",
      textColor: "text-white",
      cta: "Rezervo test drive"
    },
    {
      title: "Koleksioni pranveror",
      description: "Veshjet më të fundit për 2025",
      icon: <ShoppingBag className="h-10 w-10" />,
      bgColor: "from-purple-500 to-purple-700",
      textColor: "text-white",
      cta: "Shiko koleksionin"
    }
  ];
  
  // Rotate through ads every 5 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setAdIndex((prevIndex) => (prevIndex + 1) % advertisements.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [advertisements.length]);
  
  const currentAd = advertisements[adIndex];

  return (
    <div 
      className={`
        fixed ${position}-0 top-1/2 -translate-y-1/2 w-[160px] h-[600px]
        ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
        rounded-lg shadow-lg overflow-hidden mx-4
        transition-all duration-300 hover:scale-105 hover:shadow-xl
      `}
    >
      <div className="h-full flex flex-col">
        {/* Ad Label */}
        <div className={`text-center py-2 px-1 text-xs ${darkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-500 bg-gray-100'}`}>
          Reklamë
        </div>
        
        {/* Ad Content */}
        <div className="flex-1 flex flex-col">
          {/* Ad Header with Gradient */}
          <div className={`bg-gradient-to-r ${currentAd.bgColor} p-4 text-center ${currentAd.textColor}`}>
            <div className="flex justify-center mb-3">
              {currentAd.icon}
            </div>
            <h3 className="font-bold text-sm mb-1">{currentAd.title}</h3>
            <p className="text-xs opacity-90">{currentAd.description}</p>
          </div>
          
          {/* Ad Image */}
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <img 
              src={`https://images.unsplash.com/photo-${1500000000000 + adIndex * 1000000}?w=400&h=300&crop=entropy&fit=crop&q=80`} 
              alt="Ad Content"
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* Call to Action */}
          <div className="p-4 text-center">
            <button 
              className={`w-full py-2 px-3 rounded-lg font-medium text-sm
                bg-gradient-to-r ${currentAd.bgColor} ${currentAd.textColor}
                transition-transform duration-200 transform hover:scale-105 hover:shadow-md`}
            >
              {currentAd.cta}
            </button>
            
            <div className="mt-3 flex justify-center">
              {advertisements.map((_, i) => (
                <span 
                  key={i} 
                  className={`h-2 w-2 rounded-full mx-1 ${
                    i === adIndex 
                      ? 'bg-blue-500' 
                      : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
                ></span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Ad Footer */}
        <div className={`text-center py-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          partneri.com
        </div>
      </div>
    </div>
  );
};

export default Advertisement;