import React, { useState } from 'react';
import { Search, MapPin, Building, Home } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sale' | 'rent'>('sale');
  
  return (
    <div className="relative bg-blue-800 text-white">
      <div 
        className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')" 
        }}
      ></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            RealEstate Kosovo
          </h1>
          <p className="mt-4 md:mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl">
            Platforma më e madhe e patundshmërive në Kosovë me mijëra prona për shitje dhe qiradhënie
          </p>
        </div>

        {/* Search Container */}
        <div className="mt-8 md:mt-10 bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex border-b">
            <button 
              className={`flex-1 px-6 py-4 text-center font-medium text-lg transition-colors ${
                activeTab === 'sale' 
                  ? 'text-blue-600 border-b-2 border-blue-500 bg-white' 
                  : 'text-gray-600 hover:text-gray-900 bg-gray-50'
              }`}
              onClick={() => setActiveTab('sale')}
            >
              Në shitje
            </button>
            <button 
              className={`flex-1 px-6 py-4 text-center font-medium text-lg transition-colors ${
                activeTab === 'rent' 
                  ? 'text-blue-600 border-b-2 border-blue-500 bg-white' 
                  : 'text-gray-600 hover:text-gray-900 bg-gray-50'
              }`}
              onClick={() => setActiveTab('rent')}
            >
              Me qira
            </button>
          </div>

          {/* Search Form */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Where */}
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Ku?</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Qyteti, rajoni..." 
                    className="pl-10 pr-4 py-2.5 w-full rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Çmimi deri në</label>
                <div className="relative">
                  <select className="pl-3 pr-10 py-2.5 w-full rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none">
                    <option value="">Të gjitha çmimet</option>
                    <option value="50000">deri 50,000 €</option>
                    <option value="100000">deri 100,000 €</option>
                    <option value="150000">deri 150,000 €</option>
                    <option value="200000">deri 200,000 €</option>
                    <option value="300000">deri 300,000 €</option>
                    <option value="500000">deri 500,000 €</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Rooms */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Dhoma nga</label>
                <div className="relative">
                  <select className="pl-3 pr-10 py-2.5 w-full rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none">
                    <option value="">Të gjitha</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Property Type - Mobile Only */}
              <div className="md:hidden">
                <label className="block text-xs font-medium text-gray-500 mb-1">Lloji i pronës</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <select className="pl-10 pr-10 py-2.5 w-full rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none">
                    <option value="">Të gjitha llojet</option>
                    <option value="apartment">Banesë</option>
                    <option value="house">Shtëpi</option>
                    <option value="land">Tokë</option>
                    <option value="commercial">Lokal</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Search Button - Full Width on Mobile, Row Specific on Desktop */}
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-3 transition-colors flex items-center justify-center">
                  <Search className="h-5 w-5 mr-2" />
                  Kërko
                </button>
              </div>
            </div>

            {/* Desktop Property Types */}
            <div className="hidden md:flex mt-6 flex-wrap gap-3">
              <div className="flex items-center">
                <input
                  id="all"
                  name="property-type"
                  type="radio"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="all" className="ml-2 text-gray-700">
                  Të gjitha
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="apartment"
                  name="property-type"
                  type="radio"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="apartment" className="ml-2 text-gray-700">
                  Banesë
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="house"
                  name="property-type"
                  type="radio"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="house" className="ml-2 text-gray-700">
                  Shtëpi
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="land"
                  name="property-type"
                  type="radio"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="land" className="ml-2 text-gray-700">
                  Tokë
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="commercial"
                  name="property-type"
                  type="radio"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="commercial" className="ml-2 text-gray-700">
                  Lokal
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;