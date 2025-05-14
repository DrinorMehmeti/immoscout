import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../layouts/AdminLayout';
import { Search, Filter, MoreHorizontal, Building, Edit, Trash2, Eye, Star, StarOff, MapPin, Euro, AlertTriangle, CheckCircle, XCircle, Clock, CheckCircle as CircleCheck, Circle as CircleX, PauseCircle as CirclePause } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: string;
  listing_type: string;
  rooms: number | null;
  bathrooms: number | null;
  area: number | null;
  features: string[] | null;
  images: string[] | null;
  created_at: string;
  updated_at: string;
  status: string;
  featured: boolean;
  owner_id: string;
  owner_name?: string;
  view_count?: number;
  favorite_count?: number;
}

const AdminProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>('');
  const [listingTypeFilter, setListingTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending' | 'rejected'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showPropertyMenu, setShowPropertyMenu] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [propertyToToggleFeature, setPropertyToToggleFeature] = useState<Property | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [propertyToUpdateStatus, setPropertyToUpdateStatus] = useState<Property | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusReason, setStatusReason] = useState<string>('');

  const propertiesPerPage = 10;

  useEffect(() => {
    // When tab changes, update the statusFilter and reset to page 1
    if (activeTab === 'active') {
      setStatusFilter('active');
    } else if (activeTab === 'pending') {
      setStatusFilter('pending');
    } else if (activeTab === 'rejected') {
      setStatusFilter('rejected');
    } else {
      setStatusFilter('');
    }
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    fetchProperties();
  }, [currentPage, propertyTypeFilter, listingTypeFilter, statusFilter]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      // Fetch properties
      let query = supabase
        .from('properties')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (propertyTypeFilter) {
        query = query.eq('type', propertyTypeFilter);
      }
      
      if (listingTypeFilter) {
        query = query.eq('listing_type', listingTypeFilter);
      }
      
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      
      // Apply search if provided
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
      }
      
      // Apply pagination
      const from = (currentPage - 1) * propertiesPerPage;
      const to = from + propertiesPerPage - 1;
      
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) {
        throw error;
      }
      
      // Get the property owners information
      const propertyOwnerIds = data?.map(property => property.owner_id) || [];
      
      // Get owner profiles
      const { data: ownerProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', propertyOwnerIds);
        
      if (profilesError) {
        throw profilesError;
      }
      
      // Create a map of owner_id to name
      const ownerNameMap = new Map();
      ownerProfiles?.forEach(profile => {
        ownerNameMap.set(profile.id, profile.name);
      });
      
      // Fetch view counts for each property
      const propertyIds = data?.map(property => property.id) || [];
      
      // Create a batch of promises for view counts
      const viewCountPromises = propertyIds.map(id => 
        supabase
          .from('property_views')
          .select('*', { count: 'exact', head: true })
          .eq('property_id', id)
      );
      
      // Create a batch of promises for favorite counts
      const favoriteCountPromises = propertyIds.map(id => 
        supabase
          .from('favorites')
          .select('*', { count: 'exact', head: true })
          .eq('property_id', id)
      );
      
      // Wait for all promises to resolve
      const viewResults = await Promise.all(viewCountPromises);
      const favoriteResults = await Promise.all(favoriteCountPromises);
      
      // Add view and favorite counts to properties and add owner names
      const propertiesWithCounts = data?.map((property, index) => ({
        ...property,
        owner_name: ownerNameMap.get(property.owner_id) || 'N/A',
        view_count: viewResults[index].count || 0,
        favorite_count: favoriteResults[index].count || 0
      }));
      
      if (propertiesWithCounts) {
        setProperties(propertiesWithCounts);
      }
      
      if (count !== null) {
        setTotalPages(Math.ceil(count / propertiesPerPage));
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchProperties();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPropertyType = (type: string) => {
    const types: Record<string, string> = {
      'apartment': 'Banesë',
      'house': 'Shtëpi',
      'land': 'Tokë',
      'commercial': 'Lokal'
    };
    return types[type] || type;
  };

  const formatListingType = (type: string) => {
    return type === 'rent' ? 'Me qira' : 'Në shitje';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string, label: string }> = {
      'active': { color: 'bg-green-100 text-green-800', label: 'Aktiv' },
      'inactive': { color: 'bg-gray-100 text-gray-800', label: 'Joaktiv' },
      'sold': { color: 'bg-blue-100 text-blue-800', label: 'Shitur' },
      'rented': { color: 'bg-purple-100 text-purple-800', label: 'Dhënë me qira' },
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Në pritje' },
      'rejected': { color: 'bg-red-100 text-red-800', label: 'Refuzuar' }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return;
    
    try {
      // Delete the property
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyToDelete.id);
      
      if (error) {
        throw error;
      }
      
      // Refresh the property list
      fetchProperties();
      
      // Close the modal
      setIsDeleteModalOpen(false);
      setPropertyToDelete(null);
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Ndodhi një gabim gjatë fshirjes së pronës');
    }
  };

  const handleToggleFeature = async () => {
    if (!propertyToToggleFeature) return;
    
    try {
      // Update the property
      const { error } = await supabase
        .from('properties')
        .update({ 
          featured: !propertyToToggleFeature.featured
        })
        .eq('id', propertyToToggleFeature.id);
      
      if (error) {
        throw error;
      }
      
      // Refresh the property list
      fetchProperties();
      
      // Close the modal
      setIsFeatureModalOpen(false);
      setPropertyToToggleFeature(null);
    } catch (error) {
      console.error('Error updating property featured status:', error);
      alert('Ndodhi një gabim gjatë ndryshimit të statusit të pronës');
    }
  };

  const handleUpdateStatus = async () => {
    if (!propertyToUpdateStatus || !newStatus) return;
    
    try {
      // Update the property status
      const { error } = await supabase
        .from('properties')
        .update({ 
          status: newStatus
        })
        .eq('id', propertyToUpdateStatus.id);
      
      if (error) {
        throw error;
      }
      
      // If reason is provided and this is a rejection, add a notification
      if (statusReason && (newStatus === 'rejected' || newStatus === 'active')) {
        const notificationType = newStatus === 'rejected' ? 'rejection' : 'approval';
        const notificationTitle = newStatus === 'rejected' ? 'Prona juaj u refuzua' : 'Prona juaj u aprovua';
        
        // Check if notifications table exists before trying to insert
        const { error: tableCheckError } = await supabase
          .from('notifications')
          .select('id')
          .limit(1);
        
        // Only add notification if table exists
        if (!tableCheckError) {
          await supabase.from('notifications').insert({
            user_id: propertyToUpdateStatus.owner_id,
            title: notificationTitle,
            message: statusReason || (newStatus === 'rejected' ? 'Prona juaj u refuzua nga administratori.' : 'Prona juaj u aprovua dhe është tani e publikuar.'),
            type: notificationType,
            property_id: propertyToUpdateStatus.id
          });
        }
      }
      
      // Refresh the property list
      fetchProperties();
      
      // Close the modal
      setIsStatusModalOpen(false);
      setPropertyToUpdateStatus(null);
      setNewStatus('');
      setStatusReason('');
    } catch (error) {
      console.error('Error updating property status:', error);
      alert('Ndodhi një gabim gjatë ndryshimit të statusit të pronës');
    }
  };

  return (
    <AdminLayout>
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Menaxhimi i Pronave</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Shikoni dhe menaxhoni pronat e platformës
        </p>
      </div>
      
      {/* Status Tabs */}
      <div className="px-4 sm:px-6 mb-4">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Të gjitha pronat
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'active'
                  ? 'border-green-500 text-green-600 dark:border-green-400 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <CircleCheck className={`h-4 w-4 mr-1 ${activeTab === 'active' ? 'text-green-500' : ''}`} />
              Të publikuara
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'pending'
                  ? 'border-yellow-500 text-yellow-600 dark:border-yellow-400 dark:text-yellow-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Clock className={`h-4 w-4 mr-1 ${activeTab === 'pending' ? 'text-yellow-500' : ''}`} />
              Në pritje
              <span className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-xs font-medium rounded-full px-2 py-0.5">
                {properties.filter(p => p.status === 'pending').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'rejected'
                  ? 'border-red-500 text-red-600 dark:border-red-400 dark:text-red-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <CircleX className={`h-4 w-4 mr-1 ${activeTab === 'rejected' ? 'text-red-500' : ''}`} />
              Të refuzuara
            </button>
          </nav>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="mb-6 px-4 sm:px-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <form onSubmit={handleSearch} className="relative flex-1">
              <input
                type="text"
                placeholder="Kërko prona..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <button type="submit" className="hidden">Search</button>
            </form>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500"
                  value={propertyTypeFilter}
                  onChange={(e) => {
                    setPropertyTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Të gjitha llojet</option>
                  <option value="apartment">Banesë</option>
                  <option value="house">Shtëpi</option>
                  <option value="land">Tokë</option>
                  <option value="commercial">Lokal</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500"
                  value={listingTypeFilter}
                  onChange={(e) => {
                    setListingTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Të gjitha</option>
                  <option value="sale">Në shitje</option>
                  <option value="rent">Me qira</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Properties table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden px-4 sm:px-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-10">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nuk u gjet asnjë pronë</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {activeTab === 'all' ? 'Provoni të ndryshoni filtrat ose termit e kërkimit' : 
               activeTab === 'pending' ? 'Nuk ka prona në pritje për aprovim' : 
               activeTab === 'rejected' ? 'Nuk ka prona të refuzuara' : 
               'Nuk ka prona të publikuara'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Prona
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Pronari
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Çmimi
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Lloji
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Statusi
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Statistikat
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data e krijimit
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Veprimet
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {properties.map((property) => (
                  <tr key={property.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    property.status === 'pending' ? 'bg-yellow-50 dark:bg-yellow-900/20' : 
                    property.status === 'rejected' ? 'bg-red-50 dark:bg-red-900/20' : ''
                  }`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-14 rounded overflow-hidden">
                          {property.images && property.images.length > 0 ? (
                            <img 
                              src={property.images[0]} 
                              alt={property.title}
                              className="h-10 w-14 object-cover"
                            />
                          ) : (
                            <div className="h-10 w-14 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <Building className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">
                              {property.title}
                            </div>
                            {property.featured && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {property.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {property.owner_name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {property.owner_id.slice(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                        <Euro className="h-4 w-4 mr-1 text-gray-500" />
                        {property.price.toLocaleString()}
                        {property.listing_type === 'rent' && <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">/muaj</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatPropertyType(property.type)}
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {formatListingType(property.listing_type)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(property.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Eye className="h-4 w-4 mr-1 text-blue-500" />
                          <span>{property.view_count}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Star className="h-4 w-4 mr-1 text-pink-500" />
                          <span>{property.favorite_count}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(property.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <button
                        onClick={() => setShowPropertyMenu(showPropertyMenu === property.id ? null : property.id)}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                      
                      {showPropertyMenu === property.id && (
                        <div className="absolute right-6 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            <a
                              href={`/property/${property.id}`}
                              target="_blank"
                              rel="noopener noreferrer" 
                              className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Shiko
                            </a>
                            
                            <button
                              className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                              onClick={() => {
                                // Open edit property modal
                                alert('Funksioni i editimit do të implementohet së shpejti');
                                setShowPropertyMenu(null);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edito
                            </button>
                            
                            {property.status === 'pending' && (
                              <>
                                <button
                                  className="w-full text-left block px-4 py-2 text-sm text-green-700 dark:text-green-200 hover:bg-green-50 dark:hover:bg-green-900/30 flex items-center"
                                  onClick={() => {
                                    setPropertyToUpdateStatus(property);
                                    setNewStatus('active');
                                    setIsStatusModalOpen(true);
                                    setShowPropertyMenu(null);
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Aprovo
                                </button>
                                
                                <button
                                  className="w-full text-left block px-4 py-2 text-sm text-red-700 dark:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center"
                                  onClick={() => {
                                    setPropertyToUpdateStatus(property);
                                    setNewStatus('rejected');
                                    setIsStatusModalOpen(true);
                                    setShowPropertyMenu(null);
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Refuzo
                                </button>
                              </>
                            )}
                            
                            {property.status !== 'pending' && (
                              <button
                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                                onClick={() => {
                                  setPropertyToUpdateStatus(property);
                                  setNewStatus('');
                                  setIsStatusModalOpen(true);
                                  setShowPropertyMenu(null);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Ndrysho statusin
                              </button>
                            )}
                            
                            <button
                              className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                              onClick={() => {
                                // Toggle feature status
                                setPropertyToToggleFeature(property);
                                setIsFeatureModalOpen(true);
                                setShowPropertyMenu(null);
                              }}
                            >
                              {property.featured ? (
                                <>
                                  <StarOff className="h-4 w-4 mr-2" />
                                  Hiq reklamimin
                                </>
                              ) : (
                                <>
                                  <Star className="h-4 w-4 mr-2" />
                                  Shto në të reklamuara
                                </>
                              )}
                            </button>
                            
                            <button
                              className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center"
                              onClick={() => {
                                // Open delete confirmation
                                setPropertyToDelete(property);
                                setIsDeleteModalOpen(true);
                                setShowPropertyMenu(null);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Fshij
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && properties.length > 0 && (
          <nav className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Po shfaqen <span className="font-medium">{(currentPage - 1) * propertiesPerPage + 1}</span> deri <span className="font-medium">{Math.min(currentPage * propertiesPerPage, (totalPages - 1) * propertiesPerPage + properties.length)}</span> nga <span className="font-medium">{(totalPages - 1) * propertiesPerPage + properties.length}</span> prona
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium ${
                      currentPage === 1
                        ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page numbers */}
                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    const showPage = 
                      pageNum === 1 || 
                      pageNum === totalPages || 
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                    
                    if (!showPage && pageNum === currentPage - 2) {
                      return (
                        <span key="dots-1" className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                          ...
                        </span>
                      );
                    }
                    
                    if (!showPage && pageNum === currentPage + 2) {
                      return (
                        <span key="dots-2" className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                          ...
                        </span>
                      );
                    }
                    
                    if (!showPage) {
                      return null;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        aria-current={pageNum === currentPage ? 'page' : undefined}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pageNum === currentPage
                            ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-200'
                            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium ${
                      currentPage === totalPages
                        ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </nav>
        )}
      </div>
      
      {/* Delete Property Modal */}
      {isDeleteModalOpen && propertyToDelete && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 overflow-hidden shadow-xl transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900 rounded-full mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-300" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 dark:text-white mb-4">
                Konfirmo fshirjen e pronës
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                Jeni i sigurt që dëshironi të fshini pronën <span className="font-medium text-gray-900 dark:text-white">{propertyToDelete.title}</span>? 
                Kjo veprim nuk mund të kthehet dhe të gjitha të dhënat e pronës do të fshihen përgjithmonë.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setPropertyToDelete(null);
                  }}
                >
                  Anulo
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                  onClick={handleDeleteProperty}
                >
                  Fshij
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Toggle Feature Modal */}
      {isFeatureModalOpen && propertyToToggleFeature && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsFeatureModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 overflow-hidden shadow-xl transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 dark:bg-yellow-900 rounded-full mb-4">
                {propertyToToggleFeature.featured ? (
                  <StarOff className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                ) : (
                  <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                )}
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 dark:text-white mb-4">
                {propertyToToggleFeature.featured ? 'Hiq reklamimin' : 'Shto në të reklamuara'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                {propertyToToggleFeature.featured ? (
                  <>
                    Jeni i sigurt që dëshironi të hiqni reklamimin për pronën <span className="font-medium text-gray-900 dark:text-white">{propertyToToggleFeature.title}</span>? 
                    Kjo pronë nuk do të shfaqet më në listën e pronave të reklamuara.
                  </>
                ) : (
                  <>
                    Jeni i sigurt që dëshironi të shtoni pronën <span className="font-medium text-gray-900 dark:text-white">{propertyToToggleFeature.title}</span> në listën e pronave të reklamuara? 
                    Kjo pronë do të shfaqet në mënyrë më të dukshme në platformë.
                  </>
                )}
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                  onClick={() => {
                    setIsFeatureModalOpen(false);
                    setPropertyToToggleFeature(null);
                  }}
                >
                  Anulo
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                    propertyToToggleFeature.featured 
                      ? 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500' 
                      : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                  }`}
                  onClick={handleToggleFeature}
                >
                  {propertyToToggleFeature.featured ? 'Hiq reklamimin' : 'Shto në të reklamuara'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {isStatusModalOpen && propertyToUpdateStatus && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsStatusModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 overflow-hidden shadow-xl transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                {newStatus === 'active' ? (
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
                ) : newStatus === 'rejected' ? (
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-300" />
                ) : (
                  <Edit className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                )}
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 dark:text-white mb-4">
                {newStatus === 'active' ? 'Aprovo Pronën' : 
                 newStatus === 'rejected' ? 'Refuzo Pronën' : 
                 'Ndrysho Statusin e Pronës'}
              </h3>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                {newStatus === 'active' ? (
                  <>Jeni i sigurt që dëshironi të aprovoni pronën <span className="font-medium text-gray-900 dark:text-white">{propertyToUpdateStatus.title}</span>?</>
                ) : newStatus === 'rejected' ? (
                  <>Jeni i sigurt që dëshironi të refuzoni pronën <span className="font-medium text-gray-900 dark:text-white">{propertyToUpdateStatus.title}</span>?</>
                ) : (
                  <>Zgjidhni statusin e ri për pronën <span className="font-medium text-gray-900 dark:text-white">{propertyToUpdateStatus.title}</span></>
                )}
              </p>
              
              {!newStatus && (
                <div className="mb-4">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Statusi i ri
                  </label>
                  <select
                    id="status"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    required
                  >
                    <option value="">Zgjidhni statusin</option>
                    <option value="active">Aktiv</option>
                    <option value="inactive">Joaktiv</option>
                    <option value="pending">Në pritje</option>
                    <option value="rejected">Refuzuar</option>
                    <option value="sold">Shitur</option>
                    <option value="rented">Dhënë me qira</option>
                  </select>
                </div>
              )}
              
              {(newStatus === 'rejected' || newStatus === 'active') && (
                <div className="mb-4">
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {newStatus === 'rejected' ? 'Arsyeja e refuzimit' : 'Komente shtesë (opsionale)'}
                  </label>
                  <textarea
                    id="reason"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder={newStatus === 'rejected' ? "Shënoni arsyen për refuzimin..." : "Komente shtesë për pronarin..."}
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    required={newStatus === 'rejected'}
                  ></textarea>
                </div>
              )}
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                  onClick={() => {
                    setIsStatusModalOpen(false);
                    setPropertyToUpdateStatus(null);
                    setNewStatus('');
                    setStatusReason('');
                  }}
                >
                  Anulo
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                    newStatus === 'active' 
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                      : newStatus === 'rejected'
                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  }`}
                  onClick={handleUpdateStatus}
                  disabled={!newStatus || (newStatus === 'rejected' && !statusReason)}
                >
                  {newStatus === 'active' ? 'Aprovo' : 
                   newStatus === 'rejected' ? 'Refuzo' : 
                   'Ndrysho Statusin'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProperties;