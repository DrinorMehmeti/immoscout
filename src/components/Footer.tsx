import React from 'react';
import { Home, Mail, Phone, ExternalLink, Facebook, Instagram, Twitter } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Footer: React.FC = () => {
  const { darkMode } = useTheme();
  
  return (
    <footer className={darkMode ? "bg-gray-950 text-white" : "bg-gray-900 text-white"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center">
              <Home className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">RealEstate Kosovo</span>
            </div>
            <p className="mt-4 text-gray-400">
              Platforma më e madhe e patundshmërive në Kosovë me mijëra prona për shitje dhe qiradhënie.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigimi</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Ballina</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Shpallje</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Rreth nesh</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Si funksionon</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Premium</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Kontakti</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Shërbimet</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Shpallje falas</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Shpallje premium</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Agjencitë</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Bashkëpunimet</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Vlerësimet</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Këshilla ligjore</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontakti</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-blue-400 mr-3 mt-1" />
                <span className="text-gray-400">info@realestate-kosovo.com</span>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-blue-400 mr-3 mt-1" />
                <span className="text-gray-400">+383 44 123 456</span>
              </div>
              <div className="flex items-start">
                <ExternalLink className="h-5 w-5 text-blue-400 mr-3 mt-1" />
                <span className="text-gray-400">Rruga "Luan Haradinaj", Prishtinë, Kosovë</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`mt-12 pt-8 border-t ${darkMode ? 'border-gray-800' : 'border-gray-800'} text-gray-400 text-sm`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 RealEstate Kosovo. Të gjitha të drejtat e rezervuara.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="hover:text-white">Kushtet e përdorimit</a>
              <a href="#" className="hover:text-white">Privatësia</a>
              <a href="#" className="hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;