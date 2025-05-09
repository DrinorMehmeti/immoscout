import React from 'react';
import { Star } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

const PremiumPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Star className="h-10 w-10 text-yellow-400 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">Bëhu Premium</h1>
        </div>
        <p className="text-gray-600 text-center mb-8">
          Përfito nga të gjitha avantazhet e një llogarie premium dhe rrit shanset për të shitur ose dhënë me qira pronën tënde më shpejt!
        </p>
        <ul className="mb-8 space-y-3">
          <li className="flex items-center"><Star className="h-5 w-5 text-yellow-400 mr-2" /> Shpalljet tuaja në krye të listës</li>
          <li className="flex items-center"><Star className="h-5 w-5 text-yellow-400 mr-2" /> Statistika të avancuara për shpalljet</li>
          <li className="flex items-center"><Star className="h-5 w-5 text-yellow-400 mr-2" /> Mbështetje prioritare</li>
          <li className="flex items-center"><Star className="h-5 w-5 text-yellow-400 mr-2" /> Shpallje të pakufizuara</li>
        </ul>
        <div className="text-center mb-6">
          <span className="text-2xl font-bold text-blue-600">9.99€</span>
          <span className="text-gray-500"> / muaj</span>
        </div>
        <div className="text-center">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 px-8 rounded-md text-lg shadow">
            Bëhu Premium tani
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PremiumPage; 