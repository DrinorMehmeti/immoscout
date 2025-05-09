import React from 'react';
import { useAuth } from '../context/AuthContext';
import { mockProperties } from '../data/mockData';
import PropertyCard from '../components/PropertyCard';
import { Building } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

const MyPropertiesPage: React.FC = () => {
  const { authState } = useAuth();
  const userProperties = mockProperties.filter(
    property => property.userId === authState.user?.id
  );

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pronat e mia</h1>
      {userProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Ende nuk keni asnjë pronë</h3>
          <p className="mt-2 text-gray-500 mb-6">Shtoni pronën tuaj të parë për ta shfaqur në platformën tonë</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyPropertiesPage; 