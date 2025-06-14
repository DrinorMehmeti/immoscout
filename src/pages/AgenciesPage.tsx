import React, { useState, useEffect } from 'react';
import { MapPin, Search, Star, Filter, ExternalLink, Mail, Phone, Building, Users, Calendar, Home, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';

// Interface für Agentur-Daten
interface Agency {
  id: string;
  name: string;
  logo?: string;
  description: string;
  location: string;
  phone: string;
  email: string;
  website?: string;
  rating: number;
  agentCount: number;
  propertyCount: number;
  yearFounded: number;
  specialties: string[];
  isPremium: boolean;
  verified: boolean;
}

const AgenciesPage: React.FC = () => {
  const { darkMode } = useTheme();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    setLoading(true);
    try {
      // In einer echten Anwendung würde hier ein tatsächlicher Supabase-Aufruf stehen
      // Für Demo-Zwecke verwenden wir Mockdaten
      
      // const { data, error } = await supabase
      //   .from('agencies')
      //   .select('*');
      
      // if (error) throw error;
      // setAgencies(data || []);
      
      // Mockdaten für Demonstrationszwecke
      const mockAgencies: Agency[] = [
        {
          id: '1',
          name: 'Realty Partners',
          logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          description: 'Realty Partners ofron një gamë të gjerë të shërbimeve në fushën e patundshmërisë, duke përfshirë blerjen, shitjen dhe qiradhënien e pronave. Me një ekip të specializuar dhe me përvojë, ne ofrojmë zgjidhje të personalizuara për klientët tanë.',
          location: 'Prishtinë',
          phone: '+383 44 123 456',
          email: 'info@realtypartners.com',
          website: 'www.realtypartners.com',
          rating: 4.8,
          agentCount: 12,
          propertyCount: 85,
          yearFounded: 2010,
          specialties: ['Banim', 'Komerciale', 'Luksoz'],
          isPremium: true,
          verified: true
        },
        {
          id: '2',
          name: 'Kosovo Properties',
          logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          description: 'Që nga viti 2015, Kosovo Properties ka ndihmuar qindra familje të gjejnë shtëpinë e tyre të ëndrrave. Specializohemi në prona të larta dhe investime në patundshmëri në të gjithë Kosovën.',
          location: 'Prishtinë',
          phone: '+383 45 234 567',
          email: 'info@kosovoproperties.com',
          rating: 4.5,
          agentCount: 8,
          propertyCount: 63,
          yearFounded: 2015,
          specialties: ['Banim', 'Investime'],
          isPremium: false,
          verified: true
        },
        {
          id: '3',
          name: 'Prizren Real Estate',
          logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          description: 'Prizren Real Estate është agjencia lider në rajonin e Prizrenit. Ne ofrojmë shërbime profesionale për blerjen, shitjen dhe qiradhënien e pronave rezidenciale dhe komerciale.',
          location: 'Prizren',
          phone: '+383 49 345 678',
          email: 'info@prizrenrealestate.com',
          website: 'www.prizrenrealestate.com',
          rating: 4.7,
          agentCount: 6,
          propertyCount: 42,
          yearFounded: 2018,
          specialties: ['Banim', 'Komerciale', 'Historike'],
          isPremium: true,
          verified: true
        },
        {
          id: '4',
          name: 'Peja Homes',
          description: 'Agjenci e specializuar për pronësi në rajonin e Pejës dhe rrethinë, me fokus të veçantë në shtëpi individuale dhe prona turistike.',
          location: 'Pejë',
          phone: '+383 44 456 789',
          email: 'kontakt@pejahomes.com',
          rating: 4.2,
          agentCount: 4,
          propertyCount: 35,
          yearFounded: 2019,
          specialties: ['Banim', 'Turistike'],
          isPremium: false,
          verified: true
        },
        {
          id: '5',
          name: 'Mitrovica Realty',
          logo: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          description: 'Mitrovica Realty është agjencia kryesore në Mitrovicë, duke ofruar shërbime për të gjitha llojet e pronave, me specializim në objekte komerciale dhe industriale.',
          location: 'Mitrovicë',
          phone: '+383 49 567 890',
          email: 'info@mitrovicarealty.com',
          rating: 4.3,
          agentCount: 5,
          propertyCount: 28,
          yearFounded: 2016,
          specialties: ['Komerciale', 'Industriale'],
          isPremium: false,
          verified: true
        },
        {
          id: '6',
          name: 'Luxury Kosovo',
          logo: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          description: 'Specializuar ekskluzivisht në pronësi luksoze në të gjithë Kosovën. Ne ofrojmë shërbime të personalizuara për klientët më kërkues, me një qasje diskrete dhe profesionale.',
          location: 'Prishtinë',
          phone: '+383 44 678 901',
          email: 'vip@luxurykosovo.com',
          website: 'www.luxurykosovo.com',
          rating: 4.9,
          agentCount: 7,
          propertyCount: 24,
          yearFounded: 2017,
          specialties: ['Luksoz', 'VIP'],
          isPremium: true,
          verified: true
        },
        {
          id: '7',
          name: 'Commercial Spaces',
          description: 'Commercial Spaces është agjenci e specializuar në hapësirat komerciale, duke ofruar zgjidhje për zyra, dyqane, restorante dhe hapësira industriale në të gjithë Kosovën.',
          location: 'Prishtinë',
          phone: '+383 45 789 012',
          email: 'info@commercialspaces.com',
          rating: 4.6,
          agentCount: 9,
          propertyCount: 47,
          yearFounded: 2014,
          specialties: ['Komerciale', 'Zyra', 'Retail'],
          isPremium: true,
          verified: true
        },
        {
          id: '8',
          name: 'Gjakova Properties',
          description: 'Agjenci lokale në Gjakovë me njohuri të thellë të tregut lokal. Ofrojmë shërbime cilësore për blerjen, shitjen dhe menaxhimin e pronave në qytetin e Gjakovës dhe rrethinë.',
          location: 'Gjakovë',
          phone: '+383 49 890 123',
          email: 'info@gjakovaproperties.com',
          rating: 4.4,
          agentCount: 3,
          propertyCount: 19,
          yearFounded: 2020,
          specialties: ['Banim', 'Toka'],
          isPremium: false,
          verified: true
        }
      ];

      setAgencies(mockAgencies);
      setFilteredAgencies(mockAgencies);
    } catch (err) {
      console.error('Error fetching agencies:', err);
      setError('Ndodhi një gabim gjatë ngarkimit të agjencive');
    } finally {
      setLoading(false);
    }
  };

  // Filter agencies based on search query and filters
  useEffect(() => {
    if (agencies.length === 0) return;

    let filtered = [...agencies];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        agency => 
          agency.name.toLowerCase().includes(query) ||
          agency.description.toLowerCase().includes(query) ||
          agency.location.toLowerCase().includes(query)
      );
    }

    // Apply location filter
    if (locationFilter) {
      filtered = filtered.filter(agency => agency.location === locationFilter);
    }

    // Apply specialty filter
    if (specialtyFilter) {
      filtered = filtered.filter(agency => 
        agency.specialties.includes(specialtyFilter)
      );
    }

    setFilteredAgencies(filtered);
  }, [agencies, searchQuery, locationFilter, specialtyFilter]);

  // Get unique locations from agencies
  const getUniqueLocations = () => {
    const locations = agencies.map(agency => agency.location);
    return [...new Set(locations)];
  };

  // Get unique specialties from agencies
  const getUniqueSpecialties = () => {
    const specialties = agencies.flatMap(agency => agency.specialties);
    return [...new Set(specialties)];
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen pt-24 pb-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="text-center mb-10">
          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Agjencitë e Patundshmërive
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Zgjidhni nga agjencitë më të besuara në Kosovë. Këto agjenci ofrojnë shërbime cilësore dhe kanë ekspertizë në tregun e patundshmërive.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-10`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Search Input */}
            <div className="col-span-1 md:col-span-3 mb-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Kërkoni agjenci sipas emrit ose përshkrimit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  } border focus:ring-blue-500 focus:border-blue-500`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <label htmlFor="location" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Qyteti
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                </div>
                <select
                  id="location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className={`w-full pl-10 pr-10 py-3 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } border focus:ring-blue-500 focus:border-blue-500 appearance-none`}
                >
                  <option value="">Të gjitha qytetet</option>
                  {getUniqueLocations().map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Specialty Filter */}
            <div>
              <label htmlFor="specialty" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Specializimi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                </div>
                <select
                  id="specialty"
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  className={`w-full pl-10 pr-10 py-3 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } border focus:ring-blue-500 focus:border-blue-500 appearance-none`}
                >
                  <option value="">Të gjitha specializimet</option>
                  {getUniqueSpecialties().map((specialty) => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex justify-end items-center">
              <label className={`text-sm font-medium mr-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Shfaqja:
              </label>
              <div className={`flex border ${darkMode ? 'border-gray-700' : 'border-gray-300'} rounded-lg overflow-hidden`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${
                    viewMode === 'grid' 
                      ? darkMode 
                        ? 'bg-gray-700 text-blue-400' 
                        : 'bg-blue-50 text-blue-600' 
                      : darkMode 
                        ? 'text-gray-400 hover:bg-gray-700' 
                        : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  aria-label="Grid view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${
                    viewMode === 'list' 
                      ? darkMode 
                        ? 'bg-gray-700 text-blue-400' 
                        : 'bg-blue-50 text-blue-600' 
                      : darkMode 
                        ? 'text-gray-400 hover:bg-gray-700' 
                        : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  aria-label="List view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Agencies Display */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className={`text-center py-12 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
            <p>{error}</p>
            <button 
              onClick={() => fetchAgencies()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Provo përsëri
            </button>
          </div>
        ) : filteredAgencies.length === 0 ? (
          <div className="text-center py-12">
            <Building className={`h-12 w-12 ${darkMode ? 'text-gray-400' : 'text-gray-400'} mx-auto mb-4`} />
            <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nuk u gjet asnjë agjenci</h3>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Provoni të ndryshoni filtrat tuaj të kërkimit</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgencies.map((agency) => (
              <div 
                key={agency.id} 
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden ${
                  agency.isPremium ? 'ring-2 ring-yellow-400' : ''
                }`}
              >
                {/* Agency Logo/Image */}
                <div className="relative h-40 bg-gradient-to-r from-blue-500 to-blue-700">
                  {agency.logo ? (
                    <img 
                      src={agency.logo} 
                      alt={agency.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building className="h-16 w-16 text-white" />
                    </div>
                  )}
                  
                  {agency.isPremium && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-yellow-900" /> Premium
                    </div>
                  )}
                </div>
                
                {/* Agency Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {agency.name}
                    </h3>
                    <div className="flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-sm">
                      <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                      <span>{agency.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm mb-3">
                    <MapPin className={`h-4 w-4 mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{agency.location}</span>
                  </div>
                  
                  <p className={`text-sm mb-4 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {agency.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {agency.specialties.map((specialty, idx) => (
                      <span 
                        key={idx} 
                        className={`text-xs px-2 py-1 rounded-full ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  
                  <div className={`grid grid-cols-3 gap-2 mb-4 text-center text-xs ${
                    darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-50 text-gray-700'
                  } p-2 rounded-lg`}>
                    <div>
                      <div className="font-bold text-blue-600 dark:text-blue-400">{agency.propertyCount}</div>
                      <div>Prona</div>
                    </div>
                    <div>
                      <div className="font-bold text-blue-600 dark:text-blue-400">{agency.agentCount}</div>
                      <div>Agjentë</div>
                    </div>
                    <div>
                      <div className="font-bold text-blue-600 dark:text-blue-400">{agency.yearFounded}</div>
                      <div>Themeluar</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Mail className={`h-4 w-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <a href={`mailto:${agency.email}`} className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                        {agency.email}
                      </a>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className={`h-4 w-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <a href={`tel:${agency.phone}`} className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                        {agency.phone}
                      </a>
                    </div>
                    
                    {agency.website && (
                      <div className="flex items-center">
                        <ExternalLink className={`h-4 w-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <a 
                          href={`https://${agency.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                        >
                          {agency.website}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Shiko pronat
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAgencies.map((agency) => (
              <div 
                key={agency.id} 
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden ${
                  agency.isPremium ? 'ring-2 ring-yellow-400' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Agency Logo/Image */}
                  <div className="md:w-1/4 relative">
                    {agency.logo ? (
                      <img 
                        src={agency.logo} 
                        alt={agency.name} 
                        className="w-full h-40 md:h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 md:h-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
                        <Building className="h-16 w-16 text-white" />
                      </div>
                    )}
                    
                    {agency.isPremium && (
                      <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-yellow-900" /> Premium
                      </div>
                    )}
                  </div>
                  
                  {/* Agency Details */}
                  <div className="md:w-3/4 p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mr-3`}>
                            {agency.name}
                          </h3>
                          <div className="flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-sm">
                            <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                            <span>{agency.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm">
                          <MapPin className={`h-4 w-4 mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{agency.location}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 md:mt-0 flex flex-wrap gap-2">
                        {agency.specialties.map((specialty, idx) => (
                          <span 
                            key={idx} 
                            className={`text-xs px-2 py-1 rounded-full ${
                              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {agency.description}
                    </p>
                    
                    <div className="flex flex-wrap justify-between mb-4">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                          <Home className={`h-5 w-5 mr-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <b>{agency.propertyCount}</b> prona
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <Users className={`h-5 w-5 mr-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <b>{agency.agentCount}</b> agjentë
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <Calendar className={`h-5 w-5 mr-1 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Themeluar në <b>{agency.yearFounded}</b>
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-3 md:mt-0">
                        <button 
                          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                        >
                          <Building className="h-4 w-4 mr-2" />
                          Shiko pronat
                        </button>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4">
                      <div className="flex items-center">
                        <Mail className={`h-4 w-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <a href={`mailto:${agency.email}`} className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                          {agency.email}
                        </a>
                      </div>
                      
                      <div className="flex items-center">
                        <Phone className={`h-4 w-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <a href={`tel:${agency.phone}`} className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                          {agency.phone}
                        </a>
                      </div>
                      
                      {agency.website && (
                        <div className="flex items-center">
                          <ExternalLink className={`h-4 w-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <a 
                            href={`https://${agency.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                          >
                            {agency.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Join as Agency CTA */}
        <div className="mt-16">
          <div className={`${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-xl shadow-lg overflow-hidden`}>
            <div className="md:flex">
              <div className="md:flex-1 p-8">
                <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Jeni një agjenci e patundshmërive?
                </h2>
                <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Bashkohuni me platformën tonë për të promovuar pronat tuaja dhe për të arritur klientët e interesuar. 
                  Ofertat tona premium ju japin prioritet në listim dhe veçori të avancuara.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`h-6 w-6 rounded-full ${
                        darkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600'
                      } flex items-center justify-center font-bold`}>1</div>
                    </div>
                    <div className="ml-3">
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Regjistrohuni si agjenci</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Krijoni një llogari të dedikuar për agjencinë tuaj
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`h-6 w-6 rounded-full ${
                        darkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600'
                      } flex items-center justify-center font-bold`}>2</div>
                    </div>
                    <div className="ml-3">
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Ngarkoni portfolio-n tuaj</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Shtoni pronat tuaja dhe detajet e agjencisë
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`h-6 w-6 rounded-full ${
                        darkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600'
                      } flex items-center justify-center font-bold`}>3</div>
                    </div>
                    <div className="ml-3">
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Filloni të merrni klientë</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Lidhuni me klientët e interesuar direkt në platformë
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                    Regjistrohu si agjenci
                  </button>
                </div>
              </div>
              <div className="md:w-2/5 bg-blue-700 flex items-center justify-center p-8 hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
                  alt="Real Estate Agency" 
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Benefits Section */}
        <div className="mt-16">
          <h2 className={`text-2xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Përfitimet e partneritetit me ne
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 text-center`}>
              <div className={`h-16 w-16 mx-auto mb-4 rounded-full ${
                darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'
              } flex items-center justify-center`}>
                <Users className="h-8 w-8" />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Audiencë e gjerë
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Arrini mijëra klientë potencialë që kërkojnë aktivitisht prona në platformën tonë.
              </p>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 text-center`}>
              <div className={`h-16 w-16 mx-auto mb-4 rounded-full ${
                darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
              } flex items-center justify-center`}>
                <Star className="h-8 w-8" />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Veçori Premium
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Përfitoni nga listat e theksuara, analitikat e avancuara dhe mjetet për menaxhimin e pronave.
              </p>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 text-center`}>
              <div className={`h-16 w-16 mx-auto mb-4 rounded-full ${
                darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'
              } flex items-center justify-center`}>
                <Clock className="h-8 w-8" />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Kurseni kohë
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Sistemi ynë i automatizuar i menaxhon kërkesat dhe organizon takimet, duke ju lejuar të fokusoheni në biznesin tuaj.
              </p>
            </div>
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="mt-16">
          <h2 className={`text-2xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Çfarë thonë agjencitë tona partnere
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <div className="flex items-center mb-4">
                <div className={`h-12 w-12 rounded-full ${
                  darkMode ? 'bg-blue-600' : 'bg-blue-500'
                } flex items-center justify-center text-white font-bold text-lg mr-4`}>
                  RP
                </div>
                <div>
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Realty Partners</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Agjenci premium që nga 2021</p>
                </div>
              </div>
              <p className={`italic text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                "Që kur u bëmë partner me RealEstate Kosovo, kemi parë një rritje të dukshme në kërkesat për prona. 
                Platforma është e thjeshtë për t'u përdorur dhe stafi mbështetës është gjithmonë i gatshëm për të ndihmuar."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className="h-5 w-5 text-yellow-500 fill-yellow-500" 
                  />
                ))}
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <div className="flex items-center mb-4">
                <div className={`h-12 w-12 rounded-full ${
                  darkMode ? 'bg-green-600' : 'bg-green-500'
                } flex items-center justify-center text-white font-bold text-lg mr-4`}>
                  LK
                </div>
                <div>
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Luxury Kosovo</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Agjenci premium që nga 2020</p>
                </div>
              </div>
              <p className={`italic text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                "Fokusi ynë në prona luksoze përshtatet perfekt me opsionet premium që ofron platforma. 
                Aftësia për të nxjerrë në pah listat tona dhe për të marrë të dhëna analitike ka qenë një avantazh i madh për biznesin tonë."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className="h-5 w-5 text-yellow-500 fill-yellow-500" 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgenciesPage;