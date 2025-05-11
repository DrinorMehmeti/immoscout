import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Building, Euro, Upload, X, Info, BedDouble, Bath, Square, Image as ImageIcon, Check, Tag, Home, Clock, ArrowRight, Camera, Plus, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface AddPropertyFormProps {
  onSuccess?: () => void;
}

const AddPropertyForm: React.FC<AddPropertyFormProps> = ({ onSuccess }) => {
  const { authState } = useAuth();
  const { darkMode } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState(''); // New field for district/neighborhood
  const [propertyType, setPropertyType] = useState<'apartment' | 'house' | 'land' | 'commercial'>('apartment');
  const [listingType, setListingType] = useState<'rent' | 'sale'>('sale');
  const [rooms, setRooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [area, setArea] = useState('');
  const [floor, setFloor] = useState(''); // New field for floor number
  const [totalFloors, setTotalFloors] = useState(''); // New field for total floors
  const [yearBuilt, setYearBuilt] = useState(''); // New field for construction year
  const [parkingSpots, setParkingSpots] = useState(''); // New field for parking spots
  const [condition, setCondition] = useState<'new' | 'good' | 'renovated' | 'needs-renovation'>('good'); // New field for property condition
  const [features, setFeatures] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [bucketStatus, setBucketStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [dragActive, setDragActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // For multi-step form
  const totalSteps = 4;

  // Check if the bucket exists without trying to create it
  useEffect(() => {
    const checkBucketAvailability = async () => {
      try {
        // Check if we can access the property-images bucket
        const { error: listError } = await supabase.storage
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

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files).filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );
    
    // Limit to 10 images total
    const availableSlots = 10 - images.length;
    const newFiles = fileArray.slice(0, availableSlots);
    
    if (newFiles.length > 0) {
      setImages([...images, ...newFiles]);
      
      // Create preview URLs
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
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

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('handleSubmit aufgerufen, currentStep:', currentStep);
    if (currentStep !== totalSteps) {
      e.preventDefault();
      console.log('Abbruch: currentStep !== totalSteps');
      return;
    }
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
            
            const { error: uploadError } = await supabase.storage
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
      
      // Build extended features array with property condition and other details
      const extendedFeatures = [...features];
      
      if (condition === 'new') extendedFeatures.push('Ndërtim i ri');
      if (condition === 'renovated') extendedFeatures.push('Rinovuar');
      if (parkingSpots && parseInt(parkingSpots) > 0) extendedFeatures.push(`${parkingSpots} vend parkimi`);
      
      // Create new property entry in database
      const { data: newProperty, error: insertError } = await supabase
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
          features: extendedFeatures,
          images: uploadedImageUrls.length > 0 ? uploadedImageUrls : [],
          status: 'active',
          featured: false
        })
        .select()
        .single();
        
      if (insertError) {
        throw new Error('Error gjatë ruajtjes së të dhënave: ' + insertError.message);
      }
      
      setSuccess(true);
      // Reset form
      setTitle('');
      setDescription('');
      setPrice('');
      setLocation('');
      setDistrict('');
      setPropertyType('apartment');
      setListingType('sale');
      setRooms('');
      setBathrooms('');
      setArea('');
      setFloor('');
      setTotalFloors('');
      setYearBuilt('');
      setParkingSpots('');
      setCondition('good');
      setFeatures([]);
      setImages([]);
      setPreviewUrls([]);
      setCurrentStep(1);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ndodhi një gabim i papritur');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formBg = darkMode ? 'from-gray-900 to-gray-800' : 'from-white to-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const textMuted = darkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = darkMode ? 'bg-gray-700' : 'bg-white';
  const inputBorder = darkMode ? 'border-gray-600' : 'border-gray-300';
  const inputFocus = 'focus:ring-blue-500 focus:border-blue-500';
  
  const buttonPrimary = 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white';
  const buttonSecondary = darkMode ? 
    'bg-gray-700 hover:bg-gray-600 text-white' : 
    'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300';

  // Common properties for all form steps
  const formProps = {
    cardBg,
    textColor,
    textMuted,
    inputBg,
    inputBorder,
    inputFocus,
    buttonPrimary,
    buttonSecondary,
    darkMode
  };

  // Multi-step form content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8 animate-fadeIn">
            {/* Listing type */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl">
              <label className={`block text-sm font-medium ${textColor} mb-3`}>
                Lloji i shpalljes
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setListingType('sale')}
                  className={`group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    listingType === 'sale' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                      : `${inputBorder} hover:border-gray-400 dark:hover:border-gray-500 ${textColor}`
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    listingType === 'sale'
                      ? 'bg-blue-100 dark:bg-blue-800'
                      : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                  }`}>
                    <Euro className={`h-6 w-6 ${
                      listingType === 'sale'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`} />
                  </div>
                  <span className="font-medium">Në shitje</span>
                  {listingType === 'sale' && (
                    <div className="absolute top-2 right-2">
                      <Check className="h-5 w-5 text-blue-500" />
                    </div>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setListingType('rent')}
                  className={`group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    listingType === 'rent' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                      : `${inputBorder} hover:border-gray-400 dark:hover:border-gray-500 ${textColor}`
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    listingType === 'rent'
                      ? 'bg-blue-100 dark:bg-blue-800'
                      : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                  }`}>
                    <Clock className={`h-6 w-6 ${
                      listingType === 'rent'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`} />
                  </div>
                  <span className="font-medium">Me qira</span>
                  {listingType === 'rent' && (
                    <div className="absolute top-2 right-2">
                      <Check className="h-5 w-5 text-blue-500" />
                    </div>
                  )}
                </button>
              </div>
            </div>
            
            {/* Property type */}
            <div>
              <label className={`block text-sm font-medium ${textColor} mb-3`}>
                Lloji i pronës
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'apartment', label: 'Banesë', icon: Building },
                  { id: 'house', label: 'Shtëpi', icon: Home },
                  { id: 'land', label: 'Tokë', icon: MapPin },
                  { id: 'commercial', label: 'Lokal', icon: Building }
                ].map((type) => {
                  const Icon = type.icon;
                  const isActive = propertyType === type.id;
                  
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setPropertyType(type.id as any)}
                      className={`group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        isActive 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                          : `${inputBorder} hover:border-gray-400 dark:hover:border-gray-500 ${textColor}`
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-800'
                          : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                      }`}>
                        <Icon className={`h-6 w-6 ${
                          isActive
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`} />
                      </div>
                      <span className="font-medium">{type.label}</span>
                      {isActive && (
                        <div className="absolute top-2 right-2">
                          <Check className="h-5 w-5 text-blue-500" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Basic info */}
            <div className={`${cardBg} p-6 rounded-2xl shadow-sm`}>
              <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center`}>
                <Info className="h-5 w-5 mr-2 text-blue-500" />
                Informacioni bazë
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className={`block text-sm font-medium ${textColor} mb-1`}>
                    Titulli i pronës*
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className={`w-full px-4 py-3 rounded-xl shadow-sm ${inputBg} ${inputBorder} ${inputFocus} ${textColor}`}
                    placeholder="p.sh. Banesë luksoze në qendër të Prishtinës"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className={`block text-sm font-medium ${textColor} mb-1`}>
                      Çmimi ({listingType === 'rent' ? 'mujor' : 'total'})*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Euro className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      </div>
                      <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        min="0"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl shadow-sm ${inputBg} ${inputBorder} ${inputFocus} ${textColor}`}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="condition" className={`block text-sm font-medium ${textColor} mb-1`}>
                      Gjendja e pronës
                    </label>
                    <select
                      id="condition"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as any)}
                      className={`w-full px-4 py-3 rounded-xl shadow-sm ${inputBg} ${inputBorder} ${inputFocus} ${textColor}`}
                    >
                      <option value="new">E re (ndërtim i ri)</option>
                      <option value="good">E mirë</option>
                      <option value="renovated">E rinovuar</option>
                      <option value="needs-renovation">Nevojitet rinovim</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className={`block text-sm font-medium ${textColor} mb-1`}>
                    Përshkrimi*
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl shadow-sm ${inputBg} ${inputBorder} ${inputFocus} ${textColor}`}
                    placeholder="Përshkruani pronën tuaj në detaje..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-8 animate-fadeIn">
            {/* Location */}
            <div className={`${cardBg} p-6 rounded-2xl shadow-sm`}>
              <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center`}>
                <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                Lokacioni
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="location" className={`block text-sm font-medium ${textColor} mb-1`}>
                    Qyteti/Komuna*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <input
                      type="text"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      className={`w-full pl-11 pr-4 py-3 rounded-xl shadow-sm ${inputBg} ${inputBorder} ${inputFocus} ${textColor}`}
                      placeholder="p.sh. Prishtinë"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="district" className={`block text-sm font-medium ${textColor} mb-1`}>
                    Lagjja/Zona
                  </label>
                  <input
                    type="text"
                    id="district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl shadow-sm ${inputBg} ${inputBorder} ${inputFocus} ${textColor}`}
                    placeholder="p.sh. Dardania, Ulpiana, Bregu i Diellit"
                  />
                </div>
              </div>
            </div>
            
            {/* Property details */}
            <div className={`${cardBg} p-6 rounded-2xl shadow-sm`}>
              <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center`}>
                <Home className="h-5 w-5 mr-2 text-blue-500" />
                Detajet e pronës
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="area" className={`block text-sm font-medium ${textColor} mb-1`}>
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Sipërfaqja (m²)*</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    id="area"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    required
                    min="0"
                    className={`w-full px-4 py-3 rounded-xl shadow-sm ${inputBg} ${inputBorder} ${inputFocus} ${textColor}`}
                    placeholder="p.sh. 85"
                  />
                </div>
                
                {(propertyType === 'apartment' || propertyType === 'house') && (
                  <div>
                    <label htmlFor="rooms" className={`block text-sm font-medium ${textColor} mb-1`}>
                      <div className="flex items-center">
                        <BedDouble className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Numri i dhomave*</span>
                      </div>
                    </label>
                    <select
                      id="rooms"
                      value={rooms}
                      onChange={(e) => setRooms(e.target.value)}
                      required
                      className={`w-full px-4 py-3 rounded-xl shadow-sm ${inputBg} ${inputBorder} ${inputFocus} ${textColor}`}
                    >
                      <option value="">Zgjidhni</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {(propertyType === 'apartment' || propertyType === 'house') && (
                  <div>
                    <label htmlFor="bathrooms" className={`block text-sm font-medium ${textColor} mb-1`}>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Numri i banjove*</span>
                      </div>
                    </label>
                    <select
                      id="bathrooms"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      required
                      className={`w-full px-4 py-3 rounded-xl shadow-sm ${inputBg} ${inputBorder} ${inputFocus} ${textColor}`}
                    >
                      <option value="">Zgjidhni</option>
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {propertyType === 'apartment' && (
                  <div>
                    <label htmlFor="floor" className={`block text-sm font-medium ${textColor} mb-1`}>
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Kati</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      id="floor"
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                      min="0"
                      className={`w-full px-4 py-3 rounded-xl shadow-sm ${inputBg} ${inputBorder} ${inputFocus} ${textColor}`}
                      placeholder="p.sh. 3"
                    />
                  </div>
                )}
                
                {propertyType === 'apartment' && (
                  <div>
                    <label htmlFor="totalFloors" className={`block text-sm font-medium ${textColor} mb-1`}>
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Numri total i kateve</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      id="totalFloors"
                      value={totalFloors}
                      onChange={(e) => setTotalFloors(e.target.value)}
                      min="0"
                      className={`w-full px-4 py-3 rounded-xl shadow-sm ${inputBg} ${inputBorder} ${inputFocus} ${textColor}`}
                      placeholder="p.sh. 8"
                    />
                  </div>
                )}
                
                {(propertyType === 'apartment' || propertyType === 'house') && (
                  <div>
                    <label htmlFor="yearBuilt" className={`block text-sm font-medium ${textColor} mb-1`}>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Viti i ndërtimit</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      id="yearBuilt"
                      value={yearBuilt}
                      onChange={(e) => setYearBuilt(e.target.value)}
                      min="1900"
                      max={new Date().getFullYear()}
                      className={`w-full px-4 py-3 rounded-xl shadow-sm ${inputBg} ${inputBorder} ${inputFocus} ${textColor}`}
                      placeholder="p.sh. 2020"
                    />
                  </div>
                )}
                
                {(propertyType === 'apartment' || propertyType === 'house') && (
                  <div>
                    <label htmlFor="parkingSpots" className={`block text-sm font-medium ${textColor} mb-1`}>
                      <div className="flex items-center">
                        <span className="mr-2 text-blue-500">🅿️</span>
                        <span>Vende parkimi</span>
                      </div>
                    </label>
                    <select
                      id="parkingSpots"
                      value={parkingSpots}
                      onChange={(e) => setParkingSpots(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl shadow-sm ${inputBg} ${inputBorder} ${inputFocus} ${textColor}`}
                    >
                      <option value="">Zgjidhni</option>
                      {[0, 1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              {area && price && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <p className={`text-blue-700 dark:text-blue-300 font-medium`}>
                    Çmimi për m²: {(parseFloat(price) / parseFloat(area)).toFixed(2)}€/m²
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-8 animate-fadeIn">
            {/* Features */}
            <div className={`${cardBg} p-6 rounded-2xl shadow-sm`}>
              <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center`}>
                <Tag className="h-5 w-5 mr-2 text-blue-500" />
                Karakteristikat dhe veçoritë
              </h3>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 min-h-10">
                  {features.map((feature, index) => (
                    <div 
                      key={index} 
                      className={`
                        flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                        ${darkMode 
                          ? 'bg-blue-900/50 text-blue-300 border border-blue-700' 
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }
                        transition-all hover:shadow-md
                      `}
                    >
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)}
                        className="ml-2 text-blue-400 hover:text-blue-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  {features.length === 0 && (
                    <p className={`text-sm ${textMuted}`}>
                      Shtoni karakteristikat e pronës për t'i bërë më të dukshme për blerësit
                    </p>
                  )}
                </div>
                
                <div className="flex">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                    className={`flex-1 px-4 py-3 rounded-l-xl shadow-sm ${inputBg} ${inputBorder} ${inputFocus} ${textColor}`}
                    placeholder="p.sh. Parking, Ballkon, Ngrohje qendrore..."
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className={`${buttonPrimary} px-4 py-3 rounded-r-xl font-medium flex items-center`}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Shto
                  </button>
                </div>
                
                <div>
                  <h4 className={`text-sm font-medium ${textColor} mb-2`}>Karakteristikat e zakonshme:</h4>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[
                      'Parking', 'Ballkon', 'Terrasë', 'Ashensor', 'Pamje', 'Mobiluar', 'Internet',
                      'Ngrohje qendrore', 'Klima', 'Siguri', 'Bodrum', 'Kabinat kabllore TV',
                      'Hidrofor', 'Izolim termo', 'Kopsht', 'Panel diellor'
                    ].map((suggestion) => (
                      !features.includes(suggestion) && (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => setFeatures([...features, suggestion])}
                          className={`
                            px-3 py-1.5 rounded-full text-sm
                            ${darkMode 
                              ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-600' 
                              : 'bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300'
                            }
                            transition-all
                          `}
                        >
                          + {suggestion}
                        </button>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-8 animate-fadeIn">
            {/* Images */}
            <div className={`${cardBg} p-6 rounded-2xl shadow-sm`}>
              <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center`}>
                <Camera className="h-5 w-5 mr-2 text-blue-500" />
                Fotot e pronës
              </h3>
              
              <div 
                className={`
                  border-2 border-dashed rounded-xl p-6 transition-all
                  ${dragActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : `${inputBorder} ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`
                  }
                  ${bucketStatus === 'unavailable' ? 'opacity-50 pointer-events-none' : ''}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {previewUrls.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className={`
                      w-16 h-16 rounded-full flex items-center justify-center mb-4
                      ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}
                    `}>
                      <Upload className={`h-8 w-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <p className={`text-center mb-2 ${textColor} font-medium`}>
                      Tërhiqni fotot këtu
                    </p>
                    <p className={`text-center text-sm ${textMuted} mb-4`}>
                      Mbështeten JPG, PNG deri në 5MB
                    </p>
                    <label className="inline-block">
                      <span className={`${buttonPrimary} px-4 py-2 rounded-xl inline-flex items-center cursor-pointer`}>
                        <Camera className="h-5 w-5 mr-2" />
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
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="group relative">
                          <div className="aspect-square rounded-xl overflow-hidden shadow-md">
                            <img 
                              src={url} 
                              alt={`Property preview ${index + 1}`} 
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/30"
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md">
                              Kryesore
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {previewUrls.length < 10 && (
                        <label className={`
                          aspect-square flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer
                          ${darkMode 
                            ? 'border-gray-600 hover:border-gray-500 bg-gray-800/30' 
                            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                          }
                          transition-all hover:shadow-md
                        `}>
                          <Plus className={`h-8 w-8 mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={`text-sm ${textMuted}`}>Shto më shumë</span>
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
                    
                    <div className="flex justify-between items-center">
                      <p className={`text-sm ${textMuted}`}>
                        {previewUrls.length} nga 10 foto
                      </p>
                      <label className="inline-block">
                        <span className={`${buttonSecondary} px-3 py-1.5 rounded-lg inline-flex items-center text-sm cursor-pointer`}>
                          <Camera className="h-4 w-4 mr-1" />
                          Shto më shumë foto
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              {bucketStatus === 'available' ? (
                <p className={`mt-2 text-sm ${textMuted} flex items-center`}>
                  <Info className="h-4 w-4 mr-1" />
                  Ngarko deri në 10 foto për më shumë shikueshmëri
                </p>
              ) : (
                <p className={`mt-2 text-sm text-yellow-500 dark:text-yellow-400 flex items-center`}>
                  <Info className="h-4 w-4 mr-1" />
                  Ngarkimi i fotove nuk është i disponueshëm për momentin
                </p>
              )}
            </div>
            
            {/* Summary */}
            <div className={`${cardBg} p-6 rounded-2xl shadow-sm`}>
              <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center`}>
                <Info className="h-5 w-5 mr-2 text-blue-500" />
                Përmbledhje
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                  <span className={textMuted}>Lloji i shpalljes:</span>
                  <span className={`font-medium ${textColor}`}>
                    {listingType === 'sale' ? 'Në shitje' : 'Me qira'}
                  </span>
                </div>
                
                <div className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                  <span className={textMuted}>Lloji i pronës:</span>
                  <span className={`font-medium ${textColor}`}>
                    {propertyType === 'apartment' && 'Banesë'}
                    {propertyType === 'house' && 'Shtëpi'}
                    {propertyType === 'land' && 'Tokë'}
                    {propertyType === 'commercial' && 'Lokal'}
                  </span>
                </div>
                
                <div className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                  <span className={textMuted}>Çmimi:</span>
                  <span className={`font-medium text-blue-600 dark:text-blue-400`}>
                    {price}€ {listingType === 'rent' ? '/muaj' : ''}
                  </span>
                </div>
                
                <div className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                  <span className={textMuted}>Lokacioni:</span>
                  <span className={`font-medium ${textColor}`}>{location}</span>
                </div>
                
                {area && (
                  <div className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className={textMuted}>Sipërfaqja:</span>
                    <span className={`font-medium ${textColor}`}>{area} m²</span>
                  </div>
                )}
                
                {rooms && (
                  <div className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className={textMuted}>Dhoma:</span>
                    <span className={`font-medium ${textColor}`}>{rooms}</span>
                  </div>
                )}
                
                {bathrooms && (
                  <div className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className={textMuted}>Banjo:</span>
                    <span className={`font-medium ${textColor}`}>{bathrooms}</span>
                  </div>
                )}
                
                <div className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                  <span className={textMuted}>Foto:</span>
                  <span className={`font-medium ${textColor}`}>{previewUrls.length} nga 10</span>
                </div>
                
                <div className="flex justify-between pb-2">
                  <span className={textMuted}>Karakteristika:</span>
                  <span className={`font-medium ${textColor}`}>{features.length}</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`bg-gradient-to-b ${formBg} rounded-3xl shadow-2xl overflow-hidden transition-all duration-300`}>
      <div className="p-8 sm:p-10">
        {/* Form header */}
        <div className="mb-8">
          <h2 className={`text-3xl font-extrabold ${textColor} mb-2`}>
            Shto një pronë të re
          </h2>
          <p className={textMuted}>
            Plotësoni detajet e pronës tuaj për ta publikuar në platformën tonë
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className={`text-sm font-medium ${textColor}`}>
              Hapi {currentStep} nga {totalSteps}
            </span>
            <span className={`text-sm ${textMuted}`}>
              {currentStep === 1 && 'Informacioni bazë'}
              {currentStep === 2 && 'Lokacioni dhe detajet'}
              {currentStep === 3 && 'Karakteristikat'}
              {currentStep === 4 && 'Fotot dhe përmbledhja'}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Alert messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl flex items-start animate-fadeIn">
            <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl flex items-start animate-fadeIn">
            <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>Prona u shtua me sukses!</p>
          </div>
        )}
        
        {bucketStatus === 'unavailable' && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-xl flex items-start">
            <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>Vërejtje: Storage Bucket nuk është i disponueshëm. Fotot nuk do të mund të ngarkohen por ju mund të vazhdoni të shtoni pronën.</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Form content based on current step */}
          {renderStepContent()}
          
          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-gray-200 dark:border-gray-700 mt-8">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className={`${buttonSecondary} py-3 px-6 rounded-xl font-medium transition-all hover:shadow-md flex items-center justify-center`}
              >
                <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
                Kthehu
              </button>
            ) : (
              <div></div> // Empty div to maintain flex spacing
            )}
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className={`${buttonPrimary} py-3 px-8 rounded-xl font-medium transition-all hover:shadow-lg flex items-center justify-center`}
              >
                Vazhdo
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  ${buttonPrimary} py-3 px-8 rounded-xl font-medium transition-all hover:shadow-lg flex items-center justify-center
                  ${isSubmitting ? 'opacity-80' : ''}
                `}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Duke publikuar...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Publiko pronën
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyForm;