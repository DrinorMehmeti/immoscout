import React from 'react';
import { Check, Star, Award, Zap } from 'lucide-react';

const PremiumFeatures: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Bëhuni Përdorues Premium</span>
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Merrni përparësi ndaj të tjerëve dhe shikueshmëri më të madhe për shpalljet tuaja
          </p>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="lg:flex">
            <div className="p-8 sm:p-10 lg:flex-1">
              <h3 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                Premium
              </h3>
              <p className="mt-6 text-base text-gray-500">
                Shpalljet tuaja në krye të listës dhe përparësi ndaj të tjerëve
              </p>
              <div className="mt-8">
                <div className="flex items-center">
                  <h4 className="flex-shrink-0 pr-4 text-sm font-semibold uppercase tracking-wider text-blue-600">
                    Çfarë përfshihet
                  </h4>
                  <div className="flex-1 border-t-2 border-gray-200"></div>
                </div>
                <ul className="mt-6 space-y-4">
                  <li className="flex">
                    <Check className="flex-shrink-0 h-6 w-6 text-green-500" />
                    <span className="ml-3 text-base text-gray-500">Shpallje në krye të listës</span>
                  </li>
                  <li className="flex">
                    <Check className="flex-shrink-0 h-6 w-6 text-green-500" />
                    <span className="ml-3 text-base text-gray-500">Deri në 10 shpallje aktive njëkohësisht</span>
                  </li>
                  <li className="flex">
                    <Check className="flex-shrink-0 h-6 w-6 text-green-500" />
                    <span className="ml-3 text-base text-gray-500">Shënimi special "Premium" për të gjitha shpalljet</span>
                  </li>
                  <li className="flex">
                    <Check className="flex-shrink-0 h-6 w-6 text-green-500" />
                    <span className="ml-3 text-base text-gray-500">Statistika të detajuara për shpalljet tuaja</span>
                  </li>
                  <li className="flex">
                    <Check className="flex-shrink-0 h-6 w-6 text-green-500" />
                    <span className="ml-3 text-base text-gray-500">Përditësimi automatik i shpalljeve çdo javë</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="py-8 px-6 text-center bg-gray-50 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">
              <div className="flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-400" />
                <p className="ml-2 text-5xl font-extrabold text-gray-900">
                  €9.99
                </p>
                <span className="text-xl font-medium text-gray-500 ml-2">/muaj</span>
              </div>
              <div className="mt-6">
                <div className="rounded-md shadow">
                  <a
                    href="#"
                    className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Bëhu premium tani
                  </a>
                </div>
              </div>
              <div className="mt-4 text-sm">
                <p className="font-medium text-gray-900">Paguaj sigurt me:</p>
                <p className="mt-2 text-gray-500">Kartë krediti, PayPal, ose transfertë bankare</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Shikueshmëri e lartë</h3>
            <p className="text-gray-600">Shpalljet tuaja do të shfaqen në krye të listës së kërkimit dhe kategorive përkatëse.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Shënim special</h3>
            <p className="text-gray-600">Shpalljet tuaja do të theksohen me shënim "Premium" që i dallon ato nga të tjerat.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Rezultate më të shpejta</h3>
            <p className="text-gray-600">Shpallja juaj do të shikohet nga më shumë blerës dhe qiramarrës potencialë, duke përshpejtuar procesin.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeatures;