import React from 'react';
import { Search, MapPin, Building, Home } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="relative bg-blue-800 text-white">
      <div 
        className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')" 
        }}
      ></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Drinori+
          </h1>
          <p className="mt-4 md:mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl">
            Platforma më e madhe e patundshmërive në Kosovë me mijëra prona për shitje dhe qiradhënie
          </p>
        </div>

        <div className="mt-6 md:mt-10 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <div className="pl-4 pr-2 py-2 text-gray-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Kërkoni me fjalë kyçe..."
                  className="w-full px-2 py-3 focus:outline-none text-gray-800"
                />
              </div>
              
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <div className="pl-4 pr-2 py-2 text-gray-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <select className="w-full px-2 py-3 focus:outline-none bg-white text-gray-800 appearance-none">
                  <option value="">Të gjitha lokacionet</option>
                  <option value="prishtine">Prishtinë</option>
                  <option value="prizren">Prizren</option>
                  <option value="peje">Pejë</option>
                  <option value="gjakove">Gjakovë</option>
                  <option value="ferizaj">Ferizaj</option>
                  <option value="mitrovice">Mitrovicë</option>
                  <option value="gjilan">Gjilan</option>
                </select>
              </div>
              
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <div className="pl-4 pr-2 py-2 text-gray-400">
                  <Building className="h-5 w-5" />
                </div>
                <select className="w-full px-2 py-3 focus:outline-none bg-white text-gray-800 appearance-none">
                  <option value="">Të gjitha llojet</option>
                  <option value="apartment">Banesë</option>
                  <option value="house">Shtëpi</option>
                  <option value="land">Tokë</option>
                  <option value="commercial">Lokal</option>
                </select>
              </div>
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center">
                <Search className="h-5 w-5 mr-2" />
                Kërko
              </button>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <input
                    id="sale"
                    type="radio"
                    name="listingType"
                    value="sale"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    defaultChecked
                  />
                  <label htmlFor="sale" className="ml-2 text-gray-700">
                    Në shitje
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="rent"
                    type="radio"
                    name="listingType"
                    value="rent"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="rent" className="ml-2 text-gray-700">
                    Me qira
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;