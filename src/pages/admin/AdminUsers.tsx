import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../layouts/AdminLayout';
import AdminControls from '../../components/AdminControls';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  User, 
  Edit, 
  Trash2, 
  ShieldCheck, 
  ShieldOff, 
  Mail,
  EyeOff,
  Copy,
  AlertCircle
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  user_type: string;
  is_premium: boolean;
  premium_until: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  email?: string;
  personal_id: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<string>('');
  const [premiumFilter, setPremiumFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUserMenu, setShowUserMenu] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [userToTogglePremium, setUserToTogglePremium] = useState<UserProfile | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showIdGuidance, setShowIdGuidance] = useState(false);
  const [showAdminControls, setShowAdminControls] = useState(false);
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const usersPerPage = 10;

  // First check if current user is admin to prevent permission errors
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Get current user's profile to check admin status
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', (await supabase.auth.getUser()).data.user?.id || '')
          .single();
          
        if (profileError) {
          console.error("Error checking admin status:", profileError);
          setError("Error checking admin privileges");
          setAdminCheckComplete(true);
          return;
        }
        
        setIsAdmin(profile?.is_admin || false);
        setAdminCheckComplete(true);
        
        if (profile?.is_admin) {
          fetchUsers();
        }
      } catch (err) {
        console.error("Error in admin check:", err);
        setError("Error verifying admin status");
        setAdminCheckComplete(true);
      }
    };
    
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [currentPage, userTypeFilter, premiumFilter, isAdmin]);

  const fetchUsers = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      console.log("Fetching all users as admin");
      
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (userTypeFilter) {
        query = query.eq('user_type', userTypeFilter);
      }
      
      if (premiumFilter === 'premium') {
        query = query.eq('is_premium', true);
      } else if (premiumFilter === 'basic') {
        query = query.eq('is_premium', false);
      }
      
      // Apply search if provided
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      // Apply pagination
      const from = (currentPage - 1) * usersPerPage;
      const to = from + usersPerPage - 1;
      
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) {
        throw error;
      }
      
      // Use the profiles data directly
      if (data) {
        console.log(`Fetched ${data.length} users`);
        setUsers(data);
      } else {
        console.log("No user data returned");
      }
      
      if (count !== null) {
        setTotalPages(Math.ceil(count / usersPerPage));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchUsers();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatUserType = (type: string) => {
    const types: Record<string, string> = {
      'buyer': 'Blerës',
      'seller': 'Shitës',
      'renter': 'Qiramarrës',
      'landlord': 'Qiradhënës'
    };
    return types[type] || type;
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      // Delete the profile first (this will cascade to auth user)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete.id);
      
      if (error) {
        throw error;
      }
      
      // Refresh the user list
      fetchUsers();
      
      // Close the modal
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Ndodhi një gabim gjatë fshirjes së përdoruesit');
    }
  };

  const handleTogglePremium = async () => {
    if (!userToTogglePremium) return;
    
    try {
      // Calculate premium_until date (3 months from now if setting to premium)
      const premiumUntil = userToTogglePremium.is_premium 
        ? null 
        : new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString();
      
      // Update the profile
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_premium: !userToTogglePremium.is_premium,
          premium_until: premiumUntil
        })
        .eq('id', userToTogglePremium.id);
      
      if (error) {
        throw error;
      }
      
      // Refresh the user list
      fetchUsers();
      
      // Close the modal
      setIsPremiumModalOpen(false);
      setUserToTogglePremium(null);
    } catch (error) {
      console.error('Error updating user premium status:', error);
      alert('Ndodhi një gabim gjatë ndryshimit të statusit premium');
    }
  };

  const copyPersonalId = (userId: string, personalId: string) => {
    navigator.clipboard.writeText(personalId).then(() => {
      setCopiedId(userId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  if (!adminCheckComplete) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="px-4 py-5 sm:px-6 text-center">
          <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg inline-flex items-start">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
            <div className="text-left">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Access Denied</h3>
              <p className="mt-2 text-red-700 dark:text-red-400">
                You do not have admin privileges to view this page.
              </p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Menaxhimi i Përdoruesve</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Shikoni dhe menaxhoni përdoruesit e platformës
        </p>
      </div>
      
      {/* Personal ID Guidance */}
      <div className="mb-6 px-4 sm:px-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 relative">
          <button 
            onClick={() => setShowIdGuidance(!showIdGuidance)} 
            className="absolute top-2 right-2 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
          >
            {showIdGuidance ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            )}
          </button>
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Udhëzime për ID-të personale
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                <p>
                  ID-të personale (Personal ID) janë private dhe duhet përdorur vetëm për identifikim të klientëve në komunikim të drejtpërdrejtë. 
                  {showIdGuidance && (
                    <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
                      <li>Kërkoni këtë ID vetëm nga klientët për qëllime verifikimi</li>
                      <li>Mos e ndani asnjëherë ID-në e një klienti me dikë tjetër</li>
                      <li>Përdorni ID-të për të verifikuar identitetin e klientëve gjatë komunikimit telefonik</li>
                      <li>ID-të personale nuk duhet të shfaqen në dokumente publike</li>
                      <li>Kërkoni ID-në personale nga klientët kur nevojitet verifikim shtesë i identitetit</li>
                    </ul>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Admin Controls Toggle Button */}
      <div className="px-4 sm:px-6 mb-6">
        <button
          type="button"
          onClick={() => setShowAdminControls(!showAdminControls)}
          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ShieldCheck className="mr-2 h-5 w-5" />
          {showAdminControls ? 'Fshih kontrollet e administratorit' : 'Menaxho privilegjet e administratorit'}
        </button>
      </div>
      
      {/* Admin Controls Component */}
      {showAdminControls && (
        <div className="px-4 sm:px-6 mb-6">
          <AdminControls onUserUpdated={fetchUsers} />
        </div>
      )}
      
      {/* Filters and search */}
      <div className="mb-6 px-4 sm:px-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <form onSubmit={handleSearch} className="relative flex-1">
              <input
                type="text"
                placeholder="Kërko përdorues..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <button type="submit" className="hidden">Search</button>
            </form>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500"
                  value={userTypeFilter}
                  onChange={(e) => {
                    setUserTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Të gjithë tipet</option>
                  <option value="buyer">Blerës</option>
                  <option value="seller">Shitës</option>
                  <option value="renter">Qiramarrës</option>
                  <option value="landlord">Qiradhënës</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <ShieldCheck className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500"
                  value={premiumFilter}
                  onChange={(e) => {
                    setPremiumFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Të gjithë</option>
                  <option value="premium">Premium</option>
                  <option value="basic">Bazik</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Users table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden px-4 sm:px-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-6 max-w-md">
              <div className="flex">
                <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Error Loading Users</h3>
                  <p className="mt-2 text-red-700 dark:text-red-400">{error}</p>
                  <button 
                    onClick={() => fetchUsers()}
                    className="mt-4 px-4 py-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-10">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nuk u gjet asnjë përdorues</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Provoni të ndryshoni filtrat ose termit e kërkimit
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Përdoruesi
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ID Personale
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Lloji
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Statusi
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Admin
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data e regj.
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Veprimet
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {user.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-blue-600 dark:text-blue-400">
                          {user.personal_id}
                        </div>
                        <button 
                          onClick={() => copyPersonalId(user.id, user.personal_id)}
                          className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title="Kopjo ID-në"
                        >
                          {copiedId === user.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatUserType(user.user_type)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.is_premium 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {user.is_premium ? 'Premium' : 'Bazik'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.is_admin 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {user.is_admin ? 'Po' : 'Jo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <button
                        onClick={() => setShowUserMenu(showUserMenu === user.id ? null : user.id)}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                      
                      {showUserMenu === user.id && (
                        <div className="absolute right-6 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            <button
                              className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                              onClick={() => {
                                // Open edit user modal
                                alert('Funksioni i editimit do të implementohet së shpejti');
                                setShowUserMenu(null);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edito
                            </button>
                            
                            <button
                              className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                              onClick={() => {
                                // Toggle premium status
                                setUserToTogglePremium(user);
                                setIsPremiumModalOpen(true);
                                setShowUserMenu(null);
                              }}
                            >
                              {user.is_premium ? (
                                <>
                                  <ShieldOff className="h-4 w-4 mr-2" />
                                  Hiq statusin premium
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="h-4 w-4 mr-2" />
                                  Bëje premium
                                </>
                              )}
                            </button>
                            
                            <button
                              className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center"
                              onClick={() => {
                                // Open delete confirmation
                                setUserToDelete(user);
                                setIsDeleteModalOpen(true);
                                setShowUserMenu(null);
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
        {!loading && !error && users.length > 0 && (
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
                  Po shfaqen <span className="font-medium">{(currentPage - 1) * usersPerPage + 1}</span> deri <span className="font-medium">{Math.min(currentPage * usersPerPage, (totalPages - 1) * usersPerPage + users.length)}</span> nga <span className="font-medium">{(totalPages - 1) * usersPerPage + users.length}</span> përdorues
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
      
      {/* Delete User Modal */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 overflow-hidden shadow-xl transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900 rounded-full mb-4">
                <EyeOff className="h-6 w-6 text-red-600 dark:text-red-300" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 dark:text-white mb-4">
                Konfirmo fshirjen e përdoruesit
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                Jeni i sigurt që dëshironi të fshini përdoruesin <span className="font-medium text-gray-900 dark:text-white">{userToDelete.name}</span>? 
                Kjo veprim nuk mund të kthehet dhe të gjitha të dhënat e përdoruesit do të fshihen përgjithmonë.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setUserToDelete(null);
                  }}
                >
                  Anulo
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                  onClick={handleDeleteUser}
                >
                  Fshij
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Toggle Premium Modal */}
      {isPremiumModalOpen && userToTogglePremium && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsPremiumModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 overflow-hidden shadow-xl transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 dark:bg-yellow-900 rounded-full mb-4">
                {userToTogglePremium.is_premium ? (
                  <ShieldOff className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                ) : (
                  <ShieldCheck className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                )}
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 dark:text-white mb-4">
                {userToTogglePremium.is_premium ? 'Hiq statusin premium' : 'Aktivizo statusin premium'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                {userToTogglePremium.is_premium ? (
                  <>
                    Jeni i sigurt që dëshironi të hiqni statusin premium për përdoruesin <span className="font-medium text-gray-900 dark:text-white">{userToTogglePremium.name}</span>? 
                    Ky përdorues do të humbasë të gjitha përparësitë premium.
                  </>
                ) : (
                  <>
                    Jeni i sigurt që dëshironi të aktivizoni statusin premium për përdoruesin <span className="font-medium text-gray-900 dark:text-white">{userToTogglePremium.name}</span>? 
                    Ky përdorues do të ketë qasje në të gjitha funksionet premium.
                  </>
                )}
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                  onClick={() => {
                    setIsPremiumModalOpen(false);
                    setUserToTogglePremium(null);
                  }}
                >
                  Anulo
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                    userToTogglePremium.is_premium 
                      ? 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500' 
                      : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                  }`}
                  onClick={handleTogglePremium}
                >
                  {userToTogglePremium.is_premium ? 'Hiq Premium' : 'Aktivizo Premium'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;