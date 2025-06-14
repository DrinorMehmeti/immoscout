import React, { useState, useEffect } from 'react';
import { Star, Search, User, Calendar, Filter, Building, MapPin, ThumbsUp, MessageSquare, Award, StarHalf, StarOff, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

// Interface für Bewertungs-Daten
interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  propertyId?: string;
  propertyName?: string;
  propertyType?: string;
  propertyLocation?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
  isVerifiedPurchase: boolean;
  category: 'property' | 'service' | 'platform';
}

const ReviewsPage: React.FC = () => {
  const { darkMode } = useTheme();
  const { authState } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [helpfulClicks, setHelpfulClicks] = useState<Record<string, boolean>>({});

  // Mock-Daten für Bewertungen
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // In einer echten Anwendung würde hier ein Supabase-Aufruf stehen
        // Für Demo-Zwecke verwenden wir Mockdaten
        
        const mockReviews: Review[] = [
          {
            id: '1',
            userId: 'user1',
            userName: 'Arben Gashi',
            propertyId: 'prop1',
            propertyName: 'Banesë në qendër të Prishtinës',
            propertyType: 'apartment',
            propertyLocation: 'Prishtinë',
            rating: 5,
            title: 'Përvojë e shkëlqyer',
            comment: 'Kam pasur një përvojë shumë të mirë me këtë platformë. Gjeta shtëpinë time të re brenda 2 javësh dhe procesi ishte shumë i thjeshtë. Stafi ishte shumë profesional dhe i dobishëm.',
            date: '2023-10-15',
            helpful: 12,
            isVerifiedPurchase: true,
            category: 'platform'
          },
          {
            id: '2',
            userId: 'user2',
            userName: 'Luljeta Berisha',
            userAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
            propertyId: 'prop2',
            propertyName: 'Shtëpi me oborr në Pejë',
            propertyType: 'house',
            propertyLocation: 'Pejë',
            rating: 4,
            title: 'Shtëpi e mrekullueshme',
            comment: 'Shtëpia ishte pikërisht si në përshkrim. E pastër, e mirëmbajtur dhe në një lokacion të shkëlqyer. Vetëm që kishte pak vonesa në komunikim me pronarin, përndryshe gjithçka ishte perfekte.',
            date: '2023-09-22',
            helpful: 8,
            isVerifiedPurchase: true,
            category: 'property'
          },
          {
            id: '3',
            userId: 'user3',
            userName: 'Faton Krasniqi',
            propertyId: 'prop3',
            propertyName: 'Lokal në qendër të Prizrenit',
            propertyType: 'commercial',
            propertyLocation: 'Prizren',
            rating: 3,
            title: 'Përvojë mesatare',
            comment: 'Platforma është e mirë, por ka vend për përmirësim. Disa veçori nuk janë shumë intuitive dhe nganjëherë ka probleme teknike. Por në përgjithësi, shërbimi është i mirë.',
            date: '2023-10-05',
            helpful: 5,
            isVerifiedPurchase: false,
            category: 'platform'
          },
          {
            id: '4',
            userId: 'user4',
            userName: 'Mirjeta Hoxha',
            userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80',
            rating: 5,
            title: 'Shërbim i shkëlqyer nga agjenti',
            comment: 'Agjenti im ishte jashtëzakonisht i dobishëm dhe profesional. Ai kuptoi nevojat e mia dhe më tregoi vetëm pronat që përshtateshin me kriteret e mia. Falë tij, gjeta apartamentin perfekt për familjen time.',
            date: '2023-11-02',
            helpful: 15,
            isVerifiedPurchase: true,
            category: 'service'
          },
          {
            id: '5',
            userId: 'user5',
            userName: 'Blerim Shala',
            propertyId: 'prop5',
            propertyName: 'Apartament në Lakeside Residence',
            propertyType: 'apartment',
            propertyLocation: 'Prishtinë',
            rating: 5,
            title: 'Apartament luksoz',
            comment: 'Ky është një nga komplekset më të mira të apartamenteve në Prishtinë. Pamja është fantastike, ndërtesa është moderne dhe ofron të gjitha lehtësirat. Shumë i kënaqur me blerjen time!',
            date: '2023-10-18',
            helpful: 20,
            isVerifiedPurchase: true,
            category: 'property'
          },
          {
            id: '6',
            userId: 'user6',
            userName: 'Vlora Mustafa',
            rating: 2,
            title: 'Nevojitet përmirësim',
            comment: 'Filtrat e kërkimit nuk funksionojnë mirë dhe shpesh shoh prona që nuk përputhen me kriteret e mia. Gjithashtu, disa informacione për pronat janë të pasakta. Shpresoj që këto çështje të zgjidhen së shpejti.',
            date: '2023-09-10',
            helpful: 7,
            isVerifiedPurchase: false,
            category: 'platform'
          },
          {
            id: '7',
            userId: 'user7',
            userName: 'Agron Berisha',
            userAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
            propertyId: 'prop7',
            propertyName: 'Shtëpi me dy kate në Gjakovë',
            propertyType: 'house',
            propertyLocation: 'Gjakovë',
            rating: 4,
            title: 'Shtëpi e mirë, proces i thjeshtë',
            comment: 'Shtëpia është shumë e mirë dhe procesi i blerjes ishte relativisht i thjeshtë. Gjithçka u rregullua brenda një muaji. Dokumentacioni ishte në rregull dhe transferimi i pronësisë shkoi pa probleme.',
            date: '2023-11-05',
            helpful: 9,
            isVerifiedPurchase: true,
            category: 'property'
          },
          {
            id: '8',
            userId: 'user8',
            userName: 'Teuta Krasniqi',
            rating: 5,
            title: 'Rekomandoj këtë platformë',
            comment: 'Jam shumë e kënaqur me shërbimin e ofruar. Faqja është e lehtë për t\'u përdorur, ka shumë opsione dhe informacione të detajuara për secilën pronë. Kërkimi është i shpejtë dhe i saktë. Do ta rekomandoja këtë platformë te të gjithë.',
            date: '2023-10-30',
            helpful: 18,
            isVerifiedPurchase: true,
            category: 'platform'
          }
        ];
        
        setReviews(mockReviews);
        setFilteredReviews(mockReviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Ndodhi një gabim gjatë ngarkimit të vlerësimeve');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Filter reviews based on search and filters
  useEffect(() => {
    if (!reviews.length) return;

    let filtered = [...reviews];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        review => 
          review.title.toLowerCase().includes(query) ||
          review.comment.toLowerCase().includes(query) ||
          review.userName.toLowerCase().includes(query) ||
          (review.propertyName && review.propertyName.toLowerCase().includes(query))
      );
    }

    // Apply rating filter
    if (ratingFilter !== null) {
      filtered = filtered.filter(review => review.rating === ratingFilter);
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(review => review.category === categoryFilter);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'highest') {
        return b.rating - a.rating;
      } else {
        return a.rating - b.rating;
      }
    });

    setFilteredReviews(filtered);
  }, [reviews, searchQuery, ratingFilter, categoryFilter, sortBy]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sq-AL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle helpful click
  const handleHelpfulClick = (reviewId: string) => {
    if (helpfulClicks[reviewId]) return;

    setHelpfulClicks(prev => ({
      ...prev,
      [reviewId]: true
    }));

    setFilteredReviews(prev => 
      prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpful: review.helpful + 1 } 
          : review
      )
    );

    // In einer realen Anwendung würden wir dies auch in die Datenbank speichern
  };

  // Render star ratings
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
        ))}
        {hasHalfStar && <StarHalf className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
        {[...Array(emptyStars)].map((_, i) => (
          <StarOff key={`empty-${i}`} className="h-5 w-5 text-gray-300 dark:text-gray-600" />
        ))}
      </div>
    );
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  // Rating distribution
  const getRatingDistribution = () => {
    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };

    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });

    return distribution;
  };

  // Formatiere die Verteilung als Prozentsatz
  const getRatingPercentage = (rating: number) => {
    const distribution = getRatingDistribution();
    if (!reviews.length) return 0;
    return Math.round((distribution[rating as keyof typeof distribution] / reviews.length) * 100);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen pt-24 pb-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Vlerësimet dhe Opinionet</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-500 dark:text-gray-400">
            Shikoni se çfarë thonë klientët tanë për pronat dhe shërbimet tona. Përvojat reale nga përdoruesit e platformës sonë.
          </p>
        </div>

        {/* Overall Rating Summary */}
        <div className={`mb-12 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/3 text-center md:text-left mb-6 md:mb-0">
              <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Vlerësimi i përgjithshëm</h2>
              <div className="flex items-center justify-center md:justify-start">
                <span className="text-5xl font-bold text-yellow-500">{calculateAverageRating().toFixed(1)}</span>
                <div className="ml-4">
                  <div className="flex">
                    {renderStars(calculateAverageRating())}
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                    Bazuar në {reviews.length} vlerësime
                  </p>
                </div>
              </div>
            </div>

            <div className="md:w-2/3 md:pl-10">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center">
                    <div className="flex items-center w-24">
                      <span className="mr-2">{rating}</span>
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div className="flex-grow mx-4 h-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <div 
                        className="h-full bg-yellow-500" 
                        style={{ width: `${getRatingPercentage(rating)}%` }}
                      ></div>
                    </div>
                    <div className="w-16 text-right text-sm">
                      {getRatingPercentage(rating)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className={`mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Search Input */}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="search" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Kërko vlerësime
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Kërko sipas emrit, titullit ose përmbajtjes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  } border focus:ring-blue-500 focus:border-blue-500`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label htmlFor="rating" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Filtro sipas vlerësimit
              </label>
              <select
                id="rating"
                value={ratingFilter === null ? '' : ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value ? Number(e.target.value) : null)}
                className={`w-full px-3 py-2.5 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                } border focus:ring-blue-500 focus:border-blue-500 appearance-none`}
              >
                <option value="">Të gjitha vlerësimet</option>
                <option value="5">5 yje</option>
                <option value="4">4 yje</option>
                <option value="3">3 yje</option>
                <option value="2">2 yje</option>
                <option value="1">1 yll</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Filtro sipas kategorisë
              </label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                } border focus:ring-blue-500 focus:border-blue-500 appearance-none`}
              >
                <option value="">Të gjitha kategoritë</option>
                <option value="property">Vlerësime për prona</option>
                <option value="service">Vlerësime për shërbime</option>
                <option value="platform">Vlerësime për platformën</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <label className={`mr-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Rendit sipas:</label>
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setSortBy('newest')}
                  className={`px-3 py-1 text-sm ${
                    sortBy === 'newest'
                      ? darkMode ? 'bg-gray-700 text-white' : 'bg-blue-50 text-blue-700'
                      : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'
                  }`}
                >
                  Më të rejat
                </button>
                <button
                  onClick={() => setSortBy('highest')}
                  className={`px-3 py-1 text-sm ${
                    sortBy === 'highest'
                      ? darkMode ? 'bg-gray-700 text-white' : 'bg-blue-50 text-blue-700'
                      : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'
                  }`}
                >
                  Vlerësimet më të larta
                </button>
                <button
                  onClick={() => setSortBy('lowest')}
                  className={`px-3 py-1 text-sm ${
                    sortBy === 'lowest'
                      ? darkMode ? 'bg-gray-700 text-white' : 'bg-blue-50 text-blue-700'
                      : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'
                  }`}
                >
                  Vlerësimet më të ulëta
                </button>
              </div>
            </div>

            <div>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Duke shfaqur {filteredReviews.length} nga {reviews.length} vlerësime
              </span>
            </div>
          </div>
        </div>

        {/* Write Review Button */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all transform hover:-translate-y-1`}
          >
            {showReviewForm ? 'Mbyll formularin' : 'Shkruani një vlerësim'}
          </button>
        </div>

        {/* Review Form (conditionally rendered) */}
        {showReviewForm && (
          <div className={`mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Ndani përvojën tuaj
            </h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="review-title" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Titulli i vlerësimit
                </label>
                <input
                  type="text"
                  id="review-title"
                  className={`w-full px-4 py-2 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } border focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Përshkruani përvojën tuaj me një titull të shkurtër"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Vlerësimi juaj
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="text-gray-300 hover:text-yellow-500 focus:outline-none"
                    >
                      <Star className="h-8 w-8" />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="review-category" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Kategoria
                </label>
                <select
                  id="review-category"
                  className={`w-full px-4 py-2 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } border focus:ring-blue-500 focus:border-blue-500 appearance-none`}
                >
                  <option value="">Zgjidhni një kategori</option>
                  <option value="property">Vlerësim për pronë</option>
                  <option value="service">Vlerësim për shërbim</option>
                  <option value="platform">Vlerësim për platformën</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="review-comment" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Përmbajtja e vlerësimit
                </label>
                <textarea
                  id="review-comment"
                  rows={5}
                  className={`w-full px-4 py-2 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } border focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Ndani detajet e përvojës suaj..."
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                >
                  Dërgo vlerësimin
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className={`text-center py-12 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
            <p>{error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Provo përsëri
            </button>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className={`h-12 w-12 ${darkMode ? 'text-gray-400' : 'text-gray-400'} mx-auto mb-4`} />
            <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Nuk u gjet asnjë vlerësim
            </h3>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Provoni të ndryshoni filtrat tuaj ose të jeni i pari që lini një vlerësim!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredReviews.map(review => (
              <div 
                key={review.id} 
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}
              >
                <div className="flex flex-col md:flex-row md:items-start">
                  {/* User info */}
                  <div className="md:w-48 flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                    <div className="flex items-center">
                      {review.userAvatar ? (
                        <img 
                          src={review.userAvatar} 
                          alt={review.userName} 
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className={`h-12 w-12 rounded-full ${
                          darkMode ? 'bg-blue-600' : 'bg-blue-500'
                        } flex items-center justify-center text-white font-bold text-lg`}>
                          {review.userName.charAt(0)}
                        </div>
                      )}
                      <div className="ml-3">
                        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {review.userName}
                        </h3>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDate(review.date)}
                        </p>
                      </div>
                    </div>
                    
                    {review.isVerifiedPurchase && (
                      <div className={`mt-3 flex items-center ${
                        darkMode ? 'text-green-400' : 'text-green-600'
                      }`}>
                        <Shield className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">Blerje e verifikuar</span>
                      </div>
                    )}
                    
                    <div className={`mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      review.category === 'property'
                        ? darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800'
                        : review.category === 'service'
                          ? darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                          : darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {review.category === 'property' ? 'Pronë' : 
                       review.category === 'service' ? 'Shërbim' : 'Platformë'}
                    </div>
                  </div>
                  
                  {/* Review content */}
                  <div className="flex-grow">
                    <div className="flex items-center mb-2">
                      {renderStars(review.rating)}
                    </div>
                    
                    <h4 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {review.title}
                    </h4>
                    
                    {review.propertyName && (
                      <div className="flex items-center mb-3">
                        <Building className={`h-4 w-4 mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {review.propertyName} 
                          {review.propertyLocation && (
                            <>
                              <span className="mx-1">•</span>
                              <MapPin className="inline-block h-3 w-3 mr-0.5" />
                              {review.propertyLocation}
                            </>
                          )}
                        </span>
                      </div>
                    )}
                    
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {review.comment}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => handleHelpfulClick(review.id)}
                        disabled={helpfulClicks[review.id]}
                        className={`flex items-center text-sm ${
                          helpfulClicks[review.id]
                            ? darkMode ? 'text-blue-400 cursor-default' : 'text-blue-600 cursor-default'
                            : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <ThumbsUp className={`h-4 w-4 mr-1 ${helpfulClicks[review.id] ? 'fill-current' : ''}`} />
                        {helpfulClicks[review.id] ? 'E dobishme' : 'Shëno si të dobishme'}
                        <span className="ml-2 text-xs">({review.helpful})</span>
                      </button>
                      
                      {review.propertyId && (
                        <Link 
                          to={`/property/${review.propertyId}`}
                          className={`text-sm font-medium ${
                            darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                          }`}
                        >
                          Shiko pronën
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Guidelines */}
        <div className={`mt-12 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Udhëzime për vlerësime
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Çfarë duhet të përfshini
              </h3>
              <ul className={`space-y-2 list-disc pl-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>Përshkrim të detajuar të përvojës suaj</li>
                <li>Informacione specifike për pronën ose shërbimin</li>
                <li>Aspektet pozitive dhe negative</li>
                <li>Komentet konstruktive që mund të ndihmojnë të tjerët</li>
              </ul>
            </div>
            
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Çfarë duhet të shmangni
              </h3>
              <ul className={`space-y-2 list-disc pl-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>Informacionet personale ose konfidenciale</li>
                <li>Gjuhë të papërshtatshme ose ofenduese</li>
                <li>Promovim të bizneseve të tjera</li>
                <li>Çështje që nuk lidhen me pronën ose shërbimin</li>
              </ul>
            </div>
          </div>
          
          <div className={`mt-6 p-4 rounded-lg ${
            darkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'
          }`}>
            <p className="text-sm">
              <strong>Shënim:</strong> Të gjitha vlerësimet moderohren përpara se të publikohen. Vlerësimet që nuk i përmbushin udhëzimet tona mund të refuzohen.
            </p>
          </div>
        </div>

        {/* Testimonials / Featured Reviews */}
        <div className="mt-12">
          <h2 className={`text-2xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Vlerësime të veçanta
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <div className="flex justify-center mb-4">
                <Award className={`h-12 w-12 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
              </div>
              <div className="flex justify-center mb-4">
                {renderStars(5)}
              </div>
              <blockquote className={`text-center italic mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                "Falë kësaj platforme, gjeta shtëpinë e ëndrrave të mia në vetëm 2 javë. Procesi ishte i thjeshtë dhe transparent."
              </blockquote>
              <div className="text-center">
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Blerim Krasniqi</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Klient, Prishtinë</p>
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <div className="flex justify-center mb-4">
                <Award className={`h-12 w-12 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
              </div>
              <div className="flex justify-center mb-4">
                {renderStars(5)}
              </div>
              <blockquote className={`text-center italic mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                "Si agjent, kjo platformë më ka ndihmuar të lidhëm me klientë seriozë dhe të përfundoj transaksione më shpejt."
              </blockquote>
              <div className="text-center">
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Arta Berisha</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Agjente, Prizren</p>
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <div className="flex justify-center mb-4">
                <Award className={`h-12 w-12 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
              </div>
              <div className="flex justify-center mb-4">
                {renderStars(5)}
              </div>
              <blockquote className={`text-center italic mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                "Informacionet e detajuara dhe fotot e sakta më ndihmuan të marr vendime të informuara pa humbur kohë."
              </blockquote>
              <div className="text-center">
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Lulzim Gashi</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Investitor, Ferizaj</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className={`${
            darkMode ? 'bg-blue-900' : 'bg-blue-600'
          } rounded-xl shadow-xl p-8 text-white`}>
            <h2 className="text-2xl font-bold mb-4">Jepni mendimin tuaj</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Vlerësimet tuaja na ndihmojnë të përmirësojmë platformën dhe u japin informacione të vlefshme përdoruesve të tjerë.
            </p>
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 rounded-lg font-medium transition-colors"
            >
              Shkruani një vlerësim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;