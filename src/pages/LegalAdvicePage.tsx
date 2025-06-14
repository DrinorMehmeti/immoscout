import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Shield, 
  FileText, 
  AlertCircle, 
  Check, 
  HelpCircle, 
  ExternalLink, 
  Scale, 
  Home, 
  Key, 
  PieChart, 
  Building,
  Landmark
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LegalAdvicePage: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen pt-24 pb-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <Scale className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Këshilla Ligjore</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-500 dark:text-gray-400">
            Informacione dhe udhëzime të rëndësishme ligjore për blerjen, shitjen dhe qiradhënien e pronave në Kosovë
          </p>
        </div>

        {/* Legal Alert/Disclaimer */}
        <div className={`${darkMode ? 'bg-amber-900/30 border-amber-800' : 'bg-amber-50 border-amber-200'} border rounded-xl p-6 mb-12`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className={`h-6 w-6 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            </div>
            <div className="ml-3">
              <h3 className={`text-lg font-medium ${darkMode ? 'text-amber-300' : 'text-amber-800'}`}>Sqarim i rëndësishëm</h3>
              <div className={`mt-2 text-sm ${darkMode ? 'text-amber-200' : 'text-amber-700'}`}>
                <p>
                  Informacioni në këtë faqe është vetëm për qëllime orientuese dhe nuk përbën këshillë ligjore profesionale. 
                  Para se të ndërmerrni ndonjë veprim ligjor lidhur me pasuritë e paluajtshme, rekomandojmë që të konsultoheni me një avokat të specializuar 
                  në fushën e pronave.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Side Navigation (on wider screens) */}
          <div className="md:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 sticky top-24`}>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Përmbajtja
              </h2>
              <nav className="space-y-2">
                <a href="#buying" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <Home className="h-5 w-5 mr-3" />
                  Blerja e pronës
                </a>
                <a href="#selling" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <Key className="h-5 w-5 mr-3" />
                  Shitja e pronës
                </a>
                <a href="#renting" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <Building className="h-5 w-5 mr-3" />
                  Qiradhënia
                </a>
                <a href="#taxes" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <PieChart className="h-5 w-5 mr-3" />
                  Taksat dhe tarifat
                </a>
                <a href="#documents" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <FileText className="h-5 w-5 mr-3" />
                  Dokumentet e nevojshme
                </a>
                <a href="#legal-help" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <Landmark className="h-5 w-5 mr-3" />
                  Ndihma ligjore
                </a>
              </nav>

              <div className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-800'}`}>
                <h3 className="font-medium mb-2 flex items-center">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Keni nevojë për ndihmë?
                </h3>
                <p className="text-sm mb-3">
                  Për këshilla të personalizuara, kontaktoni një nga partnerët tanë ligjorë të specializuar në patundshmëri.
                </p>
                <Link to="/kontakt" className="text-sm font-medium inline-flex items-center">
                  Kontaktoni tani
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Buying Property Section */}
            <section id="buying" className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Home className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                Blerja e pronës
              </h2>

              <div className={`mb-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Procesi i blerjes në Kosovë</h3>
                <ol className={`list-decimal pl-5 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>Kërkimi dhe identifikimi i pronës</li>
                  <li>Negocimi i çmimit dhe kushteve</li>
                  <li>Nënshkrimi i para-kontratës dhe pagesa e kapares (zakonisht 10-15%)</li>
                  <li>Verifikimi i dokumentacionit të pronësisë dhe historikut të pronës</li>
                  <li>Marrja e vërtetimit që prona nuk ka hipotekë ose barrë tjetër</li>
                  <li>Nënshkrimi i kontratës përfundimtare te noteri</li>
                  <li>Pagesa e taksave dhe tarifave përkatëse</li>
                  <li>Regjistrimi i pronës në Kadastër</li>
                </ol>
              </div>

              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Verifikimi i pronës</h3>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Para se të blini një pronë, është thelbësore të verifikoni statusin e saj ligjor. Kjo përfshin:
              </p>
              <ul className={`list-disc pl-5 space-y-2 mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>Kontrolloni nëse shitësi është pronari i vërtetë i pronës duke kërkuar certifikatën e pronësisë</li>
                <li>Verifikoni nëse ka ndonjë hipotekë ose barrë tjetër në pronë</li>
                <li>Kontrolloni nëse prona ka probleme të pazgjidhura pronësore</li>
                <li>Verifikoni nëse të gjitha taksat e pronës janë paguar</li>
                <li>Për banesat në ndërtesa të reja, kontrolloni nëse zhvilluesi ka të gjitha lejet e nevojshme</li>
              </ul>

              <div className={`p-4 border-l-4 ${darkMode ? 'border-blue-500 bg-blue-900/20 text-blue-300' : 'border-blue-500 bg-blue-50 text-blue-800'} rounded-r-lg`}>
                <h4 className="font-semibold mb-2">Këshillë e ekspertit</h4>
                <p className="text-sm">
                  Gjithmonë rekomandohet të angazhoni një avokat të specializuar në patundshmëri për të kryer "due diligence" 
                  para se të nënshkruani kontratën përfundimtare. Kjo mund t'ju kursejë probleme të mëdha në të ardhmen.
                </p>
              </div>
            </section>

            {/* Selling Property Section */}
            <section id="selling" className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Key className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                Shitja e pronës
              </h2>

              <div className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p className="mb-4">
                  Kur vendosni të shisni pronën tuaj, duhet të jeni të vetëdijshëm për disa aspekte ligjore:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Sigurohuni që të keni të gjithë dokumentacionin e pronësisë në rregull</li>
                  <li>Përgatisni një deklaratë të qartë të pronësisë dhe historikut të pronës</li>
                  <li>Deklaroni çdo defekt strukturor ose problem tjetër të pronës për të shmangur përgjegjësinë ligjore më vonë</li>
                  <li>Jini të vetëdijshëm për detyrimet tatimore që mund të lindin nga shitja</li>
                </ul>
              </div>

              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dokumentet e nevojshme për shitje</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dokumentet e pronësisë</h4>
                  <ul className={`list-disc pl-5 space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Certifikata e pronësisë</li>
                    <li>Kopja e planit kadastral</li>
                    <li>Vërtetimi i taksave të paguara</li>
                    <li>Dokumenti i identifikimit personal</li>
                  </ul>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Për ndërtesa të reja</h4>
                  <ul className={`list-disc pl-5 space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Leja e ndërtimit</li>
                    <li>Certifikata e përdorimit</li>
                    <li>Dokumentacioni teknik i ndërtesës</li>
                    <li>Garancitë për punimet e kryera</li>
                  </ul>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-yellow-900/20 border border-yellow-800 text-yellow-300' : 'bg-yellow-50 border border-yellow-200 text-yellow-800'}`}>
                <h4 className="flex items-center font-semibold mb-2">
                  <AlertCircle className="h-5 w-5 mr-1" />
                  Kujdes me para-kontratat
                </h4>
                <p className="text-sm">
                  Para-kontratat janë ligjërisht të detyrueshme në Kosovë. Kushtet, afatet dhe penalitetet për 
                  mos-përmbushje duhet të specifikohen qartë. Rekomandohet që para-kontratat të noterizohen 
                  për t'i dhënë më shumë fuqi ligjore.
                </p>
              </div>
            </section>

            {/* Renting Section */}
            <section id="renting" className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Building className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                Qiradhënia
              </h2>

              <div className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p className="mb-4">
                  Qiradhënia në Kosovë rregullohet nga Ligji për Marrëdhëniet e Detyrimeve. Për të mbrojtur të drejtat tuaja,
                  si qiradhënës ashtu edhe si qiramarrës, është e rëndësishme të keni një kontratë të qartë dhe të detajuar.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Për qiradhënësit</h3>
                  <ul className={`list-disc pl-5 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Specifikoni qartë kohëzgjatjen e kontratës dhe kushtet e rinovimit</li>
                    <li>Përcaktoni shumën e qirasë dhe metodën e pagesës</li>
                    <li>Kërkoni depozitë sigurie (zakonisht 1-2 muaj qira)</li>
                    <li>Dokumentoni gjendjen e pronës me fotografi përpara qiradhënies</li>
                    <li>Sqaroni se kush është përgjegjës për mirëmbajtjen dhe riparimet</li>
                    <li>Përfshini kushtet për ndërprerjen e parakohshme të kontratës</li>
                  </ul>
                </div>
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Për qiramarrësit</h3>
                  <ul className={`list-disc pl-5 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Verifikoni që qiradhënësi është pronari i ligjshëm i pronës</li>
                    <li>Inspektoni pronën për dëmtime dhe dokumentojini ato përpara nënshkrimit</li>
                    <li>Kuptoni kushtet e rikthimit të depozitës së sigurisë</li>
                    <li>Konfirmoni se cilat shpenzime komunale përfshihen në qira</li>
                    <li>Mësoni për kushtet e ndërprerjes së kontratës dhe njoftimin e kërkuar</li>
                    <li>Kuptoni kufizimet për ndryshimet në pronë (p.sh. rinovime, kafshë shtëpiake)</li>
                  </ul>
                </div>
              </div>

              <div className={`p-4 border-l-4 ${darkMode ? 'border-green-500 bg-green-900/20 text-green-300' : 'border-green-500 bg-green-50 text-green-800'} rounded-r-lg`}>
                <h4 className="font-semibold mb-2">Këshillë praktike</h4>
                <p className="text-sm">
                  Edhe pse kontrata verbale e qirasë është teknikishtë e vlefshme, gjithmonë rekomandohet të keni një kontratë me shkrim
                  të nënshkruar nga të dyja palët. Kjo siguron mbrojtje më të mirë ligjore në rast mosmarrëveshjeje.
                </p>
              </div>
            </section>

            {/* Taxes & Fees Section */}
            <section id="taxes" className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <PieChart className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                Taksat dhe tarifat
              </h2>

              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Blerja dhe shitja e pasurive të paluajtshme në Kosovë shoqërohet me disa taksa dhe tarifa që duhet të merren parasysh në planifikimin financiar.
              </p>

              <div className={`mb-6 overflow-x-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Lloji i taksës/tarifës</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Shuma/Përqindja</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kush e paguan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Komente</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">Tatimi në transaksion</td>
                      <td className="px-6 py-4 whitespace-nowrap">0.5 - 1% e vlerës së pronës</td>
                      <td className="px-6 py-4 whitespace-nowrap">Blerësi</td>
                      <td className="px-6 py-4">Varion sipas komunave</td>
                    </tr>
                    <tr className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">Tarifa noteriale</td>
                      <td className="px-6 py-4 whitespace-nowrap">0.3 - 0.8% e vlerës</td>
                      <td className="px-6 py-4 whitespace-nowrap">Zakonisht ndahet midis palëve</td>
                      <td className="px-6 py-4">Varet nga vlera e pronës</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">Regjistrimi në kadastër</td>
                      <td className="px-6 py-4 whitespace-nowrap">30-50€</td>
                      <td className="px-6 py-4 whitespace-nowrap">Blerësi</td>
                      <td className="px-6 py-4">Tarifa administrative</td>
                    </tr>
                    <tr className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">Tatimi në të ardhura nga qiraja</td>
                      <td className="px-6 py-4 whitespace-nowrap">9%</td>
                      <td className="px-6 py-4 whitespace-nowrap">Qiradhënësi</td>
                      <td className="px-6 py-4">Mbi të ardhurat vjetore nga qiraja</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">Tatimi në pronë</td>
                      <td className="px-6 py-4 whitespace-nowrap">0.15 - 1% vjetore</td>
                      <td className="px-6 py-4 whitespace-nowrap">Pronari</td>
                      <td className="px-6 py-4">Bazuar në vlerësimin e pronës</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-900/20 text-purple-300 border border-purple-800' : 'bg-purple-50 text-purple-800 border border-purple-200'}`}>
                <h4 className="flex items-center font-semibold mb-2">
                  <HelpCircle className="h-5 w-5 mr-1" />
                  A e dinit?
                </h4>
                <p className="text-sm">
                  Në Kosovë, shitësit dhe blerësit shpesh deklarojnë një vlerë më të ulët të pronës në kontratën zyrtare 
                  për të reduktuar taksat. Kjo praktikë është e paligjshme dhe mund të rezultojë në gjoba të konsiderueshme 
                  nga organet tatimore, si dhe probleme gjatë rishitjes së pronës në të ardhmen.
                </p>
              </div>
            </section>

            {/* Documents Section */}
            <section id="documents" className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <FileText className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                Dokumentet e nevojshme
              </h2>

              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Transaksionet e pasurive të paluajtshme kërkojnë një sërë dokumentesh për të garantuar sigurinë ligjore 
                dhe për të formalizuar marrëveshjen midis palëve.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Dokumentet e pronësisë
                  </h3>
                  <ul className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li className="flex">
                      <Check className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-500'} mr-2 flex-shrink-0`} />
                      <span><strong>Certifikata e pronësisë</strong> - Dokumenti kryesor që vërteton pronësinë dhe përmban detaje për pronën</span>
                    </li>
                    <li className="flex">
                      <Check className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-500'} mr-2 flex-shrink-0`} />
                      <span><strong>Kopja e planit</strong> - Planimetria e pronës që tregon kufijtë, sipërfaqen dhe vendndodhjen e saj</span>
                    </li>
                    <li className="flex">
                      <Check className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-500'} mr-2 flex-shrink-0`} />
                      <span><strong>Vërtetimi i tatimit në pronë</strong> - Konfirmon që të gjitha taksat e pronës janë paguar</span>
                    </li>
                    <li className="flex">
                      <Check className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-500'} mr-2 flex-shrink-0`} />
                      <span><strong>Vërtetimi për barrë/hipotekë</strong> - Konfirmon nëse prona ka hipotekë ose barrë tjetër</span>
                    </li>
                    <li className="flex">
                      <Check className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-500'} mr-2 flex-shrink-0`} />
                      <span><strong>Historiku i pronësisë</strong> - Dokument që tregon transaksionet e mëparshme të pronës</span>
                    </li>
                  </ul>
                </div>
                
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Dokumentet e transaksionit
                  </h3>
                  <ul className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li className="flex">
                      <Check className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-500'} mr-2 flex-shrink-0`} />
                      <span><strong>Para-kontrata e shitblerjes</strong> - Marrëveshja fillestare që përcakton kushtet e transaksionit</span>
                    </li>
                    <li className="flex">
                      <Check className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-500'} mr-2 flex-shrink-0`} />
                      <span><strong>Kontrata përfundimtare</strong> - Duhet të noterizohet dhe të përmbajë të gjitha detajet e transaksionit</span>
                    </li>
                    <li className="flex">
                      <Check className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-500'} mr-2 flex-shrink-0`} />
                      <span><strong>Dokumentet e identifikimit</strong> - Letërnjoftim ose pasaportë për të gjitha palët</span>
                    </li>
                    <li className="flex">
                      <Check className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-500'} mr-2 flex-shrink-0`} />
                      <span><strong>Vërtetimi i pagesës</strong> - Dokumenti që konfirmon transferimin e fondeve</span>
                    </li>
                    <li className="flex">
                      <Check className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-500'} mr-2 flex-shrink-0`} />
                      <span><strong>Kërkesa për regjistrim</strong> - Për të regjistruar pronën në emrin e pronarit të ri</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className={`p-4 border-l-4 ${darkMode ? 'border-blue-500 bg-blue-900/20 text-blue-300' : 'border-blue-500 bg-blue-50 text-blue-800'} rounded-r-lg`}>
                <p className="text-sm">
                  <strong>Këshillë:</strong> Të gjitha dokumentet duhet të jenë origjinale ose kopje të noterizuara. 
                  Asnjëherë mos pranoni të vazhdoni me një transaksion nëse ndonjë nga dokumentet kryesore mungon ose 
                  ka shenja të falsifikimit.
                </p>
              </div>
            </section>

            {/* Legal Help Section */}
            <section id="legal-help" className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Landmark className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                Ndihma ligjore
              </h2>

              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Transaksionet e pasurive të paluajtshme mund të jenë komplekse dhe të kërkojnë ndihmë profesionale 
                për të shmangur probleme të mundshme ligjore.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className={`p-6 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                  <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Kur të kërkoni ndihmë ligjore</h3>
                  <ul className={`list-disc pl-5 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Kur dëshironi të blini një pronë me histori komplekse pronësie</li>
                    <li>Kur bëhet fjalë për shuma të mëdha parash</li>
                    <li>Kur ndërmerren investime të mëdha në ndërtime të reja</li>
                    <li>Kur ka pasiguri mbi çështje të ndryshme ligjore të pronës</li>
                    <li>Kur përballen me konflikte rreth kufijve të pronës</li>
                    <li>Për hartimin e kontratave komplekse të qirasë</li>
                  </ul>
                </div>
                
                <div className={`p-6 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                  <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Llojet e profesionistëve ligjorë</h3>
                  <ul className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li className="flex">
                      <Landmark className="h-5 w-5 mr-2 flex-shrink-0" />
                      <div>
                        <strong>Avokatë të specializuar në patundshmëri</strong>
                        <p className="text-sm mt-1">Ofrojnë këshilla ligjore dhe përfaqësim në transaksione</p>
                      </div>
                    </li>
                    <li className="flex">
                      <FileText className="h-5 w-5 mr-2 flex-shrink-0" />
                      <div>
                        <strong>Noterë</strong>
                        <p className="text-sm mt-1">Noterizojnë dokumente dhe verifikojnë vlefshmërinë e kontratave</p>
                      </div>
                    </li>
                    <li className="flex">
                      <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                      <div>
                        <strong>Ekspertë kadastralë</strong>
                        <p className="text-sm mt-1">Specializohen në çështje që lidhen me kufijtë dhe regjistrimin e pronës</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Call to Action for Legal Help */}
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-blue-100 to-indigo-100'}`}>
                <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Kërkoni ndihmë profesionale</h3>
                <p className={`mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Platforma jonë bashkëpunon me avokatë të specializuar në patundshmëri që mund t'ju ndihmojnë 
                  në çdo aspekt të transaksionit tuaj.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link 
                    to="/bashkepunimet" 
                    className={`inline-flex items-center px-4 py-2 rounded-lg ${
                      darkMode 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <Shield className="mr-2 h-5 w-5" />
                    Partnerët tanë ligjorë
                  </Link>
                  <Link 
                    to="/kontakt" 
                    className={`inline-flex items-center px-4 py-2 rounded-lg ${
                      darkMode 
                        ? 'bg-white/10 hover:bg-white/20 text-white' 
                        : 'bg-white hover:bg-gray-100 text-blue-700 border border-blue-600'
                    }`}
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Na kontaktoni
                  </Link>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Pyetje të shpeshta
              </h2>

              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>A mund të blejnë të huajt pronë në Kosovë?</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Po, të huajt mund të blejnë pronë në Kosovë, por me disa kufizime. Shtetasit e huaj mund të blejnë 
                    prona rezidenciale dhe komerciale, por mund të ketë kufizime për blerjen e tokës bujqësore. 
                    Rekomandohet këshillimi me një avokat lokal për të kuptuar kufizimet specifike.
                  </p>
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Si mund të verifikoj nëse një pronë ka hipotekë?</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Mund të merrni një vërtetim për barrët dhe hipotekat nga Agjencia Kadastrale e Kosovës ose zyrat 
                    komunale të kadastrit. Ky dokument do të listojë çdo hipotekë aktive ose barrë tjetër në pronë.
                  </p>
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>A është e detyrueshme noterizimi i kontratës së shitblerjes?</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Po, sipas ligjeve në fuqi në Kosovë, të gjitha kontratat për transferimin e pronësisë së pasurive 
                    të paluajtshme duhet të noterizuhen. Një kontratë që nuk është e noterizuar nuk do të pranohet për 
                    regjistrim në kadastër dhe mund të konsiderohet e pavlefshme.
                  </p>
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sa kohë zgjat procesi i regjistrimit të pronës?</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Procesi i regjistrimit të pronës në kadastër zakonisht zgjat 15-30 ditë pune, në varësi të komunës 
                    dhe ngarkesës së zyrave kadastrale. Në disa raste, procesi mund të zgjasë më shumë nëse ka komplikime 
                    ose dokumentacion të munguar.
                  </p>
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>A mund të anulohet një kontratë e shitblerjes pas nënshkrimit?</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Pas noterizimit, kontrata e shitblerjes është ligjërisht e detyrueshme dhe anulimi i saj është i 
                    vështirë. Ajo mund të anulohet vetëm me pëlqimin e të dyja palëve ose përmes një procesi gjyqësor 
                    nëse vërtetohet se ka qenë e lidhur nën mashtrim, presion ose me kushte të tjera që e bëjnë atë të pavlefshme.
                  </p>
                </div>
              </div>
            </section>

            {/* Useful Resources */}
            <section className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Burime të dobishme
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  href="https://www.rks-gov.net/AL/f74/drejtesia/agjencia-kadastrale-e-kosoves" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-start p-4 rounded-lg transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-650' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <Landmark className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-3 flex-shrink-0 mt-1`} />
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Agjencia Kadastrale e Kosovës</h3>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Informacione zyrtare për regjistrimin e pronave, tarifat dhe procedurat kadastrale
                    </p>
                    <div className={`text-xs flex items-center mt-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      <span>Vizito faqen</span>
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </div>
                  </div>
                </a>

                <a 
                  href="https://www.noteriakosova.org/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-start p-4 rounded-lg transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-650' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <FileText className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-3 flex-shrink-0 mt-1`} />
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dhoma e Noterëve të Kosovës</h3>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Informacione për shërbimet noteriale dhe tarifat e aplikueshme
                    </p>
                    <div className={`text-xs flex items-center mt-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      <span>Vizito faqen</span>
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </div>
                  </div>
                </a>

                <a 
                  href="https://atk-ks.org/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-start p-4 rounded-lg transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-650' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <PieChart className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-3 flex-shrink-0 mt-1`} />
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Administrata Tatimore e Kosovës</h3>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Informacione për taksat e pronës dhe detyrimet tatimore të lidhura me patundshmëritë
                    </p>
                    <div className={`text-xs flex items-center mt-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      <span>Vizito faqen</span>
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </div>
                  </div>
                </a>

                <a 
                  href="https://www.oak-ks.org/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-start p-4 rounded-lg transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-650' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <Shield className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-3 flex-shrink-0 mt-1`} />
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Oda e Avokatëve të Kosovës</h3>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Databazë e avokatëve të licencuar, duke përfshirë ata të specializuar në të drejtën e pronës
                    </p>
                    <div className={`text-xs flex items-center mt-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      <span>Vizito faqen</span>
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </div>
                  </div>
                </a>
              </div>
            </section>
          </div>
        </div>

        {/* Contact Form CTA */}
        <div className="mt-12 mb-6">
          <div className={`${
            darkMode ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
          } rounded-xl shadow-xl p-10 text-white`}>
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-3/5">
                <h2 className="text-2xl font-bold mb-4">Keni nevojë për ndihmë ligjore?</h2>
                <p className="mb-6 md:mb-0">
                  Nëse keni pyetje specifike ose keni nevojë për këshillë të personalizuar ligjore, 
                  mos hezitoni të na kontaktoni. Partnerët tanë ligjorë janë të gatshëm t'ju ndihmojnë.
                </p>
              </div>
              <div className="md:w-2/5 md:text-right">
                <Link
                  to="/kontakt"
                  className="inline-block bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Na kontaktoni
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>
            <strong>Deklaratë përjashtimi:</strong> Informacioni i paraqitur në këtë faqe është mbledhur nga burime publike 
            dhe profesionistë në fushën e patundshmërive, dhe përditësohet rregullisht. Megjithatë, ligjet dhe rregulloret 
            ndryshojnë me kalimin e kohës. Ky informacion nuk zëvendëson këshillën ligjore profesionale. 
            RealEstate Kosovo nuk merr përgjegjësi për vendimet e marra bazuar në informacionin e paraqitur këtu.
          </p>
          <p className="mt-2">
            Përditësuar së fundmi: Nëntor 2023
          </p>
        </div>
      </div>
    </div>
  );
};

// Arrow Icon Component
const ArrowIcon = () => (
  <svg 
    className="h-4 w-4 ml-1" 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor"
  >
    <path 
      fillRule="evenodd" 
      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
      clipRule="evenodd" 
    />
  </svg>
);

export default LegalAdvicePage;