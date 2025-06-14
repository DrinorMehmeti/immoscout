import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  FileText, 
  Info, 
  Shield, 
  AlertCircle, 
  Check, 
  User, 
  Lock, 
  Eye, 
  Clock, 
  Globe, 
  MessageSquare, 
  Trash2, 
  HelpCircle, 
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsPage: React.FC = () => {
  const { darkMode } = useTheme();
  const [selectedSection, setSelectedSection] = useState<string>('general');

  // Updated date of the terms
  const lastUpdated = '15 Nëntor 2023';

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen pt-24 pb-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Kushtet e Përdorimit</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-500 dark:text-gray-400">
            Ju lutemi lexoni me kujdes këto kushte para se të përdorni platformën tonë
          </p>
          <p className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Përditësuar së fundmi: {lastUpdated}
          </p>
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
                <button 
                  onClick={() => setSelectedSection('general')} 
                  className={`w-full flex items-center p-2 rounded-lg ${
                    selectedSection === 'general' 
                      ? darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700' 
                      : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Info className="h-5 w-5 mr-3" />
                  Kushtet e përgjithshme
                </button>
                <button 
                  onClick={() => setSelectedSection('user')} 
                  className={`w-full flex items-center p-2 rounded-lg ${
                    selectedSection === 'user' 
                      ? darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700' 
                      : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <User className="h-5 w-5 mr-3" />
                  Llogaria e përdoruesit
                </button>
                <button 
                  onClick={() => setSelectedSection('content')} 
                  className={`w-full flex items-center p-2 rounded-lg ${
                    selectedSection === 'content' 
                      ? darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700' 
                      : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <FileText className="h-5 w-5 mr-3" />
                  Përmbajtja e shpalljeve
                </button>
                <button 
                  onClick={() => setSelectedSection('privacy')} 
                  className={`w-full flex items-center p-2 rounded-lg ${
                    selectedSection === 'privacy' 
                      ? darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700' 
                      : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Lock className="h-5 w-5 mr-3" />
                  Privatësia dhe të dhënat
                </button>
                <button 
                  onClick={() => setSelectedSection('payment')} 
                  className={`w-full flex items-center p-2 rounded-lg ${
                    selectedSection === 'payment' 
                      ? darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700' 
                      : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Shield className="h-5 w-5 mr-3" />
                  Pagesat dhe abonimi
                </button>
                <button 
                  onClick={() => setSelectedSection('liabilities')} 
                  className={`w-full flex items-center p-2 rounded-lg ${
                    selectedSection === 'liabilities' 
                      ? darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700' 
                      : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <AlertCircle className="h-5 w-5 mr-3" />
                  Përgjegjësitë dhe garancitë
                </button>
                <button 
                  onClick={() => setSelectedSection('termination')} 
                  className={`w-full flex items-center p-2 rounded-lg ${
                    selectedSection === 'termination' 
                      ? darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700' 
                      : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Trash2 className="h-5 w-5 mr-3" />
                  Ndërprerja e shërbimit
                </button>
                <button 
                  onClick={() => setSelectedSection('legal')} 
                  className={`w-full flex items-center p-2 rounded-lg ${
                    selectedSection === 'legal' 
                      ? darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700' 
                      : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Globe className="h-5 w-5 mr-3" />
                  Dispozitat ligjore
                </button>
              </nav>

              <div className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-800'}`}>
                <h3 className="font-medium mb-2 flex items-center">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Keni pyetje?
                </h3>
                <p className="text-sm mb-3">
                  Nëse keni ndonjë pyetje lidhur me kushtet tona të përdorimit, ju lutem na kontaktoni.
                </p>
                <Link to="/kontakt" className="text-sm font-medium inline-flex items-center">
                  Kontaktoni ekipin tonë
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* General Terms Section */}
            {selectedSection === 'general' && (
              <section className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Kushtet e përgjithshme
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      1. Pranimi i kushteve
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Duke përdorur platformën RealEstate Kosovo, ju pranoni plotësisht dhe parezervë këto kushte të përdorimit. 
                      Nëse nuk pajtoheni me ndonjë pjesë të këtyre kushteve, ju nuk duhet të përdorni shërbimet tona.
                    </p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Këto kushte mund të ndryshohen herë pas here, dhe është përgjegjësia juaj të kontrolloni për ndryshimet. 
                      Përdorimi i vazhdueshëm i platformës pas ndryshimeve nënkupton pranimin tuaj të kushteve të reja.
                    </p>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      2. Përshkrimi i shërbimit
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      RealEstate Kosovo është një platformë online që ofron mundësinë për të kërkuar, listuar dhe menaxhuar 
                      prona të patundshmërive në Kosovë. Shërbimet tona përfshijnë, por nuk kufizohen në:
                    </p>
                    <ul className={`list-disc pl-5 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>Listimin e pronave për shitje ose qira</li>
                      <li>Kërkimin dhe shfletimin e pronave</li>
                      <li>Kontaktimin e pronarëve ose agjentëve</li>
                      <li>Shërbime premium për promovim të pronave</li>
                      <li>Mjete për menaxhimin e shpalljeve të pronave</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      3. Kushtet e pranueshmërisë
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Për të përdorur shërbimet tona, ju duhet:
                    </p>
                    <ul className={`list-disc pl-5 space-y-2 mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>Të jeni të paktën 18 vjeç</li>
                      <li>Të regjistroni një llogari me informacione të vërteta dhe të sakta</li>
                      <li>Të mbani të sigurta kredencialet e llogarisë suaj</li>
                      <li>Të përdorni platformën në përputhje me ligjet në fuqi</li>
                    </ul>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Ne rezervojmë të drejtën të refuzojmë shërbimin, të mbyllim llogaritë ose të ndryshojmë ose ndërpresim 
                      shërbimin për çdo përdorues, në çdo kohë, për çdo arsye.
                    </p>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      4. Ndryshimet në platformë
                    </h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      RealEstate Kosovo rezervon të drejtën të modifikojë, pezullojë ose ndërpresë çdo aspekt të platformës, 
                      përfshirë, por pa u kufizuar në, përmbajtjen, veçoritë e platformës ose oraret e disponueshmërisë. 
                      Ne gjithashtu mund të vendosim kufizime në veçori të caktuara ose të kufizojmë aksesin tuaj në pjesë ose 
                      të gjithë platformën pa njoftim ose përgjegjësi.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* User Account Section */}
            {selectedSection === 'user' && (
              <section className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Llogaria e përdoruesit
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      1. Krijimi i llogarisë
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Për të përdorur shumë nga veçoritë e platformës tonë, do t'ju kërkohet të krijoni një llogari. Kur krijoni një 
                      llogari, ju duhet të jepni informacione të sakta dhe të plota. Ju jeni përgjegjës për ruajtjen e konfidencialitetit 
                      të kredencialeve të llogarisë suaj dhe për të gjitha aktivitetet që ndodhin nën llogarinë tuaj.
                    </p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Ju pajtoheni të na njoftoni menjëherë për çdo përdorim të paautorizuar të llogarisë tuaj ose për çdo 
                      shkelje tjetër të sigurisë. RealEstate Kosovo nuk do të jetë përgjegjës për çdo humbje që mund të 
                      pësoni si rezultat i përdorimit të paautorizuar të llogarisë suaj.
                    </p>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      2. Llojet e llogarive
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      RealEstate Kosovo ofron disa lloje llogarish për të përmbushur nevojat e ndryshme të përdoruesve:
                    </p>
                    <ul className={`list-disc pl-5 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li><strong>Llogari bazë:</strong> Për përdoruesit individualë që kërkojnë ose listojnë prona, me funksionalitet të kufizuar.</li>
                      <li><strong>Llogari premium:</strong> Ofron veçori të avancuara, siç janë listimi i pronave në krye të rezultateve të kërkimit, statistika të detajuara dhe më shumë foto.</li>
                      <li><strong>Llogari agjenti/agjencia:</strong> Të dizajnuara për profesionistët e patundshmërisë, me mjete të specializuara për menaxhimin e shumë pronave dhe klientëve.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      3. Përgjegjësitë e përdoruesit
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Si përdorues i platformës RealEstate Kosovo, ju pajtoheni të:
                    </p>
                    <ul className={`list-disc pl-5 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>Jepni informacione të sakta dhe të plota gjatë regjistrimit dhe në shpalljet tuaja</li>
                      <li>Mbani të përditësuar informacionet e llogarisë dhe shpalljeve tuaja</li>
                      <li>Mbroni fjalëkalimin tuaj dhe të mos e ndani atë me të tjerët</li>
                      <li>Të mos krijoni llogari të shumta ose llogari në emër të personave të tjerë</li>
                      <li>Të mos transferoni llogarinë tuaj tek asnjë person tjetër pa lejen tonë me shkrim</li>
                      <li>Të veproni në përputhje me ligjin dhe këto kushte përdorimi gjatë përdorimit të platformës</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      4. Pezullimi dhe mbyllja e llogarisë
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      RealEstate Kosovo rezervon të drejtën të pezullojë ose mbyllë llogarinë tuaj për arsye të ndryshme, përfshirë por jo kufizuar në:
                    </p>
                    <ul className={`list-disc pl-5 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>Shkelje të këtyre kushteve të përdorimit</li>
                      <li>Sjellje mashtruese ose dyshime për aktivitet të paligjshëm</li>
                      <li>Postimi i përmbajtjes së papërshtatshme ose të ndaluar</li>
                      <li>Përdorim abuziv i sistemit ose veçorive</li>
                      <li>Mos-përdorim i llogarisë për një periudhë të zgjatur kohore</li>
                      <li>Me kërkesën tuaj, për t'ju lejuar të fshini llogarinë tuaj</li>
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* Content Rules Section */}
            {selectedSection === 'content' && (
              <section className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Përmbajtja e shpalljeve
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      1. Rregullat për shpalljet
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Të gjitha shpalljet e pronave në platformën tonë duhet të jenë të sakta dhe të vërteta. Çdo përshkrim, 
                      informacion ose material visual duhet të përfaqësojë me saktësi pronën e shpallur. Përdoruesit janë të 
                      ndaluar rreptësisht të postojnë:
                    </p>
                    <ul className={`list-disc pl-5 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>Informacione të rreme ose mashtruese për pronat</li>
                      <li>Foto që nuk i përkasin pronës së shpallur</li>
                      <li>Informacione çorientuese për çmimin, vendndodhjen, ose karakteristikat e pronës</li>
                      <li>Shpallje për prona që nuk ekzistojnë ose nuk janë realisht të disponueshme</li>
                      <li>Shpallje për prona të paligjshme ose me probleme të pazgjidhura ligjore</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      2. Përmbajtja e ndaluar
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      RealEstate Kosovo ndalon rreptësisht çdo lloj përmbajtjeje që:
                    </p>
                    <ul className={`list-disc pl-5 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>Është diskriminuese bazuar në racë, gjini, fe, etni, orientim seksual, aftësi të kufizuara ose çdo kategori tjetër të mbrojtur</li>
                      <li>Përmban gjuhë të urrejtjes, kërcënime, ose sulme verbale ndaj individëve ose grupeve</li>
                      <li>Është e natyrës pornografike ose seksualisht eksplicite</li>
                      <li>Promovon aktivitete të paligjshme ose të dëmshme</li>
                      <li>Shkel të drejtat e autorit, markat tregtare ose të drejta të tjera të pronësisë intelektuale</li>
                      <li>Përmban softuer të dëmshëm, virus, ose kod tjetër të dizajnuar për të ndërhyrë në funksionimin e platformës</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      3. Miratimi i shpalljeve
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Të gjitha shpalljet e reja duhet të kalojnë përmes një procesi miratimi përpara se të bëhen të dukshme 
                      publikisht në platformë. Ky proces synon të garantojë që të gjitha shpalljet janë në përputhje me 
                      rregullat tona dhe ofrojnë informacion të dobishëm dhe të saktë për përdoruesit.
                    </p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      RealEstate Kosovo rezervon të drejtën të refuzojë ose heqë çdo shpallje që shkel këto kushte ose 
                      që konsiderohet e papërshtatshme për çfarëdo arsye, sipas gjykimit tonë të vetëm.
                    </p>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      4. Përgjegjësia për përmbajtjen
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Përdoruesit mbajnë përgjegjësi të plotë për përmbajtjen që postojnë në platformë. Duke postuar përmbajtje, 
                      ju garantoni që:
                    </p>
                    <ul className={`list-disc pl-5 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>Jeni pronari i pronës ose keni autorizimin e duhur për ta listuar atë</li>
                      <li>Informacioni që jepni është i saktë, i vërtetë dhe jo mashtrues</li>
                      <li>Shpallja juaj nuk shkel ndonjë ligj ose rregullore në fuqi</li>
                      <li>Materialet vizuale (fotot, videot, etj.) janë autentike dhe paraqesin gjendjen aktuale të pronës</li>
                      <li>Nuk po përpiqeni të fshihni defekte të rëndësishme ose probleme ligjore të pronës</li>
                    </ul>
                  </div>

                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-amber-900/20 border border-amber-800 text-amber-300' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
                    <h4 className="flex items-center font-semibold mb-2">
                      <AlertCircle className="h-5 w-5 mr-1" />
                      Raportimi i përmbajtjes së papërshtatshme
                    </h4>
                    <p className="text-sm">
                      Nëse identifikoni shpallje që shkel këto kushte ose që përmban informacion të pasaktë, ju lutemi ta raportoni 
                      menjëherë përmes butonit "Raporto" në faqen e pronës ose duke kontaktuar ekipin tonë të mbështetjes. Ne do të 
                      shqyrtojmë çdo raport dhe do të marrim masat e duhura.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Privacy Section */}
            {selectedSection === 'privacy' && (
              <section className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Privatësia dhe të dhënat
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      1. Mbledhja e të dhënave
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Kur përdorni platformën tonë, ne mund të mbledhim lloje të ndryshme të dhënash personale, duke përfshirë 
                      por jo kufizuar në:
                    </p>
                    <ul className={`list-disc pl-5 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>Informacione identifikuese (emri, adresa e emailit, numri i telefonit)</li>
                      <li>Informacione të llogarisë (emri i përdoruesit, fjalëkalimi i enkriptuar)</li>
                      <li>Informacione financiare (për përpunimin e pagesave)</li>
                      <li>Informacione të përdorimit (si ndërveproni me platformën)</li>
                      <li>Informacione të pajisjes (lloji i pajisjes, sistemi operativ, adresa IP)</li>
                      <li>Vendndodhja (bazuar në pëlqimin tuaj, për të treguar rezultate më të përshtatshme)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      2. Përdorimi i të dhënave
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Ne përdorim të dhënat tuaja për qëllime të ndryshme, përfshirë:
                    </p>
                    <ul className={`list-disc pl-5 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>Ofrimin dhe përmirësimin e shërbimeve tona</li>
                      <li>Përshtatjen e përvojës suaj në platformë</li>
                      <li>Komunikimin me ju për njoftimet, përditësimet dhe informacione të tjera të rëndësishme</li>
                      <li>Administrimin e llogarisë suaj dhe procesimin e pagesave</li>
                      <li>Zbatimin e politikave tona dhe mbrojtjen nga aktivitetet e dëmshme</li>
                      <li>Analizimin e trendeve dhe përdorimit për të përmirësuar platformën</li>
                      <li>Përmbushjen e detyrimeve ligjore</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      3. Ndarja e të dhënave
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Ne mund të ndajmë të dhënat tuaja në rrethana të caktuara:
                    </p>
                    <ul className={`list-disc pl-5 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li><strong>Me përdoruesit e tjerë:</strong> Kur listoni një pronë, informacione të caktuara bëhen publike për përdoruesit e tjerë.</li>
                      <li><strong>Me ofruesit e shërbimeve:</strong> Kompanitë që na ndihmojnë në ofrimin e shërbimeve tona (p.sh., procesimi i pagesave, hostimi).</li>
                      <li><strong>Për qëllime ligjore:</strong> Kur kërkohet me ligj ose për të mbrojtur të drejtat tona.</li>
                      <li><strong>Me pëlqimin tuaj:</strong> Në rrethana të tjera kur kemi pëlqimin tuaj specifik.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      4. Të drejtat tuaja
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Në varësi të juridiksionit tuaj, ju mund të keni të drejta të caktuara në lidhje me të dhënat tuaja personale:
                    </p>
                    <ul className={`list-disc pl-5 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>Të drejtën për akses në të dhënat tuaja</li>
                      <li>Të drejtën për të korrigjuar të dhënat e pasakta</li>
                      <li>Të drejtën për të fshirë të dhënat tuaja në rrethana të caktuara</li>
                      <li>Të drejtën për të kufizuar përpunimin ose për t'u kundërshtuar atë</li>
                      <li>Të drejtën e portabilitetit të të dhënave</li>
                      <li>Të drejtën për të tërhequr pëlqimin tuaj në çdo kohë</li>
                    </ul>
                  </div>

                  <div className={`p-4 border-l-4 ${darkMode ? 'border-blue-500 bg-blue-900/20 text-blue-300' : 'border-blue-500 bg-blue-50 text-blue-800'} rounded-r-lg`}>
                    <p className="text-sm">
                      <strong>Shënim:</strong> Për informacion më të detajuar në lidhje me praktikat tona të privatësisë, 
                      ju lutem referojuni Politikës sonë të plotë të Privatësisë. Nëse keni pyetje ose shqetësime në lidhje 
                      me të dhënat tuaja, ju lutemi kontaktoni Zyrtarin tonë të Mbrojtjes së të Dhënave në 
                      <a href="mailto:privacy@realestate-kosovo.com" className="underline ml-1">privacy@realestate-kosovo.com</a>.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Payment & Subscription Section */}
            {selectedSection === 'payment' && (
              <section className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Pagesat dhe abonimi
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      1. Opsionet e pagesës
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      RealEstate Kosovo ofron lloje të ndryshme abonimi dhe opsione pagesash. Çmimet dhe veçoritë janë të 
                      përshkruara në faqen e çmimeve të platformës sonë. Aktualisht, ne pranojmë këto metoda pagese:
                    </p>
                    <ul className={`list-disc pl-5 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>Transferta bankare</li>
                      <li>Kartë krediti/debiti</li>
                      <li>Pagesa elektronike</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      2. Abonimi Premium
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Abonimi Premium është një shërbim me pagesë që ofron veçori shtesë për përdoruesit tanë, duke përfshirë:
                    </p>
                    <ul className={`list-disc pl-5 space-y-2 mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>Shpallje të theksuara që shfaqen në krye të rezultateve të kërkimit</li>
                      <li>Numër i pakufizuar i shpalljeve të pronave</li>
                      <li>Statistika të detajuara për shikimet dhe interesimin</li>
                      <li>Më shumë foto për çdo shpallje</li>
                      <li>Mbështetje prioritare</li>
                    </ul>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Abonimet Premium mund të jenë mujore ose vjetore, me rinovim automatik. Ju mund ta anuloni abonoimin tuaj 
                      në çdo kohë nga faqja e cilësimeve të llogarisë suaj.
                    </p>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      3. Rinovimi dhe anulimi
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Abonimet me pagesë rinovohen automatikisht në fund të periudhës së abonoimit, përveç nëse anulohen të 
                      paktën 24 orë para datës së rinovimit. Nëse anuloni abonoimin tuaj, ju do të vazhdoni të keni akses në 
                      veçoritë premium deri në fund të periudhës aktuale të faturimit.
                    </p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Nuk ofrohen rimbursime për periudhat e pjesshme të abonoimit, përveç nëse kërkohet nga legjislacioni 
                      në fuqi. Në rrethana të caktuara, siç është një ndërprerje e madhe e shërbimit, ne mund të ofrojmë 
                      rimbursime ose kredite sipas gjykimit tonë.
                    </p>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      4. Ndryshimet në çmim
                    </h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      RealEstate Kosovo rezervon të drejtën të ndryshojë çmimet e abonoimit në çdo kohë. Ndryshimet në çmimet e 
                      abonoimit do të hyjnë në fuqi në ciklin e ardhshëm të faturimit. Ne do t'ju njoftojmë për çdo ndryshim në 
                      çmimet e abonoimit përpara se ato të hyjnë në fuqi. Nëse nuk pajtoheni me ndryshimin e çmimit, ju mund 
                      të anuloni abonoimin tuaj para se ndryshimi të hyjë në fuqi.
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 text-blue-300 border border-blue-800' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
                    <h4 className="flex items-center font-semibold mb-2">
                      <Shield className="h-5 w-5 mr-1" />
                      Siguria e pagesave
                    </h4>
                    <p className="text-sm">
                      Të gjitha transaksionet e pagesave në platformën tonë janë të siguruara me enkriptim të nivelit të industrisë. 
                      Ne nuk ruajmë të dhënat e kartës suaj të kreditit në serverët tanë, por përdorim përpunues të besueshëm të pagesave 
                      për të trajtuar të gjitha transaksionet financiare.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Liabilities Section */}
            {selectedSection === 'liabilities' && (
              <section className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Përgjegjësitë dhe garancitë
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      1. Përjashtimi i garancive
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Platforma RealEstate Kosovo ofrohet "siç është" dhe "siç është e disponueshme" pa asnjë lloj garancie, 
                      qoftë e shprehur ose e nënkuptuar, duke përfshirë, por pa u kufizuar në, garancitë e nënkuptuara të 
                      përshtatshmërisë për një qëllim të veçantë, jotregtisë, dhe mosshkeljes së të drejtave.
                    </p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      RealEstate Kosovo nuk garanton që platforma do të jetë e disponueshme në çdo kohë ose se funksionimi i 
                      platformës do të jetë pa ndërprerje ose pa gabime. Ne nuk garantojmë saktësinë, besueshmërinë, integritetin, 
                      vlefshmërinë ose përshtatshmërinë e përmbajtjes së publikuar nga përdoruesit e platformës.
                    </p>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      2. Kufizimi i përgjegjësisë
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      RealEstate Kosovo dhe drejtuesit, punonjësit, partnerët dhe agjentët e saj nuk do të jenë përgjegjës për:
                    </p>
                    <ul className={`list-disc pl-5 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>Dëme indirekte, aksidentale, të veçanta, të rrjedhshme ose ndëshkuese</li>
                      <li>Humbje të të dhënave, fitimeve, të ardhurave ose biznesit</li>
                      <li>Humbje ose dëmtim të pronës si rezultat i përdorimit të platformës</li>
                      <li>Çdo pretendim, dëm ose humbje që rezulton nga veprimet e përdoruesve të tjerë</li>
                      <li>Probleme teknike ose dështime në sistemet e komunikimit</li>
                      <li>Përmbajtje të pasakta ose mashtruese të postuara nga përdoruesit</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      3. Roli i platformës
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      RealEstate Kosovo vepron vetëm si një platformë që mundëson lidhjen mes shitësve/qiradhënësve dhe 
                      blerësve/qiramarrësve potencialë. Ne nuk jemi palë në asnjë transaksion që realizohet mes përdoruesve 
                      të platformës sonë.
                    </p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Ne nuk ndërmjetësojmë, nuk negociojmë, nuk përfaqësojmë asnjë palë dhe nuk garantojmë cilësinë, 
                      sigurinë ose ligjshmërinë e pronave të shpallura në platformë. Platforma jonë është thjesht një 
                      kanal komunikimi dhe nuk mban përgjegjësi për veprimet ose mosveprimet e përdoruesve.
                    </p>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      4. Dëmshpërblimi
                    </h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Ju pajtoheni të mbroni, dëmshpërbleni dhe të mbani të pademshëm RealEstate Kosovo, drejtuesit, punonjësit, 
                      partnerët dhe agjentët e saj nga çdo pretendim, përgjegjësi, dëm, humbje dhe shpenzime, përfshirë pa kufizim 
                      tarifat dhe kostot ligjore të arsyeshme, që rrjedhin nga ose në lidhje me (a) përdorimi juaj i platformës, 
                      (b) shkelja juaj e këtyre kushteve, (c) përmbajtja që postoni, ose (d) ndërveprimi juaj me përdoruesit e tjerë.
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-amber-900/20 border border-amber-800 text-amber-300' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
                    <h4 className="flex items-center font-semibold mb-2">
                      <AlertCircle className="h-5 w-5 mr-1" />
                      Këshillë e rëndësishme
                    </h4>
                    <p className="text-sm">
                      Rekomandojmë fuqishëm që të gjithë përdoruesit të verifikojnë plotësisht çdo pronë dhe dokumentacion 
                      përpara se të bëjnë ndonjë pagesë ose të nënshkruajnë ndonjë kontratë. Konsultohuni gjithmonë me një 
                      avokat të specializuar në patundshmëri dhe një agjent profesionist për transaksione të rëndësishme.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Termination Section */}
            {selectedSection === 'termination' && (
              <section className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Ndërprerja e shërbimit
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      1. Ndërprerja nga përdoruesi
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Ju mund të ndërprisni marrëdhënien tuaj me RealEstate Kosovo në çdo kohë duke mbyllur llogarinë tuaj 
                      përmes cilësimeve të profilit ose duke kontaktuar drejtpërdrejt ekipin tonë të mbështetjes.
                    </p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Pas mbylljes së llogarisë, shpalljet tuaja do të hiqen nga platforma dhe ju nuk do të keni më akses 
                      në shërbimet tona. Ju lutemi vini re se disa të dhëna mund të ruhen për qëllime ligjore ose të sigurisë 
                      edhe pas mbylljes së llogarisë, siç përshkruhet në Politikën tonë të Privatësisë.
                    </p>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      2. Ndërprerja nga RealEstate Kosovo
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      RealEstate Kosovo rezervon të drejtën të pezullojë ose përfundojë llogarinë tuaj dhe aksesin në 
                      platformë, me ose pa njoftim, për arsye të ndryshme, duke përfshirë por jo kufizuar në:
                    </p>
                    <ul className={`list-disc pl-5 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>Shkelje të këtyre Kushteve të Përdorimit</li>
                      <li>Sjellje që RealEstate Kosovo beson se është e dëmshme për përdoruesit e tjerë, palët e treta ose për biznesin tonë</li>
                      <li>Veprime të paligjshme ose mashtruese</li>
                      <li>Postimi i përmbajtjes së ndaluar ose të papërshtatshme</li>
                      <li>Aktivitete që krijojnë rrezik ligjor për ne ose përdoruesit tanë</li>
                      <li>Periudha të gjata joaktiviteti</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      3. Efektet e ndërprerjes
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Pas ndërprerjes së llogarisë tuaj, qoftë nga ju ose nga ne:
                    </p>
                    <ul className={`list-disc pl-5 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>Ju do të humbisni menjëherë të drejtën për të përdorur platformën</li>
                      <li>Shpalljet dhe përmbajtja juaj do të hiqen nga pjesët publike të platformës</li>
                      <li>Abonimet aktive mund të anulohen pa të drejtë rimbursimi, përveç nëse kërkohet ndryshe nga ligji</li>
                      <li>Çdo e drejtë e dhënë për përmbajtjen tuaj do të përfundojë, përveç nëse përcaktohet ndryshe në këto kushte</li>
                    </ul>
                    <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Seksionet e këtyre Kushteve që për nga natyra e tyre duhet të mbijetojnë ndërprerjes do të mbeten në fuqi 
                      pas ndërprerjes së marrëdhënies suaj me RealEstate Kosovo, përfshirë, por pa u kufizuar në, dispozitat e 
                      pronësisë intelektuale, përjashtimet e garancisë dhe kufizimet e përgjegjësisë.
                    </p>
                  </div>

                  <div className={`p-4 border-l-4 ${darkMode ? 'border-purple-500 bg-purple-900/20 text-purple-300' : 'border-purple-500 bg-purple-50 text-purple-800'} rounded-r-lg`}>
                    <h4 className="font-semibold mb-2">Për përdoruesit me abonime premium</h4>
                    <p className="text-sm">
                      Nëse mbyllni llogarinë tuaj ndërsa keni një abonim premium aktiv, ju nuk do të pranoni asnjë rimbursim për 
                      periudhën e mbetur të abonoimit, përveç nëse ndërprerja është shkaktuar nga një shkelje materiale e këtyre 
                      kushteve nga ana jonë. Nëse ne ndërpresim llogarinë tuaj për shkak të shkeljes së këtyre kushteve, abonimi 
                      juaj mund të anulohet pa rimbursim.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Legal Provisions Section */}
            {selectedSection === 'legal' && (
              <section className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Dispozitat ligjore
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      1. Ligji i zbatueshëm
                    </h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Këto Kushte të Përdorimit dhe çdo mosmarrëveshje që lind nga ose në lidhje me to do të rregullohen 
                      dhe interpretohen në përputhje me ligjet e Republikës së Kosovës, pa marrë parasysh parimet e konfliktit 
                      të ligjeve. Përdorimi i platformës i nënshtrohet gjithashtu ligjeve dhe rregulloreve lokale, shtetërore 
                      dhe ndërkombëtare të zbatueshme.
                    </p>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      2. Zgjidhja e mosmarrëveshjeve
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Çdo mosmarrëveshje ose pretendim që lind nga ose në lidhje me Kushtet e Përdorimit, ose shkelja, 
                      përfundimi ose pavlefshmëria e tyre, do të zgjidhet fillimisht përmes negociatave në mirëbesim 
                      mes palëve.
                    </p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Nëse mosmarrëveshja nuk mund të zgjidhet përmes negociatave, çështja do t'i nënshtrohet jurisdiksionit 
                      ekskluziv të gjykatave të Republikës së Kosovës. Megjithatë, ne rezervojmë të drejtën të sjellim padi 
                      ligjore kundër jush në gjykatat e jurisdiksionit tuaj të banimit ose vendndodhjes.
                    </p>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      3. Pronësia intelektuale
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      RealEstate Kosovo dhe përmbajtja e krijuar nga ne, përfshirë por jo kufizuar në tekstin, grafikët, 
                      logot, ikonat, imazhet, materialet audio, videot, kodin kompjuterik dhe përmbajtjen tjetër, janë 
                      pronë ekskluzive e RealEstate Kosovo dhe mbrohen nga ligjet e të drejtave të autorit, markave tregtare 
                      dhe ligje të tjera të pronësisë intelektuale.
                    </p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Ju nuk mund të përdorni, riprodhoni, modifikoni, shpërndani ose krijoni punë derivative të ndonjë 
                      përmbajtjeje të mbrojtur nga të drejtat e autorit pa lejen tonë të qartë me shkrim. Çdo përdorim i 
                      paautorizuar mund të rezultojë në shkelje të të drejtave të autorit, markave tregtare ose ligjeve 
                      të tjera të pronësisë intelektuale.
                    </p>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      4. Ndarshmëria
                    </h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Nëse ndonjë dispozitë e këtyre Kushteve të Përdorimit konsiderohet e paligjshme, e pavlefshme ose e 
                      pazbatueshme për çfarëdo arsye, dispozita e tillë do të konsiderohet e ndashme nga këto Kushte dhe nuk 
                      do të ndikojë në vlefshmërinë dhe zbatueshmërinë e dispozitave të mbetura. Në këtë rast, dispozita e 
                      pazbatueshme do të zëvendësohet me një dispozitë të zbatueshme që përputhet më së shumti me qëllimin 
                      e dispozitës origjinale.
                    </p>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      5. Force majeure
                    </h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      RealEstate Kosovo nuk do të jetë përgjegjës për ndonjë vonesë ose dështim në përmbushjen e detyrimeve 
                      tona sipas këtyre kushteve për shkak të shkaqeve përtej kontrollit tonë të arsyeshëm, duke përfshirë, 
                      por pa u kufizuar në, fatkeqësi natyrore, epidemi, pandemi, ndërprerje të energjisë elektrike, 
                      dështime të infrastrukturës, veprime qeveritare, trazira civile, sulme terroriste ose veprime të tjera 
                      të forcave madhore.
                    </p>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      6. Kontakti
                    </h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Nëse keni pyetje ose shqetësime në lidhje me këto Kushte të Përdorimit, ju lutem kontaktoni:
                    </p>
                    <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <strong>RealEstate Kosovo</strong>
                      </p>
                      <p className={`mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Rruga "Luan Haradinaj", Prishtinë, Kosovë
                      </p>
                      <p className={`mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Email: <a href="mailto:legal@realestate-kosovo.com" className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>legal@realestate-kosovo.com</a>
                      </p>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Tel: +383 44 123 456
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Last Update Notice */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <div className="flex items-center">
                <Clock className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Këto kushte të përdorimit janë përditësuar së fundmi më datë {lastUpdated}. Ju rekomandojmë të kontrolloni 
                  rregullisht për ndryshime.
                </p>
              </div>
            </div>

            {/* Print/Save Options */}
            <div className="flex justify-end">
              <button 
                onClick={() => window.print()}
                className={`flex items-center px-4 py-2 text-sm ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } rounded-lg transition-colors`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" 
                  />
                </svg>
                Printo kushtet
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mb-10">
          <div className={`${
            darkMode ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
          } rounded-xl shadow-lg p-10 text-white text-center`}>
            <h2 className="text-2xl font-bold mb-4">Keni pyetje shtesë?</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Nëse keni ndonjë pyetje lidhur me kushtet tona të përdorimit ose nëse keni nevojë për sqarime të mëtejshme, 
              ekipi ynë i mbështetjes është i gatshëm t'ju ndihmojë.
            </p>
            <Link
              to="/kontakt"
              className="inline-block bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Na kontaktoni
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>
            Ky dokument përfaqëson kushtet e përdorimit midis jush dhe RealEstate Kosovo. Këto kushte mund të jenë objekt i 
            ndryshimeve herë pas here. Ndryshimet do të bëhen efektive menjëherë pas publikimit të tyre në platformë. 
            Vazhdimi i përdorimit të platformës pas publikimit të ndryshimeve përbën pranimin e kushteve të reja.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} RealEstate Kosovo. Të gjitha të drejtat e rezervuara.
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

export default TermsPage;