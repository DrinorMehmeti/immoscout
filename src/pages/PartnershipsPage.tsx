import React from 'react';
import { Handshake, Award, ArrowRight, CheckCircle, Building, Briefcase, TrendingUp, Shield, PieChart, Users, ChevronRight, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const PartnershipsPage: React.FC = () => {
  const { darkMode } = useTheme();

  // Beispielpartner für die Seite
  const partners = [
    {
      id: 1,
      name: 'BKT Bank',
      logo: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      type: 'Bankë',
      description: 'Ofron kredi hipotekare të dedikuara për klientët tanë me kushte preferenciale dhe norma të favorshme interesi.',
      website: 'https://www.bkt-ks.com',
    },
    {
      id: 2,
      name: 'ProCredit Bank',
      logo: 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      type: 'Bankë',
      description: 'Bashkëpunim për financimin e pronave të reja dhe të përdorura përmes kredive hipotekare me kushte të përshtatshme.',
      website: 'https://www.procreditbank-kos.com',
    },
    {
      id: 3,
      name: 'AXA Sigurimi',
      logo: 'https://images.unsplash.com/photo-1601581975053-7c899da7347e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      type: 'Sigurim',
      description: 'Sigurime të pronës me zbritje të veçanta për të gjithë klientët e platformës sonë, duke mbrojtur investimin tuaj.',
      website: 'https://www.axa.com',
    },
    {
      id: 4,
      name: 'Selmans Construction',
      logo: 'https://images.unsplash.com/photo-1622020457014-aed1cc44f25e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      type: 'Ndërtim',
      description: 'Kompani ndërtimi që ofron shërbime të plota për rinovimin dhe ndërtimin e pronave të reja dhe të vjetra.',
      website: 'https://www.selmansconstruction.com',
    },
    {
      id: 5,
      name: 'Interior Design Studio',
      logo: 'https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      type: 'Dizajn',
      description: 'Studio e specializuar në dizajnin e brendshëm që ndihmon klientët tanë të transformojnë ambientet e tyre në hapësira të përsosura.',
      website: 'https://www.interiordesignstudio.com',
    },
    {
      id: 6,
      name: 'Kosovo Notary Association',
      logo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      type: 'Ligjore',
      description: 'Shërbime notariale të dedikuara për finalizimin e transaksioneve të pronës, duke garantuar siguri juridike në çdo hap.',
      website: 'https://www.notary-ks.org',
    },
  ];

  // Kategoritë e partneritetit
  const partnershipCategories = [
    { name: 'Banka dhe Financa', icon: <Building className="h-6 w-6" /> },
    { name: 'Ndërtim dhe Renovim', icon: <Briefcase className="h-6 w-6" /> },
    { name: 'Sigurime', icon: <Shield className="h-6 w-6" /> },
    { name: 'Shërbime Juridike', icon: <Award className="h-6 w-6" /> },
    { name: 'Marketing dhe Media', icon: <TrendingUp className="h-6 w-6" /> },
    { name: 'Dizajn dhe Dekorim', icon: <PieChart className="h-6 w-6" /> },
  ];

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen pt-24 pb-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block p-3 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <Handshake className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-extrabold mb-4">Bashkëpunimet</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-500 dark:text-gray-400">
            Partnerët tanë të besueshëm që na ndihmojnë të ofrojmë një përvojë të plotë për klientët tanë në çdo hap të udhëtimit të tyre në patundshmëri.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="mb-20">
          <h2 className={`text-2xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>Partnerët tanë strategjikë</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map(partner => (
              <div key={partner.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl`}>
                <div className="h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-4">
                  {partner.logo ? (
                    <img 
                      src={partner.logo} 
                      alt={partner.name} 
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                      {partner.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {partner.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {partner.type}
                    </span>
                  </div>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {partner.description}
                  </p>
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center text-sm font-medium ${
                      darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    <span>Vizito faqen</span>
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership Categories */}
        <div className="mb-20">
          <h2 className={`text-2xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Llojet e partneritetit
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partnershipCategories.map((category, index) => (
              <div 
                key={index}
                className={`p-6 rounded-xl shadow-md ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                } transition-colors`}
              >
                <div className={`h-12 w-12 rounded-full ${
                  darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
                } flex items-center justify-center mb-4`}>
                  {category.icon}
                </div>
                <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {category.name}
                </h3>
                <Link 
                  to="/kontakt"
                  className={`flex items-center text-sm font-medium ${
                    darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  <span>Mëso më shumë</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Përfitimet e partneritetit
                </h2>
                <div className="space-y-4">
                  <div className="flex">
                    <CheckCircle className={`h-6 w-6 ${darkMode ? 'text-green-400' : 'text-green-500'} mr-3 flex-shrink-0`} />
                    <div>
                      <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Shtrirje më e madhe
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Arrini mijëra klientë potencialë përmes platformës sonë me trafik të lartë
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <CheckCircle className={`h-6 w-6 ${darkMode ? 'text-green-400' : 'text-green-500'} mr-3 flex-shrink-0`} />
                    <div>
                      <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Besueshmëria e markës
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Përfitoni nga reputacioni ynë i besueshëm në tregun e patundshmërive
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <CheckCircle className={`h-6 w-6 ${darkMode ? 'text-green-400' : 'text-green-500'} mr-3 flex-shrink-0`} />
                    <div>
                      <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Klientë të dedikuar
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Klientë të targetuar që janë aktivë në procesin e blerjes ose qiradhënies së pronës
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <CheckCircle className={`h-6 w-6 ${darkMode ? 'text-green-400' : 'text-green-500'} mr-3 flex-shrink-0`} />
                    <div>
                      <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Mundësi marketingu
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Promovim i shërbimeve tuaja përmes kanaleve tona të komunikimit
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
                  alt="Partnership Benefits" 
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* How to Become a Partner Section */}
        <div className="mb-20">
          <h2 className={`text-2xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Si të bëheni partner
          </h2>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 text-center`}>
              <div className={`h-16 w-16 rounded-full ${
                darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
              } flex items-center justify-center mx-auto mb-4`}>
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Kontaktoni ne</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                Na dërgoni një kërkesë përmes formularit të kontaktit ose na kontaktoni direkt
              </p>
              <Link 
                to="/kontakt" 
                className={`inline-block text-sm font-medium ${
                  darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                Shko te kontakti
                <ArrowRight className="inline-block ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 text-center`}>
              <div className={`h-16 w-16 rounded-full ${
                darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
              } flex items-center justify-center mx-auto mb-4`}>
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Diskutimi i kushteve</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                Takohemi për të diskutuar detajet e partneritetit dhe për të gjetur zgjidhjen ideale
              </p>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 text-center`}>
              <div className={`h-16 w-16 rounded-full ${
                darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
              } flex items-center justify-center mx-auto mb-4`}>
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Aktivizimi i partneritetit</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                Formalizojmë marrëdhënien dhe fillojmë të punojmë së bashku për të arritur objektivat
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mb-10">
          <div className={`${
            darkMode ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
          } rounded-xl shadow-lg p-10 text-white text-center`}>
            <h2 className="text-3xl font-bold mb-4">Të bëhemi partnerë</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Jemi të hapur për partneritete të reja që mund të sjellin vlerë shtesë për klientët tanë. 
              Kontaktoni me ne sot për të diskutuar mundësitë e bashkëpunimit.
            </p>
            <Link
              to="/kontakt"
              className="inline-block bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-lg font-bold text-lg shadow-lg transition-colors"
            >
              Na kontaktoni
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className={`text-2xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Pyetje të shpeshta
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Çfarë lloj partneriteti ofron platforma?
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Ofrojmë disa lloje partneritetesh, përfshirë partneritetet financiare, ligjore, ndërtimore dhe të marketingut. 
                Secili partneritet është i dizajnuar për të plotësuar nevojat e klientëve tanë dhe për të ofruar vlerë për të gjithë.
              </p>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Sa kushton një partneritet?
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Çmimi i partneritetit varet nga lloji dhe shkalla e bashkëpunimit. Ne ofrojmë plane të ndryshme që i përshtaten 
                nevojave të ndryshme të biznesit. Kontaktoni me ne për detaje specifike të çmimeve.
              </p>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Si mund të promovoj shërbimet e mia në platformë?
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Si partner, ju keni qasje në disa kanale promocionale, përfshirë listimin në faqen tonë të partnerëve, 
                rekomandimet për klientët përkatës dhe mundësi të dedikuara marketingu në platformën tonë.
              </p>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Sa zgjat një marrëveshje partneriteti?
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Partneritetet tona tipike janë të bazuara në kontrata vjetore, por ofrojmë edhe fleksibilitet për të plotësuar 
                nevojat tuaja specifike. Kontrata mund të rinovohet bazuar në performancën dhe interesimin e përbashkët.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnershipsPage;