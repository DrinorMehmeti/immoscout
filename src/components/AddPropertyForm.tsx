import React, { useState, useEffect } from 'react';
import { MapPin, Building, Euro, Upload, X, Info, BedDouble, Bath, Square, Image as ImageIcon, Check, Tag, Home, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';

interface AddPropertyFormProps {
  onSuccess?: () => void;
}

const AddPropertyForm: React.FC<AddPropertyFormProps> = ({ onSuccess }) => {
  const { authState } = useAuth();
  const { darkMode } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState<'apartment' | 'house' | 'land' | 'commercial'>('apartment');
  const [listingType, setListingType] = useState<'rent' | 'sale'>('sale');
  const [rooms, setRooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [area, setArea] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [bucketStatus, setBucketStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

  // Form validation
  const [touched, setTouched] = useState({
    title: false,
    description: false,
    price: false,
    location: false,
  });

  const markAsTouched = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const isValid = {
    title: title.trim().length > 0,
    description: description.trim().length > 0,
    price: price !== '' && parseFloat(price) > 0,
    location: location.trim().length > 0,
  };

  const isStepOneValid = isValid.title && isValid.description && isValid.price && isValid.location;
  const isStepTwoValid = true; // These fields are optional

  // Check if the bucket exists without trying to create it
  useEffect(() => {
    const checkBucketAvailability = async () => {
      try {
        // Check if we can access the property-images bucket
        const { data: files, error: listError } = await supabase.storage
          .from('property-images')
          .list();
          
        if (listError) {
          console.error('Error accessing bucket:', listError);
          setBucketStatus('unavailable');
          return;
        }
        
        // If we got here, bucket is available
        setBucketStatus('available');
        console.log('Bucket is available for use');
        
      } catch (err) {
        console.error('Exception checking bucket availability:', err);
        setBucketStatus('unavailable');
      }
    };
    
    checkBucketAvailability();
  }, []);

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleAddFeature = () => {
    if (featureInput.trim() !== '' && !features.includes(featureInput.trim())) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setFeatures(features.filter(f => f !== feature));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      
      // Limit to 10 images total
      const availableSlots = 10 - images.length;
      const newFiles = fileArray.slice(0, availableSlots);
      
      if (newFiles.length > 0) {
        setImages([...images, ...newFiles]);
        
        // Create preview URLs
        const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls([...previewUrls, ...newPreviewUrls]);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    // Release object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
    
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      if (!authState.isAuthenticated || !authState.user) {
        throw new Error('Ju duhet të jeni të kyçur për të shtuar pronë');
      }
      
      // Upload images to Supabase Storage
      const uploadedImageUrls: string[] = [];
      
      if (images.length > 0 && bucketStatus === 'available') {
        const bucketName = 'property-images';
        
        try {
          for (const image of images) {
            const fileExt = image.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `properties/${authState.user.id}/${fileName}`;
            
            const { error: uploadError, data } = await supabase.storage
              .from(bucketName)
              .upload(filePath, image);
              
            if (uploadError) {
              console.error('Error uploading image:', uploadError);
              continue; // Skip this image but continue with others
            }
            
            const { data: { publicUrl } } = supabase.storage
              .from(bucketName)
              .getPublicUrl(filePath);
              
            uploadedImageUrls.push(publicUrl);
          }
        } catch (uploadErr) {
          console.error('Error in upload process:', uploadErr);
          // Continue without images
        }
      }
      
      // Create new property entry in database
      const { error: insertError } = await supabase
        .from('properties')
        .insert({
          owner_id: authState.user.id,
          title,
          description,
          price: parseFloat(price),
          location,
          type: propertyType,
          listing_type: listingType,
          rooms: rooms ? parseInt(rooms, 10) : null,
          bathrooms: bathrooms ? parseInt(bathrooms, 10) : null,
          area: area ? parseFloat(area) : null,
          features,
          images: uploadedImageUrls.length > 0 ? uploadedImageUrls : [],
          status: 'active',
          featured: false
        });
        
      if (insertError) {
        throw new Error('Error gjatë ruajtjes së të dhënave: ' + insertError.message);
      }
      
      setSuccess(true);
      // Reset form
      setTitle('');
      setDescription('');
      setPrice('');
      setLocation('');
      setPropertyType('apartment');
      setListingType('sale');
      setRooms('');
      setBathrooms('');
      setArea('');
      setFeatures([]);
      setImages([]);
      setPreviewUrls([]);
      setActiveStep(1);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ndodhi një gabim i papritur');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (activeStep === 1 && isStepOneValid) {
      setActiveStep(2);
    } else if (activeStep === 2 && isStepTwoValid) {
      setActiveStep(3);
    }
  };

  const previousStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  // Progress bar percentage
  const progressPercentage = ((activeStep - 1) / 2) * 100;

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl overflow-hidden`}>
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200 dark:bg-gray-700">
        <div 
          className="h-1 bg-blue-600 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      {/* Header */}
      <div className="px-8 pt-8 pb-4">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {activeStep === 1 && 'Detajet kryesore të pronës'}
          {activeStep === 2 && 'Karakteristikat e pronës'}
          {activeStep === 3 && 'Fotot dhe finalizimi'}
        </h2>
        <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {activeStep === 1 && 'Vendosni informacionet bazë për pronën tuaj'}
          {activeStep === 2 && 'Shtoni më shumë detaje për të ndihmuar blerësit potencialë'}
          {activeStep === 3 && 'Shtoni foto për të bërë të dallueshme pronën tuaj'}
        </p>
      </div>
      
      {/* Step indicators */}
      <div className="px-8 pb-6">
        <div className="flex items-center justify-between max-w-md">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activeStep >= 1 
                ? 'bg-blue-600 text-white' 
                : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-400'
            }`}>
              <Home className="h-5 w-5" />
            </div>
            <span className={`mt-2 text-xs ${
              activeStep >= 1 
                ? darkMode ? 'text-blue-400' : 'text-blue-600'
                : darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Detajet</span>
          </div>
          
          <div className={`flex-1 h-0.5 ${
            activeStep >= 2 
              ? 'bg-blue-600' 
              : darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
          
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activeStep >= 2 
                ? 'bg-blue-600 text-white' 
                : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-400'
            }`}>
              <Tag className="h-5 w-5" />
            </div>
            <span className={`mt-2 text-xs ${
              activeStep >= 2 
                ? darkMode ? 'text-blue-400' : 'text-blue-600'
                : darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Veçoritë</span>
          </div>
          
          <div className={`flex-1 h-0.5 ${
            activeStep >= 3 
              ? 'bg-blue-600' 
              : darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
          
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activeStep >= 3 
                ? 'bg-blue-600 text-white' 
                : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-400'
            }`}>
              <ImageIcon className="h-5 w-5" />
            </div>
            <span className={`mt-2 text-xs ${
              activeStep >= 3 
                ? darkMode ? 'text-blue-400' : 'text-blue-600'
                : darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Fotot</span>
          </div>
        </div>
      </div>
      
      {/* Error and success messages */}
      {error && (
        <div className="mx-8 mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg flex items-start">
          <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mx-8 mb-6 p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg flex items-start">
          <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>Prona u shtua me sukses!</p>
        </div>
      )}
      
      {bucketStatus === 'unavailable' && activeStep === 3 && (
        <div className="mx-8 mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg flex items-start">
          <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>Vërejtje: Storage Bucket nuk është i disponueshëm. Fotot nuk do të mund të ngarkohen por ju mund të vazhdoni të shtoni pronën.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="px-8 pb-8">
          {/* Step 1: Basic details */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="listingType" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Lloji i shpalljes
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setListingType('sale')}
                    className={`flex items-center justify-center px-4 py-3 rounded-xl border-2 transition-all ${
                      listingType === 'sale' 
                        ? darkMode 
                          ? 'border-blue-500 bg-blue-900/30 text-blue-400' 
                          : 'border-blue-500 bg-blue-50 text-blue-700' 
                        : darkMode 
                          ? 'border-gray-700 text-gray-300 hover:border-gray-600' 
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Në shitje
                  </button>
                  <button
                    type="button"
                    onClick={() => setListingType('rent')}
                    className={`flex items-center justify-center px-4 py-3 rounded-xl border-2 transition-all ${
                      listingType === 'rent' 
                        ? darkMode 
                          ? 'border-blue-500 bg-blue-900/30 text-blue-400' 
                          : 'border-blue-500 bg-blue-50 text-blue-700' 
                        : darkMode 
                          ? 'border-gray-700 text-gray-300 hover:border-gray-600' 
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Me qira
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="propertyType" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Lloji i pronës
                </label>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <button
                    type="button"
                    onClick={() => setPropertyType('apartment')}
                    className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl border-2 transition-all ${
                      propertyType === 'apartment' 
                        ? darkMode 
                          ? 'border-blue-500 bg-blue-900/30 text-blue-400' 
                          : 'border-blue-500 bg-blue-50 text-blue-700' 
                        : darkMode 
                          ? 'border-gray-700 text-gray-300 hover:border-gray-600' 
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <Building className="h-5 w-5 mb-1" />
                    <span>Banesë</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropertyType('house')}
                    className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl border-2 transition-all ${
                      propertyType === 'house' 
                        ? darkMode 
                          ? 'border-blue-500 bg-blue-900/30 text-blue-400' 
                          : 'border-blue-500 bg-blue-50 text-blue-700' 
                        : darkMode 
                          ? 'border-gray-700 text-gray-300 hover:border-gray-600' 
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <Home className="h-5 w-5 mb-1" />
                    <span>Shtëpi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropertyType('land')}
                    className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl border-2 transition-all ${
                      propertyType === 'land' 
                        ? darkMode 
                          ? 'border-blue-500 bg-blue-900/30 text-blue-400' 
                          : 'border-blue-500 bg-blue-50 text-blue-700' 
                        : darkMode 
                          ? 'border-gray-700 text-gray-300 hover:border-gray-600' 
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <MapPin className="h-5 w-5 mb-1" />
                    <span>Tokë</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropertyType('commercial')}
                    className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl border-2 transition-all ${
                      propertyType === 'commercial' 
                        ? darkMode 
                          ? 'border-blue-500 bg-blue-900/30 text-blue-400' 
                          : 'border-blue-500 bg-blue-50 text-blue-700' 
                        : darkMode 
                          ? 'border-gray-700 text-gray-300 hover:border-gray-600' 
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <Building className="h-5 w-5 mb-1" />
                    <span>Lokal</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="title" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Titulli i pronës
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => markAsTouched('title')}
                  required
                  className={`block w-full px-4 py-3 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  } ${touched.title && !isValid.title ? 'border-red-500 dark:border-red-500' : ''}`}
                  placeholder="p.sh. Banesë luksoze në qendër të Prishtinës"
                />
                {touched.title && !isValid.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    Titulli është i detyrueshëm
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="description" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Përshkrimi
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => markAsTouched('description')}
                  required
                  rows={5}
                  className={`block w-full px-4 py-3 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  } ${touched.description && !isValid.description ? 'border-red-500 dark:border-red-500' : ''}`}
                  placeholder="Përshkruani pronën tuaj në detaje..."
                ></textarea>
                {touched.description && !isValid.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    Përshkrimi është i detyrueshëm
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Çmimi ({listingType === 'rent' ? 'mujor' : 'total'})
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Euro className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <input
                      type="number"
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      onBlur={() => markAsTouched('price')}
                      required
                      min="0"
                      className={`block w-full pl-11 pr-4 py-3 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300 text-gray-900'
                      } ${touched.price && !isValid.price ? 'border-red-500 dark:border-red-500' : ''}`}
                      placeholder="0"
                    />
                  </div>
                  {touched.price && !isValid.price && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      Çmimi është i detyrueshëm dhe duhet të jetë më i madh se 0
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="location" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Lokacioni
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <MapPin className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <input
                      type="text"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onBlur={() => markAsTouched('location')}
                      required
                      className={`block w-full pl-11 pr-4 py-3 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300 text-gray-900'
                      } ${touched.location && !isValid.location ? 'border-red-500 dark:border-red-500' : ''}`}
                      placeholder="p.sh. Prishtinë, Bregu i Diellit"
                    />
                  </div>
                  {touched.location && !isValid.location && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      Lokacioni është i detyrueshëm
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Property details */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(propertyType === 'apartment' || propertyType === 'house') && (
                  <div>
                    <label htmlFor="rooms" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      <div className="flex items-center">
                        <BedDouble className="h-4 w-4 mr-2" />
                        <span>Numri i dhomave</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      id="rooms"
                      value={rooms}
                      onChange={(e) => setRooms(e.target.value)}
                      min="0"
                      className={`block w-full px-4 py-3 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                )}
                
                {(propertyType === 'apartment' || propertyType === 'house') && (
                  <div>
                    <label htmlFor="bathrooms" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-2" />
                        <span>Numri i banjove</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      id="bathrooms"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      min="0"
                      className={`block w-full px-4 py-3 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                )}
                
                <div>
                  <label htmlFor="area" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-2" />
                      <span>Sipërfaqja (m²)</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    id="area"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    min="0"
                    className={`block w-full px-4 py-3 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Karakteristikat
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {features.map((feature, index) => (
                    <div key={index} className={`${
                      darkMode ? 'bg-blue-900/50 text-blue-300 border border-blue-700' : 'bg-blue-50 text-blue-700 border border-blue-200'
                    } rounded-full px-3 py-1 text-sm flex items-center`}>
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)}
                        className={`ml-2 ${darkMode ? 'text-blue-400 hover:text-blue-200' : 'text-blue-400 hover:text-blue-600'}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    className={`flex-1 rounded-l-xl px-4 py-3 shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300 text-gray-900'
                    }`}
                    placeholder="p.sh. Parking, Ballkon, Ngrohje qendrore..."
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-3 rounded-r-xl"
                  >
                    Shto
                  </button>
                </div>
                <p className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Shtoni karakteristikat kryesore të pronës që do t'i interesojnë blerësve potencialë
                </p>
              </div>
            </div>
          )}
          
          {/* Step 3: Images and finalization */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Fotot e pronës
                </label>
                
                <div className={`p-8 border-2 border-dashed rounded-xl mb-4 flex flex-col items-center justify-center ${
                  darkMode ? 'border-gray-600 bg-gray-800/50' : 'border-gray-300 bg-gray-50'
                } ${bucketStatus === 'unavailable' ? 'opacity-50 pointer-events-none' : ''}`}>
                  {previewUrls.length === 0 ? (
                    <>
                      <Upload className={`h-12 w-12 mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                      <p className={`text-center mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Tërhiqni fotot tuaja këtu ose klikoni për të zgjedhur
                      </p>
                      <p className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Mbështeten JPG, PNG deri në 5MB
                      </p>
                      <label className="mt-4 cursor-pointer">
                        <span className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">
                          Zgjidhni fotot
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={url} 
                              alt={`Property preview ${index + 1}`} 
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        ))}
                        
                        {previewUrls.length < 10 && (
                          <label className={`w-full h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer ${
                            darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                          }`}>
                            <Upload className={`h-8 w-8 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                            <span className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Shto më shumë</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageChange}
                              className="sr-only"
                            />
                          </label>
                        )}
                      </div>
                    </>
                  )}
                </div>
                
                {bucketStatus === 'available' ? (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Clock className="h-4 w-4 inline mr-1" /> Ngarko deri në 10 foto të pronës për të rritur shanset e shitjes/qiradhënies.
                  </p>
                ) : (
                  <p className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                    Ngarkimi i fotove nuk është i disponueshëm për momentin. Mund të vazhdoni të shtoni pronën pa foto.
                  </p>
                )}
              </div>
              
              <div className={`mt-4 p-4 rounded-xl ${darkMode ? 'bg-blue-900/30 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'} mb-2`}>Përmbledhje e të dhënave</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Lloji i shpalljes:</span>
                    <span className="font-medium">{listingType === 'rent' ? 'Me qira' : 'Në shitje'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Lloji i pronës:</span>
                    <span className="font-medium">
                      {propertyType === 'apartment' && 'Banesë'}
                      {propertyType === 'house' && 'Shtëpi'}
                      {propertyType === 'land' && 'Tokë'}
                      {propertyType === 'commercial' && 'Lokal'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Çmimi:</span>
                    <span className="font-medium">{price} € {listingType === 'rent' ? '/muaj' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Lokacioni:</span>
                    <span className="font-medium">{location}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            {activeStep > 1 ? (
              <button
                type="button"
                onClick={previousStep}
                className={`px-4 py-2 rounded-xl border ${
                  darkMode 
                    ? 'border-gray-600 text-gray-200 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Kthehu prapa
              </button>
            ) : (
              <div></div> // Empty div to maintain flex layout
            )}
            
            {activeStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={activeStep === 1 && !isStepOneValid}
                className={`px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
              >
                Vazhdo
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Duke u dërguar...
                  </>
                ) : (
                  <>
                    Shto pronën
                    <Check className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPropertyForm;