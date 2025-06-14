import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Shield, 
  Lock, 
  User, 
  Database, 
  Eye, 
  Share2, 
  AlertTriangle, 
  FileText, 
  Globe,
  Cookie, 
  Clock, 
  Mail,
  ChevronRight,
  ChevronDown,
  Info,
  CheckCircle,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPage: React.FC = () => {
  const { darkMode } = useTheme();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen pt-24 pb-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Politika e Privatësisë</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-500 dark:text-gray-400">
            Mësoni se si i mbledhim, përdorim dhe mbrojmë të dhënat tuaja personale në platformën tonë
          </p>
        </div>

        {/* Last Update Info */}
        <div className="flex items-center justify-center mb-8">
          <Clock className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Përditësuar së fundmi: 1 Dhjetor 2023
          </p>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Side Navigation (on wider screens) */}
          <div className="md:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 sticky top-24`}>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Përmbajtja
              </h2>
              <nav className="space-y-2">
                <a href="#overview" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <Info className="h-5 w-5 mr-3" />
                  Përmbledhje
                </a>
                <a href="#collection" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <Database className="h-5 w-5 mr-3" />
                  Mbledhja e të dhënave
                </a>
                <a href="#usage" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <Eye className="h-5 w-5 mr-3" />
                  Përdorimi i të dhënave
                </a>
                <a href="#sharing" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <Share2 className="h-5 w-5 mr-3" />
                  Ndarja e të dhënave
                </a>
                <a href="#rights" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <User className="h-5 w-5 mr-3" />
                  Të drejtat tuaja
                </a>
                <a href="#cookies" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <Cookie className="h-5 w-5 mr-3" />
                  Cookies dhe teknologjitë e gjurmimit
                </a>
                <a href="#security" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <Lock className="h-5 w-5 mr-3" />
                  Siguria
                </a>
                <a href="#changes" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <FileText className="h-5 w-5 mr-3" />
                  Ndryshimet në politikë
                </a>
                <a href="#contact" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <Mail className="h-5 w-5 mr-3" />
                  Kontakti
                </a>
              </nav>

              <div className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-800'}`}>
                <h3 className="font-medium mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  E rëndësishme
                </h3>
                <p className="text-sm mb-3">
                  Vazhdimi i përdorimit të platformës sonë do të thotë që ju pranoni këtë Politikë të Privatësisë.
                </p>
                <Link to="/kushtet-e-perdorimit" className="text-sm font-medium inline-flex items-center">
                  Shiko kushtet e përdorimit
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Overview Section */}
            <section id="overview" className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Info className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                Përmbledhje
              </h2>

              <div className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p className="mb-4">
                  Në RealEstate Kosovo, ne vlerësojmë privatësinë tuaj dhe jemi të përkushtuar për të mbrojtur të dhënat tuaja personale. 
                  Kjo politikë privatësie shpjegon se si mbledhim, përdorim dhe mbrojmë informacionin tuaj kur përdorni platformën tonë.
                </p>
                <p>
                  Ju inkurajojmë të lexoni me kujdes këtë politikë për të kuptuar qasjen tonë ndaj të dhënave tuaja 
                  dhe se si mund t'i përdorim ato për t'ju ofruar shërbime më të mira.
                </p>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-800'}`}>
                <p className="text-sm">
                  <strong>Përmbledhje e shkurtër:</strong> Ne mbledhim të dhëna për të përmirësuar përvojën tuaj, 
                  për të lehtësuar transaksionet e pronave dhe për të përmbushur detyrimet tona ligjore. Ne ndajmë 
                  të dhënat tuaja vetëm kur është e nevojshme për të ofruar shërbime ose kur kërkohet me ligj. 
                  Ju keni të drejtë të qaseni, të korrigjoni, të fshini ose të kufizoni përpunimin e të dhënave tuaja.
                </p>
              </div>
            </section>

            {/* Collection Section */}
            <section id="collection" className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Database className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                Mbledhja e të dhënave
              </h2>

              <div className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p className="mb-4">
                  Ne mbledhim të dhëna në disa mënyra kur ju përdorni platformën tonë. Këto të dhëna na ndihmojnë 
                  të sigurojmë një përvojë më të mirë për ju dhe të përmirësojmë shërbimet tona.
                </p>
              </div>

              <div className="space-y-4">
                <div onClick={() => toggleSection('personal')} className="cursor-pointer">
                  <div className={`flex justify-between items-center p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Të dhënat personale
                    </h3>
                    {activeSection === 'personal' ? (
                      <ChevronDown className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    ) : (
                      <ChevronRight className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </div>
                  {activeSection === 'personal' && (
                    <div className={`mt-2 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Kur regjistroheni ose përdorni shërbimet tona, mund të mbledhim të dhënat e mëposhtme:
                      </p>
                      <ul className={`list-disc pl-5 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <li>Emrin dhe mbiemrin</li>
                        <li>Adresën e email-it</li>
                        <li>Numrin e telefonit</li>
                        <li>Adresën postare</li>
                        <li>Detajet e llogarisë (username, fjalëkalimin e koduar)</li>
                        <li>Numrin e identifikimit personal (kur kërkohet për transaksione pronësore)</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div onClick={() => toggleSection('usage')} className="cursor-pointer">
                  <div className={`flex justify-between items-center p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Të dhënat e përdorimit
                    </h3>
                    {activeSection === 'usage' ? (
                      <ChevronDown className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    ) : (
                      <ChevronRight className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </div>
                  {activeSection === 'usage' && (
                    <div className={`mt-2 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Ne mbledhim të dhëna për mënyrën se si ndërveproni me platformën tonë, duke përfshirë:
                      </p>
                      <ul className={`list-disc pl-5 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <li>Pronat që shikoni ose kërkoni</li>
                        <li>Kohën që kaloni në faqe të ndryshme</li>
                        <li>Kërkesat tuaja të kërkimit dhe filtrat që përdorni</li>
                        <li>Veprimet që kryeni (p.sh., shtimi i një prone në listën e të preferuarave)</li>
                        <li>Pajisjet dhe shfletuesit që përdorni për të aksesuar platformën</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div onClick={() => toggleSection('property')} className="cursor-pointer">
                  <div className={`flex justify-between items-center p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Të dhënat e pronave
                    </h3>
                    {activeSection === 'property' ? (
                      <ChevronDown className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    ) : (
                      <ChevronRight className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </div>
                  {activeSection === 'property' && (
                    <div className={`mt-2 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Nëse listoni një pronë në platformën tonë, ne mbledhim informacion për:
                      </p>
                      <ul className={`list-disc pl-5 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <li>Adresën dhe vendndodhjen e pronës</li>
                        <li>Detajet dhe përshkrimin e pronës</li>
                        <li>Çmimin e pronës</li>
                        <li>Fotot dhe dokumentet e ngarkuara</li>
                        <li>Historinë e interaksionit (shikimet, mesazhet, ofertat)</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div onClick={() => toggleSection('automatic')} className="cursor-pointer">
                  <div className={`flex justify-between items-center p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Të dhënat e mbledhura automatikisht
                    </h3>
                    {activeSection === 'automatic' ? (
                      <ChevronDown className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    ) : (
                      <ChevronRight className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </div>
                  {activeSection === 'automatic' && (
                    <div className={`mt-2 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Kur përdorni platformën tonë, ne mbledhim automatikisht:
                      </p>
                      <ul className={`list-disc pl-5 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <li>Adresën IP dhe informacionin e vendndodhjes së përafërt</li>
                        <li>Llojin e pajisjes dhe shfletuesit</li>
                        <li>Sistemin operativ</li>
                        <li>Identifikuesit unikë të pajisjes</li>
                        <li>Informacionin e cookie-ve dhe teknologjive të ngjashme</li>
                        <li>Faqet referuese/daluese</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div onClick={() => toggleSection('third-party')} className="cursor-pointer">
                  <div className={`flex justify-between items-center p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Të dhënat nga palët e treta
                    </h3>
                    {activeSection === 'third-party' ? (
                      <ChevronDown className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    ) : (
                      <ChevronRight className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </div>
                  {activeSection === 'third-party' && (
                    <div className={`mt-2 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Ne mund të marrim të dhëna shtesë nga burime të treta, duke përfshirë:
                      </p>
                      <ul className={`list-disc pl-5 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <li>Shërbimet e autentifikimit social (nëse kyçeni përmes rrjeteve sociale)</li>
                        <li>Partnerët e biznesit, si bankat dhe shërbimet financiare</li>
                        <li>Shërbimet e verifikimit të identitetit</li>
                        <li>Regjistrat publikë të pasurive të paluajtshme</li>
                        <li>Furnizuesit e të dhënave demografike dhe marketing</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Usage Section */}
            <section id="usage" className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Eye className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                Përdorimi i të dhënave
              </h2>

              <div className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p className="mb-4">
                  Ne përdorim të dhënat që mbledhim për qëllime të ndryshme të lidhura me ofrimin dhe 
                  përmirësimin e shërbimeve tona, gjithmonë në përputhje me bazën ligjore për përpunimin e këtyre të dhënave.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Ofrimi i shërbimeve
                  </h3>
                  <ul className={`list-disc pl-5 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Për të krijuar dhe menaxhuar llogarinë tuaj</li>
                    <li>Për të mundësuar listimin, kërkimin dhe shikimin e pronave</li>
                    <li>Për të lehtësuar komunikimin midis blerësve/qiramarrësve dhe shitësve/qiradhënësve</li>
                    <li>Për të procesuar transaksionet dhe pagesat</li>
                    <li>Për të ofruar mbështetje për klientët</li>
                  </ul>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Përmirësimi i shërbimeve
                  </h3>
                  <ul className={`list-disc pl-5 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Për të analizuar dhe përmirësuar funksionalitetin e platformës</li>
                    <li>Për të zhvilluar veçori të reja dhe për të përmirësuar përvojën e përdoruesit</li>
                    <li>Për të matur efikasitetin e shërbimeve tona</li>
                    <li>Për të diagnostikuar probleme teknike</li>
                  </ul>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Marketing dhe komunikim
                  </h3>
                  <ul className={`list-disc pl-5 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Për t'ju dërguar njoftime për prona që mund t'ju interesojnë</li>
                    <li>Për t'ju informuar për veçori dhe oferta të reja</li>
                    <li>Për të personalizuar përmbajtjen dhe reklamat bazuar në preferencat tuaja</li>
                    <li>Për të kryer sondazhe dhe studime tregu</li>
                  </ul>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Siguria dhe përputhshmëria ligjore
                  </h3>
                  <ul className={`list-disc pl-5 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Për të verifikuar identitetin tuaj dhe për të parandaluar mashtrimet</li>
                    <li>Për të zbuluar dhe parandaluar aktivitetet e paligjshme në platformë</li>
                    <li>Për të mbrojtur sigurinë e platformës dhe përdoruesve të saj</li>
                    <li>Për të përmbushur detyrimet ligjore dhe rregullatore</li>
                    <li>Për të reaguar ndaj kërkesave ligjore dhe për të mbrojtur të drejtat tona ligjore</li>
                  </ul>
                </div>
              </div>

              <div className={`mt-6 p-4 border-l-4 ${darkMode ? 'border-yellow-500 bg-yellow-900/20 text-yellow-300' : 'border-yellow-500 bg-yellow-50 text-yellow-800'} rounded-r-lg`}>
                <h4 className="font-semibold mb-2 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-1" />
                  Baza ligjore për përpunimin
                </h4>
                <p className="text-sm">
                  Ne përpunojmë të dhënat tuaja vetëm kur kemi një bazë të vlefshme ligjore për ta bërë këtë, duke përfshirë:
                  <br />• Përmbushjen e kontratës me ju
                  <br />• Përmbushjen e detyrimeve tona ligjore
                  <br />• Kur kemi një interes legjitim biznesi që nuk tejkalon të drejtat dhe interesat tuaja
                  <br />• Kur kemi marrë pëlqimin tuaj
                </p>
              </div>
            </section>

            {/* Sharing Section */}
            <section id="sharing" className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Share2 className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                Ndarja e të dhënave
              </h2>

              <div className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p className="mb-4">
                  Ne e kuptojmë rëndësinë e privatësisë suaj dhe jemi të përkushtuar për të mbajtur të dhënat tuaja personale 
                  të sigurta. Megjithatë, në disa rrethana, ne mund të ndajmë të dhënat tuaja me palë të treta të besueshme.
                </p>
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Me kë i ndajmë të dhënat tuaja
                  </h3>
                  <ul className={`list-disc pl-5 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li><strong>Përdoruesit e tjerë:</strong> Kur listoni një pronë ose kontaktoni një shitës/qiradhënës, informacioni juaj i kontaktit mund të ndahet me palën tjetër për të lehtësuar komunikimin.</li>
                    <li><strong>Ofruesit e shërbimeve:</strong> Punojmë me kompani që na ndihmojnë të ofrojmë dhe përmirësojmë shërbimet tona (p.sh. hosting, procesimi i pagesave, marketingu).</li>
                    <li><strong>Partnerët e biznesit:</strong> Bankat, kompanitë e sigurimeve, noterët dhe partnerët e tjerë të biznesit që ndihmojnë në transaksionet e pronave.</li>
                    <li><strong>Autoritetet publike:</strong> Kur kërkohet me ligj, në përgjigje të procedurave ligjore, ose për të mbrojtur të drejtat tona.</li>
                    <li><strong>Blerësit e biznesit:</strong> Në rast të një shitjeje, bashkimi, riorganizimi, falimentimi ose ngjarje të ngjashme të korporatës.</li>
                  </ul>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Transferimet ndërkombëtare
                  </h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Disa nga ofruesit tanë të shërbimeve dhe partnerët mund të ndodhen jashtë Kosovës. Kur transferojmë të dhënat tuaja 
                    jashtë vendit, ne marrim masa për të siguruar që të dhënat tuaja të mbrohen në mënyrë adekuate dhe në përputhje me ligjet e 
                    aplikueshme të mbrojtjes së të dhënave. Këto masa mund të përfshijnë:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Përdorimin e marrëveshjeve standarde kontraktuale të aprovuara nga autoritetet përkatëse</li>
                      <li>Transferime në vende me rregullore adekuate të mbrojtjes së të dhënave</li>
                      <li>Marrjen e certifikimeve ose garancive të tjera nga partnerët tanë</li>
                    </ul>
                  </p>
                </div>
              </div>

              <div className={`mt-6 p-4 ${darkMode ? 'bg-green-900/20 border border-green-800 text-green-300' : 'bg-green-50 border border-green-200 text-green-800'} rounded-lg`}>
                <h4 className="flex items-center font-semibold mb-2">
                  <CheckCircle className="h-5 w-5 mr-1" />
                  Angazhimi ynë
                </h4>
                <p className="text-sm">
                  Ne i ndajmë të dhënat tuaja vetëm kur është e nevojshme për të ofruar dhe përmirësuar shërbimet 
                  tona, për të përmbushur detyrimet ligjore ose me pëlqimin tuaj. Ne nuk shesim kurrë të dhënat tuaja 
                  personale te palët e treta për qëllime marketingu.
                </p>
              </div>
            </section>

            {/* User Rights Section */}
            <section id="rights" className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <User className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                Të drejtat tuaja
              </h2>

              <div className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p className="mb-4">
                  Në përputhje me ligjet e zbatueshme për mbrojtjen e të dhënave, ju keni disa të drejta në lidhje me të dhënat tuaja personale.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Të drejtat e qasjes dhe informimit
                  </h3>
                  <ul className={`list-disc pl-5 space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>E drejta për të ditur nëse përpunojmë të dhënat tuaja</li>
                    <li>E drejta për të qasur të dhënat tuaja</li>
                    <li>E drejta për të marrë informacion për mënyrën e përpunimit</li>
                  </ul>
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Të drejtat e korrigjimit dhe fshirjes
                  </h3>
                  <ul className={`list-disc pl-5 space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>E drejta për të korrigjuar të dhënat e pasakta</li>
                    <li>E drejta për të plotësuar të dhënat e paplota</li>
                    <li>E drejta për të fshirë të dhënat ("e drejta për t'u harruar")</li>
                  </ul>
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Të drejtat e kufizimit dhe kundërshtimit
                  </h3>
                  <ul className={`list-disc pl-5 space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>E drejta për të kufizuar përpunimin</li>
                    <li>E drejta për të kundërshtuar përpunimin</li>
                    <li>E drejta për të tërhequr pëlqimin</li>
                  </ul>
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Të drejtat e bartjes dhe ankesës
                  </h3>
                  <ul className={`list-disc pl-5 space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>E drejta për të marrë dhe transferuar të dhënat tuaja</li>
                    <li>E drejta për të bërë ankesë te autoriteti mbikëqyrës</li>
                    <li>E drejta për mjete juridike efektive</li>
                  </ul>
                </div>
              </div>

              <div className={`p-4 ${darkMode ? 'bg-blue-900/20 border border-blue-800 text-blue-300' : 'bg-blue-50 border border-blue-200 text-blue-800'} rounded-lg`}>
                <h4 className="font-semibold mb-2">Si t'i ushtroni të drejtat tuaja</h4>
                <p className="text-sm mb-2">
                  Ju mund të ushtroni këto të drejta duke na kontaktuar përmes:
                </p>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Email-it: <a href="mailto:privacy@realestate-kosovo.com" className="underline">privacy@realestate-kosovo.com</a></li>
                  <li>Formës së kontaktit: <Link to="/kontakt" className="underline">Faqja e kontaktit</Link></li>
                  <li>Postës: Rruga "Luan Haradinaj", 10000 Prishtinë, Kosovë</li>
                </ul>
                <p className="text-sm mt-2">
                  Ne do të përpiqemi t'i përgjigjemi kërkesës suaj brenda 30 ditëve. Në disa raste, mund të kemi nevojë për informacione shtesë për të verifikuar identitetin tuaj.
                </p>
              </div>
            </section>

            {/* Cookies Section */}
            <section id="cookies" className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Cookie className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                Cookies dhe teknologjitë e gjurmimit
              </h2>

              <div className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p className="mb-4">
                  Ne përdorim cookies dhe teknologji të ngjashme gjurmimi për të përmirësuar përvojën tuaj në platformën tonë, 
                  për të kuptuar se si përdoruesit ndërveprojnë me shërbimet tona dhe për të personalizuar përmbajtjen.
                </p>
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Llojet e cookies që përdorim
                  </h3>
                  <ul className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li className="mb-2">
                      <strong>Cookies të domosdoshme:</strong> Këto janë të nevojshme për funksionimin e platformës 
                      dhe nuk mund të çaktivizohen. Ato zakonisht vendosen vetëm si përgjigje ndaj veprimeve që bëni, 
                      si kyçja ose plotësimi i formularëve.
                    </li>
                    <li className="mb-2">
                      <strong>Cookies të performancës:</strong> Këto na ndihmojnë të kuptojmë se si përdoruesit ndërveprojnë 
                      me platformën duke mbledhur informacione në mënyrë anonime. Ato na ndihmojnë të përmirësojmë funksionalitetin e faqes.
                    </li>
                    <li className="mb-2">
                      <strong>Cookies funksionale:</strong> Këto lejojnë platformën të ofrojë funksionalitet dhe personalizim 
                      të përmirësuar, si ruajtja e preferencave tuaja dhe njohja kur ktheheni në platformë.
                    </li>
                    <li>
                      <strong>Cookies të marketingut:</strong> Këto përdoren për të gjurmuar vizitorët nëpër faqet e ndryshme. 
                      Qëllimi është të shfaqim reklama që janë relevante dhe angazhuese për përdoruesin individual.
                    </li>
                  </ul>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Teknologji të tjera gjurmimi
                  </h3>
                  <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Përveç cookies, ne mund të përdorim edhe:
                  </p>
                  <ul className={`list-disc pl-5 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Web beacons: Imazhe të vogla transparente që përdoren për të gjurmuar sjelljen e përdoruesit</li>
                    <li>Pixels: Kode të vogla që lejojnë monitorimin e veprimeve në platformë</li>
                    <li>Local storage: Të dhëna që ruhen lokalisht në shfletuesin tuaj</li>
                    <li>Session storage: Të dhëna që ruhen vetëm për kohëzgjatjen e sesionit tuaj</li>
                  </ul>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Si të menaxhoni cookies
                  </h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Shumica e shfletuesve ju lejojnë të kontrolloni cookies përmes konfigurimit të tyre. Ju mund të:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Pranoni ose refuzoni të gjitha cookies</li>
                      <li>Pranoni vetëm disa lloje të cookies</li>
                      <li>Konfiguroni shfletuesin tuaj që t'ju njoftojë kur vendosen cookies</li>
                      <li>Fshini cookies që janë vendosur tashmë</li>
                    </ul>
                    <p className="mt-3">
                      Ju lutemi vini re se bllokimi i disa cookies mund të ndikojë në përvojën tuaj të përdorimit dhe funksionalitetet që ofron platforma jonë.
                    </p>
                  </p>
                </div>
              </div>
            </section>

            {/* Security Section */}
            <section id="security" className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Lock className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                Siguria
              </h2>

              <div className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                  Mbrojtja e të dhënave tuaja personale është një prioritet kryesor për ne. Ne zbatojmë masa të 
                  përshtatshme teknike dhe organizative për të mbrojtur të dhënat tuaja personale nga humbja, 
                  keqpërdorimi, qasja e paautorizuar, ndryshimi ose zbulimi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Masat tona të sigurisë përfshijnë
                  </h3>
                  <ul className={`list-disc pl-5 space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Enkriptim i të dhënave gjatë transferimit (SSL/TLS)</li>
                    <li>Fjalëkalime të koduara dhe autentifikim të sigurt</li>
                    <li>Firewall dhe sisteme të zbulimit të intruzionit</li>
                    <li>Monitorim i vazhdueshëm i sigurisë</li>
                    <li>Akses i kufizuar për punonjësit në të dhënat e ndjeshme</li>
                    <li>Trajnime të rregullta për stafin mbi praktikat e sigurisë</li>
                    <li>Vlerësime të rregullta të rrezikut dhe audit</li>
                  </ul>
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Mbrojtja juaj personale
                  </h3>
                  <p className={`mb-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Ndërsa ne punojmë shumë për të mbrojtur të dhënat tuaja, asnjë sistem nuk është 100% i sigurt. 
                    Për të ndihmuar në mbrojtjen e llogarisë suaj, ju rekomandojmë që:
                  </p>
                  <ul className={`list-disc pl-5 space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Përdorni fjalëkalime të forta dhe unike</li>
                    <li>Aktivizoni autentifikimin me dy faktorë kur ofrohet</li>
                    <li>Mos ndani kredencialet tuaja të llogarisë me askënd</li>
                    <li>Mos përdorni rrjete publike Wi-Fi për të aksesuar të dhëna të ndjeshme</li>
                    <li>Kyçeni nga llogaria juaj pas përfundimit të përdorimit</li>
                    <li>Na njoftoni menjëherë nëse dyshoni për përdorim të paautorizuar</li>
                  </ul>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-900/20 text-purple-300 border border-purple-800' : 'bg-purple-50 text-purple-800 border border-purple-200'}`}>
                <h4 className="font-semibold mb-2">Njoftimi për shkelje të të dhënave</h4>
                <p className="text-sm">
                  Në rast të një shkeljeje të të dhënave që mund të ndikojë në privatësinë tuaj, ne do t'ju njoftojmë pa vonesa 
                  të panevojshme, në përputhje me ligjet e zbatueshme. Ky njoftim do të përfshijë detaje për natyrën e shkeljes, 
                  të dhënat e prekura, hapat që po ndërmarrim dhe rekomandimet për masa që mund të merrni për të mbrojtur veten.
                </p>
              </div>
            </section>

            {/* Changes Section */}
            <section id="changes" className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <FileText className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                Ndryshimet në politikë
              </h2>

              <div className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p className="mb-4">
                  Ne mund të përditësojmë këtë politikë privatësie herë pas here për të reflektuar ndryshimet në praktikat tona të privatësisë 
                  ose për arsye të tjera operacionale, ligjore ose rregullatore. Kur bëjmë ndryshime materiale në këtë politikë, 
                  ne do t'ju njoftojmë përmes:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Postimit të politikës së përditësuar në platformë me një datë efektive të re</li>
                  <li>Një njoftimi në platformë ose dërgimit të një e-mail-i në adresën e lidhur me llogarinë tuaj</li>
                  <li>Shfaqjes së një banner-i ose pop-up në platformë që tregon ndryshimet kryesore</li>
                </ul>
                <p>
                  Ne ju inkurajojmë të rishikoni rregullisht këtë politikë për të qenë të informuar për mënyrën se si 
                  po mbrojmë të dhënat tuaja. Vazhdimi i përdorimit të platformës pas ndryshimeve në politikë do të 
                  konsiderohet si pranim i kushteve të reja.
                </p>
              </div>

              <div className={`p-4 border-l-4 ${darkMode ? 'border-blue-500 bg-blue-900/20 text-blue-300' : 'border-blue-500 bg-blue-50 text-blue-800'} rounded-r-lg`}>
                <h4 className="font-semibold mb-2">Historiku i ndryshimeve</h4>
                <div className={`mt-2 space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex">
                    <span className="font-medium w-24">01.12.2023</span>
                    <span>Politika fillestare e privatësisë</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Mail className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                Na kontaktoni
              </h2>

              <div className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p className="mb-4">
                  Nëse keni pyetje, shqetësime ose kërkesa në lidhje me këtë politikë privatësie ose mënyrën se si 
                  trajtojmë të dhënat tuaja personale, ju lutem mos hezitoni të na kontaktoni.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Detajet e kontaktit
                    </h3>
                    <ul className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li className="flex items-start">
                        <Mail className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Email:</p>
                          <a href="mailto:privacy@realestate-kosovo.com" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                            privacy@realestate-kosovo.com
                          </a>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Globe className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Forma e kontaktit:</p>
                          <Link to="/kontakt" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                            Faqja e kontaktit
                          </Link>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Adresa postare:</p>
                          <p>
                            RealEstate Kosovo<br />
                            Rruga "Luan Haradinaj"<br />
                            10000 Prishtinë, Kosovë
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Autoriteti mbikëqyrës
                    </h3>
                    <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Nëse keni një shqetësim ose ankesë që nuk kemi adresuar në mënyrë të kënaqshme, ju keni të drejtë 
                      të kontaktoni autoritetin mbikëqyrës në Kosovë:
                    </p>
                    <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <p className="font-medium">Agjencia për Informim dhe Privatësi</p>
                      <p>
                        Rr. "Luan Haradinaj", nr. 36/3<br />
                        10000 Prishtinë, Kosovë
                      </p>
                      <a 
                        href="https://aip-ks.org/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`flex items-center text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} mt-2`}
                      >
                        <span>Vizito faqen zyrtare</span>
                        <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Final Note */}
            <div className={`p-6 ${darkMode ? 'bg-blue-900/30 text-white' : 'bg-blue-50 text-gray-900'} rounded-xl shadow-md`}>
              <h3 className="text-xl font-semibold mb-4">Përmbledhje përfundimtare</h3>
              <p className="mb-4">
                Në RealEstate Kosovo, ne besojmë në transparencë dhe kontroll për përdoruesit tanë. Ne përpiqemi të 
                balancojmë nevojën për të mbledhur dhe përdorur të dhëna për të ofruar shërbime të dobishme me respektin 
                për privatësinë tuaj.
              </p>
              <p>
                Duke përdorur platformën tonë, ju pranoni praktikat e përshkruara në këtë politikë privatësie. 
                Nëse nuk pajtoheni me këtë politikë, ju lutemi të mos përdorni shërbimet tona.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12">
          <div className={`${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-xl shadow-lg p-8 text-center`}>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Keni pyetje shtesë rreth privatësisë tuaj?
            </h2>
            <p className={`max-w-2xl mx-auto mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Ne jemi të përkushtuar për të mbrojtur të dhënat tuaja personale dhe për të qenë transparentë 
              në lidhje me praktikat tona të privatësisë. Nëse keni ndonjë pyetje, mos hezitoni të na kontaktoni.
            </p>
            <Link
              to="/kontakt"
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                darkMode ? 'focus:ring-offset-gray-800' : ''
              }`}
            >
              Na kontaktoni
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPage;