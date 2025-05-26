import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ShoppingBag, Home, Car, Coffee, Gift, Bookmark, Star, CreditCard, Zap } from 'lucide-react';

interface AdvertisementProps {
  position: 'left' | 'right';
}

const Advertisement: React.FC<AdvertisementProps> = ({ position }) => {
  const { darkMode } = useTheme();
  const [adIndex, setAdIndex] = useState(0);
  
  // Sample advertisement data
  const advertisements = [
    {
      title: "Shtëpi të reja",
      description: "Financim deri në 20 vjet",
      icon: <Home className="h-8 w-8" />,
      bgColor: "from-blue-500 to-blue-700",
      textColor: "text-white",
      cta: "Zbulo më shumë"
    },
    {
      title: "Vetura të reja",
      description: "Financim me 0% interes",
      icon: <Car className="h-8 w-8" />,
      bgColor: "from-green-500 to-green-700",
      textColor: "text-white",
      cta: "Rezervo test drive"
    },
    {
      title: "Premium Kafeja",
      description: "Blej 2, merr 1 falas",
      icon: <Coffee className="h-8 w-8" />,
      bgColor: "from-amber-500 to-amber-700",
      textColor: "text-white",
      cta: "Porosit tani"
    },
    {
      title: "Dhurata për të gjithë",
      description: "20% zbritje në koleksionin e ri",
      icon: <Gift className="h-8 w-8" />,
      bgColor: "from-purple-500 to-purple-700",
      textColor: "text-white",
      cta: "Blej online"
    }
  ];
  
  // Rotate through ads every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAdIndex((prevIndex) => (prevIndex + 1) % advertisements.length);
    }, 7000);
    
    return () => clearInterval(timer);
  }, [advertisements.length]);
  
  // Get current advertisement
  const currentAd = advertisements[adIndex];

  // Generate random image for each ad to make them look unique
  const getRandomImage = (index: number) => {
    const imageIds = [
      "1565060169179-b3aec37bd78c",
      "1472851294608-062f824d29cc", 
      "1484154218962-a197022b5858",
      "1505022610485-0dab70db6fba"
    ];
    
    return `https://images.unsplash.com/photo-${imageIds[index % imageIds.length]}?auto=format&fit=crop&w=300&q=80`;
  };

  // Calculate the position based on the viewport width
  const getAdPosition = () => {
    if (position === 'left') {
      return {
        left: 'calc(50% - 700px)',
        transform: 'translateX(-100%)',
        marginLeft: '-40px'
      };
    } else {
      return {
        right: 'calc(50% - 700px)', 
        transform: 'translateX(100%)',
        marginRight: '-40px'
      };
    }
  };

  return (
    <div className={`
      fixed top-[200px] z-20
      w-[140px]
      ${darkMode ? 'bg-gray-800' : 'bg-white'}
      border ${darkMode ? 'border-gray-700' : 'border-gray-200'}
      rounded-lg shadow-lg overflow-hidden
      transition-all duration-300
    `}
    style={{
      position: 'fixed',
      top: '200px',
      ...getAdPosition()
    }}>
      {/* Ad Label */}
      <div className={`text-center py-1 text-xs ${darkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-500 bg-gray-100'}`}>
        Reklamë
      </div>
      
      {/* Ad Content */}
      <div className="flex flex-col h-[500px]">
        {/* Gradient Header */}
        <div className={`bg-gradient-to-r ${currentAd.bgColor} p-4 text-center ${currentAd.textColor}`}>
          <div className="inline-flex items-center justify-center p-2 bg-white/20 rounded-full mb-3">
            {currentAd.icon}
          </div>
          <h3 className="font-bold text-sm mb-1">{currentAd.title}</h3>
          <p className="text-xs opacity-90">{currentAd.description}</p>
        </div>
        
        {/* Ad Image */}
        <div className="flex-1 flex items-center justify-center p-2">
          <div className="w-full h-[200px] overflow-hidden rounded-lg">
            <img 
              src={getRandomImage(adIndex)}
              alt="Ad Content"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="p-3 text-center">
          <button 
            className={`
              w-full py-2 px-2 rounded-lg text-sm font-medium
              bg-gradient-to-r ${currentAd.bgColor} ${currentAd.textColor}
              shadow transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5
            `}
          >
            {currentAd.cta}
          </button>
          
          {/* Ad Navigation Dots */}
          <div className="mt-3 flex justify-center">
            {advertisements.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setAdIndex(i)}
                className={`
                  h-2 w-2 mx-1 rounded-full transition-all duration-300
                  ${i === adIndex 
                    ? 'bg-blue-500 scale-125' 
                    : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }
                `}
                aria-label={`Advertisement ${i+1}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Promotion Section */}
      <div className={`p-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
              <Bookmark className="h-3 w-3 inline mr-1" />
              Kurseni
            </span>
            <span className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>
              15%
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
              <Star className="h-3 w-3 inline mr-1" />
              Vlerësimet
            </span>
            <span className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>
              4.8/5
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
              <CreditCard className="h-3 w-3 inline mr-1" />
              Pagesa
            </span>
            <span className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>
              Të sigurta
            </span>
          </div>
        </div>
        
        <div className={`mt-3 text-center text-xs ${darkMode ? "text-blue-400" : "text-blue-600"} font-medium`}>
          <a href="#" className="inline-flex items-center">
            <Zap className="h-3 w-3 mr-1" />
            Merr ofertën tani
          </a>
        </div>
      </div>
    </div>
  );
};

export default Advertisement;