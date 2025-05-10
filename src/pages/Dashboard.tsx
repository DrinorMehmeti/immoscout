import React from 'react';
import { mockProperties } from '../data/mockData';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { useTheme } from '../context/ThemeContext';

const Dashboard: React.FC = () => {
  const { authState } = useAuth();
  const { darkMode } = useTheme();
  // Filter properties owned by the logged in user
  const userProperties = mockProperties.filter(
    property => property.userId === authState.user?.id
  );

  return (
    <DashboardLayout>
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-6`}>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Mirë se vini, {authState.user?.profile?.name}!</h1>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {authState.user?.profile?.user_type === 'buyer' && 'Kërkoni pronat e preferuara dhe kontaktoni shitësit direkt.'}
          {authState.user?.profile?.user_type === 'seller' && 'Shtoni prona për shitje dhe menaxhoni shpalljet tuaja.'}
          {authState.user?.profile?.user_type === 'renter' && 'Kërkoni pronat me qira dhe kontaktoni pronarët direkt.'}
          {authState.user?.profile?.user_type === 'landlord' && 'Shtoni prona me qira dhe menaxhoni shpalljet tuaja.'}
        </p>
      </div>
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-6`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Përmbledhje e aktivitetit</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-50'} rounded-lg p-4`}>
            <div className="flex justify-between">
              <p className={`${darkMode ? 'text-blue-300' : 'text-blue-700'} font-medium`}>Pronat aktive</p>
            </div>
            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>{userProperties.length}</p>
          </div>
          <div className={`${darkMode ? 'bg-green-900' : 'bg-green-50'} rounded-lg p-4`}>
            <div className="flex justify-between">
              <p className={`${darkMode ? 'text-green-300' : 'text-green-700'} font-medium`}>Shikime</p>
            </div>
            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>142</p>
          </div>
          <div className={`${darkMode ? 'bg-purple-900' : 'bg-purple-50'} rounded-lg p-4`}>
            <div className="flex justify-between">
              <p className={`${darkMode ? 'text-purple-300' : 'text-purple-700'} font-medium`}>Shpalljet e fav.</p>
            </div>
            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>5</p>
          </div>
        </div>
      </div>
      
      {userProperties.length > 0 ? (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Pronat e mia</h2>
            <a href="#" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} text-sm font-medium`}>
              Shiko të gjitha
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      ) : (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 text-center`}>
          <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Ende nuk keni asnjë pronë</h3>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-6`}>Shtoni pronën tuaj të parë për ta shfaqur në platformën tonë</p>
          <a 
            href="/add-property.html" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Shto pronë të re
          </a>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;