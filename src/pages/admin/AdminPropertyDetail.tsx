import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  ArrowLeft, 
  Check, 
  X, 
  Edit, 
  Trash2, 
  MapPin, 
  Building, 
  BedDouble, 
  Bath, 
  Square, 
  Euro, 
  Calendar, 
  Clock, 
  Star,
  StarOff,
  User,
  Eye,
  Heart,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Copy,
  Info
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

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
  created_at: string | null;
  updated_at: string | null;
  status: string;
  featured: boolean | null;
  owner_id: string;
  owner?: {
    name: string;
    email?: string;
    user_type: string;
    is_premium: boolean;
    personal_id: string;
  };
  view_count?: number;
  favorite_count?: number;
}

const AdminPropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copiedId, setCopiedId] = useState(false);
  const [showIdInfo, setShowIdInfo] = useState(false);
  
  // Modals state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusReason, setStatusReason] = useState<string>('');
  
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch the property details
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();
          
        if (propertyError) {
          throw propertyError;
        }
        
        if (!propertyData) {
          throw new Error('Prona nuk u gjet');
        }
        
        // Fetch owner details
        const { data: ownerData, error: ownerError } = await supabase
          .from('profiles')
          .select('name, user_type, is_premium, personal_id')
          .eq('id', propertyData.owner_id)
          .single();
          
        if (ownerError) {
          console.error('Error fetching owner:', ownerError);
        }
        
        // Fetch view count
        const { count: viewCount, error: viewError } = await supabase
          .from('property_views')
          .select('*', { count: 'exact', head: true })
          .eq('property_id', id);
          
        if (viewError) {
          console.error('Error fetching view count:', viewError);
        }
        
        // Fetch favorite count
        const { count: favoriteCount, error: favoriteError } = await supabase
          .from('favorites')
          .select('*', { count: 'exact', head: true })
          .eq('property_id', id);
          
        if (favoriteError) {
          console.error('Error fetching favorite count:', favoriteError);
        }
        
        setProperty({
          ...propertyData,
          owner: ownerData || undefined,
          view_count: viewCount || 0,
          favorite_count: favoriteCount || 0
        });
      } catch (err) {
        console.error('Error fetching property details:', err);
        setError(err instanceof Error ? err.message : 'Ndodhi një gabim i papritur');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [id]);
  
  const nextImage = () => {
    if (!property?.images || property.images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % property.images!.length);
  };

  const prevImage = () => {
    if (!property?.images || property.images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === 0 ? property.images!.length - 1 : prev - 1));
  };
  
  const handleDeleteProperty = async () => {
    if (!property) return;
    
    try {
      // Delete the property
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', property.id);
      
      if (error) {
        throw error;
      }
      
      // Navigate back to properties list
      navigate('/admin/properties');
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Ndodhi një gabim gjatë fshirjes së pronës');
    }
  };
  
  const handleToggleFeature = async () => {
    if (!property) return;
    
    try {
      // Update the property featured status
      const { error } = await supabase
        .from('properties')
        .update({ featured: !property.featured })
        .eq('id', property.id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setProperty(prev => {
        if (!prev) return prev;
        return { ...prev, featured: !prev.featured };
      });
      
      // Close modal
      setIsFeatureModalOpen(false);
    } catch (error) {
      console.error('Error toggling feature status:', error);
      alert('Ndodhi një gabim gjatë përditësimit të statusit të veçantë');
    }
  };
  
  const handleUpdateStatus = async () => {
    if (!property || !newStatus) return;
    
    try {
      // Update property status
      const { error: updateError } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', property.id);
        
      if (updateError) {
        throw updateError;
      }
      
      // Create a notification for the property owner
      const notificationTitle = newStatus === 'active' 
        ? 'Prona u aprovua!' 
        : newStatus === 'rejected' 
          ? 'Prona u refuzua' 
          : `Statusi i pronës u ndryshua në "${newStatus}"`;
          
      const notificationMessage = statusReason || 
        (newStatus === 'active' 
          ? 'Prona juaj u aprovua dhe tani është aktive në platformë.' 
          : newStatus === 'rejected' 
            ? 'Prona juaj u refuzua. Ju lutem kontaktoni administratorin për më shumë informacion.' 
            : `Statusi i pronës suaj u ndryshua në "${newStatus}".`);
          
      const notificationType = newStatus === 'active' 
        ? 'approval' 
        : newStatus === 'rejected' 
          ? 'rejection' 
          : 'status_change';
      
      // Insert notification
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: property.owner_id,
          title: notificationTitle,
          message: notificationMessage,
          type: notificationType,
          property_id: property.id
        });
        
      if (notificationError) {
        console.error('Error creating notification:', notificationError);
        // Continue anyway since the status was updated
      }
      
      // Update local state
      setProperty(prev => {
        if (!prev) return prev;
        return { ...prev, status: newStatus };
      });
      
      // Close modal and reset form
      setIsStatusModalOpen(false);
      setNewStatus('');
      setStatusReason('');
    } catch (error) {
      console.error('Error updating property status:', error);
      alert('Ndodhi një gabim gjatë përditësimit të statusit');
    }
  };
  
  // Format property type for display
  const formatPropertyType = (type: string) => {
    const types: Record<string, string> = {
      'apartment': 'Banesë',
      'house': 'Shtëpi',
      'land': 'Tokë',
      'commercial': 'Lokal'
    };
    return types[type] || type;
  };

  // Format listing type for display
  const formatListingType = (type: string) => {
    return type === 'rent' ? 'Me qira' : 'Në shitje';
  };
  
  // Get status badge with color
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
  
  // Get the current image to display
  const currentImage = property?.images && property.images.length > 0 
    ? property.images[currentImageIndex] 
    : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1773&q=80';
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Copy personal ID to clipboard
  const copyPersonalId = () => {
    if (property?.owner?.personal_id) {
      navigator.clipboard.writeText(property.owner.personal_id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }
  
  if (error || !property) {
    return (
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-6">
            <Link to="/admin/properties" className={`flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kthehu te lista e pronave
            </Link>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/30 p-8 rounded-lg text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 dark:text-red-300">
              {error || 'Prona nuk u gjet'}
            </h3>
            <p className="mt-2 text-red-700 dark:text-red-400">
              Prona që kërkuat nuk ekziston ose ka ndodhur një gabim gjatë marrjes së të dhënave.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Back button and property status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-3 sm:space-y-0">
          <div className="flex items-center">
            <Link to="/admin/properties" className={`flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kthehu te lista e pronave
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Statusi aktual:</span>
            {getStatusBadge(property.status)}
            
            <div className="ml-4 flex space-x-2">
              {property.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      setNewStatus('active');
                      setStatusReason('');
                      setIsStatusModalOpen(true);
                    }}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/40"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aprovo
                  </button>
                  
                  <button
                    onClick={() => {
                      setNewStatus('rejected');
                      setStatusReason('');
                      setIsStatusModalOpen(true);
                    }}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/40"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Refuzo
                  </button>
                </>
              )}
              
              <button
                onClick={() => {
                  setNewStatus('');
                  setStatusReason('');
                  setIsStatusModalOpen(true);
                }}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40"
              >
                <Edit className="h-4 w-4 mr-1" />
                Ndrysho statusin
              </button>
            </div>
          </div>
        </div>
        
        {/* Property header */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-6`}>
          <div className="flex flex-col lg:flex-row lg:items-start justify-between">
            <div className="flex-1">
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {property.title}
                {property.featured && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                    Premium
                  </span>
                )}
              </h1>
              
              <div className="flex items-center mt-2">
                <MapPin className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-1`} />
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{property.location}</span>
              </div>
              
              <div className="flex flex-wrap items-center mt-3 gap-3">
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${
                  property.type === 'apartment' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                  property.type === 'house' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                  property.type === 'land' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}>
                  <Building className="h-4 w-4 mr-1" />
                  {formatPropertyType(property.type)}
                </div>
                
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${
                  property.listing_type === 'rent' 
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' 
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                }`}>
                  {formatListingType(property.listing_type)}
                </div>
                
                {/* Price badge */}
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  <Euro className="h-4 w-4 mr-1" />
                  {property.price.toLocaleString()}
                  {property.listing_type === 'rent' && <span className="ml-1 text-xs">/muaj</span>}
                </div>
              </div>
            </div>
            
            {/* Owner info */}
            <div className="mt-4 lg:mt-0 lg:ml-4 flex-shrink-0">
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Informacionet e pronarit
                  </h3>
                  <button 
                    onClick={() => setShowIdInfo(!showIdInfo)} 
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    title="Informacion mbi ID-në personale"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </div>
                
                {showIdInfo && (
                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                    <p className="font-medium mb-1">Udhëzime për përdorimin e ID-së personale:</p>
                    <ul className="list-disc ml-4 space-y-0.5">
                      <li>Kërko ID-në personale nga klienti vetëm për verifikim</li>
                      <li>Mos e ndaj këtë ID me palë të treta</li>
                      <li>Përdor ID-në vetëm për identifikim të klientëve në komunikim direkt</li>
                    </ul>
                  </div>
                )}
                
                <div className="flex items-center mt-2">
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {property.owner?.name.charAt(0) || 'U'}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {property.owner?.name || 'N/A'}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {property.owner?.user_type === 'seller' ? 'Shitës' : 
                       property.owner?.user_type === 'landlord' ? 'Qiradhënës' : 
                       property.owner?.user_type}
                      {property.owner?.is_premium && (
                        <span className="ml-1 text-yellow-500">★ Premium</span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ID:</span>
                  <span className={`font-mono ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {property.owner_id.substring(0, 8)}...
                  </span>
                </div>
                
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ID Personale:</span>
                  <div className="flex items-center">
                    <span className={`font-mono bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                      {property.owner?.personal_id || 'N/A'}
                    </span>
                    <button 
                      onClick={copyPersonalId}
                      className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      title="Kopjo ID-në"
                    >
                      {copiedId ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Property content in two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - Images and details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Fotot e pronës
              </h2>
              
              <div className="relative rounded-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={currentImage} 
                    alt={property.title} 
                    className="w-full h-[400px] object-cover"
                  />
                  
                  {/* Image navigation arrows */}
                  {property.images && property.images.length > 1 && (
                    <>
                      <button 
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                        aria-label="Previous image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button 
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                        aria-label="Next image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Thumbnail navigation */}
              {property.images && property.images.length > 1 && (
                <div className="flex overflow-x-auto mt-2 space-x-2 p-2">
                  {property.images.map((image, index) => (
                    <button 
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden transition-all ${
                        index === currentImageIndex ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              
              {(!property.images || property.images.length === 0) && (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  Nuk ka foto të ngarkuara për këtë pronë
                </div>
              )}
            </div>
            
            {/* Description */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Përshkrimi
              </h2>
              
              <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {property.description}
              </div>
            </div>
            
            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                  Veçoritë
                </h2>
                
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature, index) => (
                    <span 
                      key={index} 
                      className={`px-3 py-1 rounded-full text-sm ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Side column - Stats and actions */}
          <div className="space-y-6">
            {/* Guidance for Personal ID */}
            <div className={`${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} border ${darkMode ? 'border-blue-800' : 'border-blue-200'} rounded-lg p-4`}>
              <div className="flex items-center mb-2">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>Udhëzime për ID-në personale</h3>
              </div>
              <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'} mb-2`}>
                ID-ja personale duhet përdorur vetëm për verifikim të identitetit të klientit:
              </p>
              <ul className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-700'} list-disc pl-5 space-y-1`}>
                <li>Kërkoje këtë ID nga klienti vetëm kur nevojitet verifikim</li>
                <li>Përdore për të verifikuar identitetin e klientit gjatë thirrjeve telefonike</li>
                <li>Mos e ndaj me palë të treta apo në komunikime publike</li>
                <li>Në komunikim me klientin, mund t'i kërkosh "ID-në personale nga platforma"</li>
                <li>Kjo ID nuk duhet përdorur për qëllime të tjera përveç verifikimit</li>
              </ul>
            </div>
                        
            {/* Property details */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Detajet e pronës
              </h2>
              
              <div className="space-y-3">
                {(property.type === 'apartment' || property.type === 'house') && (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <BedDouble className={`h-5 w-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Dhoma</span>
                      </div>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {property.rooms || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Bath className={`h-5 w-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Banjo</span>
                      </div>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {property.bathrooms || 'N/A'}
                      </span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Square className={`h-5 w-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Sipërfaqja</span>
                  </div>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {property.area ? `${property.area} m²` : 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Calendar className={`h-5 w-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Krijuar më</span>
                  </div>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatDate(property.created_at)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className={`h-5 w-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Përditësuar më</span>
                  </div>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatDate(property.updated_at)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Statistics */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Statistikat
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                  <div className="flex items-center mb-1">
                    <Eye className={`h-4 w-4 mr-1 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                    <span className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Shikime</span>
                  </div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {property.view_count}
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-pink-900/20' : 'bg-pink-50'}`}>
                  <div className="flex items-center mb-1">
                    <Heart className={`h-4 w-4 mr-1 ${darkMode ? 'text-pink-400' : 'text-pink-500'}`} />
                    <span className={`text-sm ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>Favorite</span>
                  </div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {property.favorite_count}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Veprime
              </h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => setIsFeatureModalOpen(true)}
                  className={`w-full flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium ${
                    property.featured 
                      ? 'border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300 dark:hover:bg-yellow-900/30' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {property.featured ? (
                    <>
                      <StarOff className="h-5 w-5 mr-2" />
                      Hiq nga të reklamuarat
                    </>
                  ) : (
                    <>
                      <Star className="h-5 w-5 mr-2" />
                      Shto në të reklamuara
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    // Edit property - redirect to edit page
                    navigate(`/admin/properties/edit/${property.id}`);
                  }}
                  className={`w-full flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium 
                    border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 
                    dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30`}
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Edito pronën
                </button>
                
                <button
                  onClick={() => {
                    // Contact property owner - implement messaging or generate email
                    alert('Funksionaliteti i kontaktimit të pronarit do të implementohet së shpejti');
                  }}
                  className={`w-full flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium 
                    border-green-300 bg-green-50 text-green-700 hover:bg-green-100 
                    dark:border-green-700 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30`}
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Kontakto pronarin
                </button>
                
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className={`w-full flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium 
                    border-red-300 bg-red-50 text-red-700 hover:bg-red-100 
                    dark:border-red-700 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30`}
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Fshij pronën
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Delete Modal */}
        {isDeleteModalOpen && (
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
                  Jeni i sigurt që dëshironi të fshini pronën <span className="font-medium text-gray-900 dark:text-white">{property.title}</span>? 
                  Kjo veprim nuk mund të kthehet dhe të gjitha të dhënat e pronës do të fshihen përgjithmonë.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                    onClick={() => setIsDeleteModalOpen(false)}
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
        {isFeatureModalOpen && (
          <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsFeatureModalOpen(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 overflow-hidden shadow-xl transform transition-all">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 dark:bg-yellow-900 rounded-full mb-4">
                  {property.featured ? (
                    <StarOff className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                  ) : (
                    <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-center text-gray-900 dark:text-white mb-4">
                  {property.featured ? 'Hiq reklamimin' : 'Shto në të reklamuara'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                  {property.featured ? (
                    <>
                      Jeni i sigurt që dëshironi të hiqni reklamimin për pronën <span className="font-medium text-gray-900 dark:text-white">{property.title}</span>? 
                      Kjo pronë nuk do të shfaqet më në listën e pronave të reklamuara.
                    </>
                  ) : (
                    <>
                      Jeni i sigurt që dëshironi të shtoni pronën <span className="font-medium text-gray-900 dark:text-white">{property.title}</span> në listën e pronave të reklamuara? 
                      Kjo pronë do të shfaqet në mënyrë më të dukshme në platformë.
                    </>
                  )}
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                    onClick={() => setIsFeatureModalOpen(false)}
                  >
                    Anulo
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                      property.featured 
                        ? 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500' 
                        : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                    }`}
                    onClick={handleToggleFeature}
                  >
                    {property.featured ? 'Hiq reklamimin' : 'Shto në të reklamuara'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Update Status Modal */}
        {isStatusModalOpen && (
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
                    <>Jeni i sigurt që dëshironi të aprovoni pronën <span className="font-medium text-gray-900 dark:text-white">{property.title}</span>?</>
                  ) : newStatus === 'rejected' ? (
                    <>Jeni i sigurt që dëshironi të refuzoni pronën <span className="font-medium text-gray-900 dark:text-white">{property.title}</span>?</>
                  ) : (
                    <>Zgjidhni statusin e ri për pronën <span className="font-medium text-gray-900 dark:text-white">{property.title}</span></>
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
                
                {(newStatus === 'rejected' || newStatus === '') && (
                  <div className="mb-4">
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Arsyeja (opsionale)
                    </label>
                    <textarea
                      id="reason"
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Shënoni arsyen për ndryshimin e statusit..."
                      value={statusReason}
                      onChange={(e) => setStatusReason(e.target.value)}
                    ></textarea>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                    onClick={() => {
                      setIsStatusModalOpen(false);
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
                    disabled={!newStatus && newStatus !== 'active' && newStatus !== 'rejected'}
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
        
      </div>
    </AdminLayout>
  );
};

export default AdminPropertyDetail;