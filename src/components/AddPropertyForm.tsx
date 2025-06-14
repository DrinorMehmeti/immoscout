import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Building, Euro, Upload, X, Plus, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import TagInput from './TagInput';
import { Property } from '../types';

interface AddPropertyFormProps {
  onSuccess?: () => void;
  existingProperty?: Property;
}

const AddPropertyForm: React.FC<AddPropertyFormProps> = ({ onSuccess, existingProperty }) => {
  const { authState } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState<'apartment' | 'house' | 'land' | 'commercial'>('apartment');
  const [listingType, setListingType] = useState<'rent' | 'sale'>('rent');
  const [rooms, setRooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [area, setArea] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  
  // Image upload state
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Determine if we're in edit mode
  const isEditMode = !!existingProperty;
  
  // Additional state for image limit modal
  const [showImageLimitModal, setShowImageLimitModal] = useState(false);
  const [imageLimitMessage, setImageLimitMessage] = useState('');
  
  // State für die aktuelle Anzahl der eigenen Immobilien
  const [propertyCount, setPropertyCount] = useState<number | null>(null);
  
  // Initialize form with existing property data if in edit mode
  useEffect(() => {
    if (existingProperty) {
      setTitle(existingProperty.title);
      setDescription(existingProperty.description);
      setPrice(existingProperty.price.toString());
      setLocation(existingProperty.location);
      setPropertyType(existingProperty.type);
      setListingType(existingProperty.listing_type);
      setRooms(existingProperty.rooms?.toString() || '');
      setBathrooms(existingProperty.bathrooms?.toString() || '');
      setArea(existingProperty.area?.toString() || '');
      setFeatures(existingProperty.features || []);
      
      // Set existing images
      if (existingProperty.images && existingProperty.images.length > 0) {
        setExistingImageUrls(existingProperty.images);
      }
    }
  }, [existingProperty]);
  
  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls]);
  
  // Premium-Status korrekt bestimmen
  const isPremium = authState.user?.profile?.is_premium;
  
  // Beim Mount die aktuelle Anzahl laden (nur wenn nicht Premium und nicht Edit)
  useEffect(() => {
    if (!isPremium && !isEditMode && authState.user) {
      supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', authState.user.id)
        .then(({ count }) => setPropertyCount(count || 0));
    }
  }, [isPremium, isEditMode, authState.user]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Bild-Limit anhand des Premium-Status
      const maxImages = isPremium ? 15 : 3;
      const totalImageCount = images.length + existingImageUrls.length - imagesToDelete.length;
      if (totalImageCount + newFiles.length > maxImages) {
        setImageLimitMessage(`Sie können maximal ${maxImages} Bilder hochladen. ${isPremium ? '' : 'Upgraden Sie auf Premium für bis zu 15 Bilder.'}`);
        setShowImageLimitModal(true);
        return;
      }
      
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      
      setImages(prevImages => [...prevImages, ...newFiles]);
      setImagePreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
    }
  };
  
  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    setImagePreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
  };
  
  const removeExistingImage = (imageUrl: string) => {
    setExistingImageUrls(prev => prev.filter(url => url !== imageUrl));
    setImagesToDelete(prev => [...prev, imageUrl]);
  };
  
  // Helper function to retry operations with exponential backoff
  const retryOperation = async (
    operation: () => Promise<any>,
    maxRetries = 3,
    initialDelay = 500
  ) => {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        return await operation();
      } catch (error) {
        retries++;
        if (retries >= maxRetries) throw error;
        
        // Exponential backoff
        const delay = initialDelay * Math.pow(2, retries - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };
  
  const uploadImagesToStorage = async (propertyId: string): Promise<string[]> => {
    if (images.length === 0) return [];
    
    try {
      const uploadedUrls: string[] = [];
      
      // Get the authenticated user's ID
      const userId = authState.user?.id;
      if (!userId) throw new Error('User ID not found');
      
      // Upload each image
      for (let i = 0; i < images.length; i++) {
        try {
          const file = images[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          
          // Use the format: propertyId/fileName to match the RLS policies
          const filePath = `${propertyId}/${fileName}`;
          
          // Update progress
          setUploadProgress(Math.round(((i + 1) / images.length) * 100));
          
          // Use retry mechanism for uploads
          const { data, error } = await retryOperation(() => 
            supabase.storage
              .from('property-images')
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
              })
          );
            
          if (error) {
            console.error('Error uploading image:', error);
            throw error;
          }
          
          if (data) {
            // Get the public URL for the uploaded image
            const { data: { publicUrl } } = supabase.storage
              .from('property-images')
              .getPublicUrl(filePath);
              
            uploadedUrls.push(publicUrl);
          }
        } catch (err) {
          console.error(`Failed to upload image ${i + 1}:`, err);
          // Continue with other images even if one fails
        }
      }
      
      return uploadedUrls;
    } catch (error) {
      console.error('Error in upload process:', error);
      throw error;
    }
  };
  
  const deleteImagesFromStorage = async (imageUrls: string[]) => {
    if (imageUrls.length === 0) return;
    
    try {
      for (const url of imageUrls) {
        // Extract the file path from the URL
        // The URL format is like https://bucket.supabase.co/storage/v1/object/public/property-images/propertyId/fileName
        const filePath = url.split('property-images/')[1];
        if (!filePath) continue;
        
        const { error } = await supabase.storage
          .from('property-images')
          .remove([filePath]);
          
        if (error) {
          console.error('Error deleting image:', error);
        }
      }
    } catch (err) {
      console.error('Error deleting images:', err);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authState.user) {
      setError('Ju duhet të jeni të kyçur për të shtuar një pronë');
      return;
    }
    
    // Limit für Free-User: max. 3 Immobilien
    if (!isPremium && !isEditMode) {
      const { count: propertyCount, error: countError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', authState.user.id);
      if (countError) {
        setError('Ndodhi një gabim gjatë kontrollit të kufirit të pronave.');
        return;
      }
      if ((propertyCount || 0) >= 3) {
        setError('Si përdorues Free mund të postoni maksimum 3 prona. Për më shumë, upgraden Sie auf Premium!');
        return;
      }
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Validate form
      if (!title || !description || !price || !location) {
        throw new Error('Ju lutemi plotësoni të gjitha fushat e detyrueshme');
      }
      
      // Convert price to number
      const priceNumber = parseFloat(price);
      if (isNaN(priceNumber) || priceNumber <= 0) {
        throw new Error('Çmimi duhet të jetë një numër pozitiv');
      }
      
      // Convert rooms, bathrooms, area to numbers if provided
      const roomsNumber = rooms ? parseInt(rooms, 10) : null;
      const bathroomsNumber = bathrooms ? parseInt(bathrooms, 10) : null;
      const areaNumber = area ? parseFloat(area) : null;
      
      // Prepare property data
      const propertyData = {
        owner_id: authState.user.id,
        title,
        description,
        price: priceNumber,
        location,
        type: propertyType,
        listing_type: listingType,
        rooms: roomsNumber,
        bathrooms: bathroomsNumber,
        area: areaNumber,
        features: features.length > 0 ? features : null,
      };
      
      let propertyId: string;
      
      if (isEditMode && existingProperty) {
        // Update existing property
        const { data: updatedProperty, error: updateError } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', existingProperty.id)
          .select()
          .single();
          
        if (updateError) {
          throw updateError;
        }
        
        if (!updatedProperty) {
          throw new Error('Ndodhi një gabim gjatë përditësimit të pronës');
        }
        
        propertyId = updatedProperty.id;
        
        // Delete images marked for deletion
        if (imagesToDelete.length > 0) {
          await deleteImagesFromStorage(imagesToDelete);
        }
      } else {
        // Insert new property
        const { data: newProperty, error: insertError } = await supabase
          .from('properties')
          .insert({
            ...propertyData,
            status: 'pending' // All new properties start as pending until approved
          })
          .select()
          .single();
          
        if (insertError) {
          throw insertError;
        }
        
        if (!newProperty) {
          throw new Error('Ndodhi një gabim gjatë shtimit të pronës');
        }
        
        propertyId = newProperty.id;
      }
      
      // Upload new images if any
      let uploadedImageUrls: string[] = [];
      if (images.length > 0) {
        try {
          uploadedImageUrls = await uploadImagesToStorage(propertyId);
        } catch (uploadError) {
          console.error('Error uploading images:', uploadError);
          setError('Prona u ' + (isEditMode ? 'përditësua' : 'shtua') + ', por ndodhi një gabim gjatë ngarkimit të fotove. Ju mund t\'i shtoni më vonë.');
        }
      }
      
      // Combine existing images (that weren't deleted) with newly uploaded ones
      const finalImageUrls = [...existingImageUrls.filter(url => !imagesToDelete.includes(url)), ...uploadedImageUrls];
      
      // Update the property with the final image URLs if we have any new ones or deleted any
      if (uploadedImageUrls.length > 0 || imagesToDelete.length > 0) {
        const { error: imageUpdateError } = await supabase
          .from('properties')
          .update({
            images: finalImageUrls
          })
          .eq('id', propertyId);
          
        if (imageUpdateError) {
          console.error('Error updating property with image URLs:', imageUpdateError);
        }
      }
      
      // Success!
      setSuccess(true);
      
      // Reset form if it's not an edit
      if (!isEditMode) {
        setTitle('');
        setDescription('');
        setPrice('');
        setLocation('');
        setPropertyType('apartment');
        setListingType('rent');
        setRooms('');
        setBathrooms('');
        setArea('');
        setFeatures([]);
        setImages([]);
        setImagePreviewUrls([]);
        setUploadProgress(0);
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Redirect to the property detail page or my properties page
      setTimeout(() => {
        navigate('/my-properties');
      }, 2000);
      
    } catch (err) {
      console.error('Error ' + (isEditMode ? 'updating' : 'adding') + ' property:', err);
      setError(err instanceof Error ? err.message : 'Ndodhi një gabim i papritur');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6`}>
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md">
          <p>Prona u {isEditMode ? 'përditësua' : 'shtua'} me sukses! Do të ridrejtoheni së shpejti...</p>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Informacioni bazë</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Titulli <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={`mt-1 block w-full rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-gray-300 text-gray-900'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                placeholder="p.sh. Banesë e bukur në qendër të Prishtinës"
              />
            </div>
            
            <div>
              <label htmlFor="location" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Lokacioni <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className={`block w-full pl-10 rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300 text-gray-900'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                  placeholder="p.sh. Prishtinë, Dardani"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="propertyType" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Lloji i pronës <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                </div>
                <select
                  id="propertyType"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as any)}
                  required
                  className={`block w-full pl-10 rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300 text-gray-900'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                >
                  <option value="apartment">Banesë</option>
                  <option value="house">Shtëpi</option>
                  <option value="land">Tokë</option>
                  <option value="commercial">Lokal</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="price" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Çmimi <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Euro className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className={`block w-full pl-10 rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300 text-gray-900'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                  placeholder="p.sh. 150000"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>€</span>
                </div>
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Lloji i shpalljes <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <label className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <input
                    type="radio"
                    name="listingType"
                    value="rent"
                    checked={listingType === 'rent'}
                    onChange={() => setListingType('rent')}
                    className={`h-4 w-4 ${darkMode ? 'text-blue-600 bg-gray-700' : 'text-blue-600'} focus:ring-blue-500`}
                  />
                  <span className="ml-2">Me qira</span>
                </label>
                <label className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <input
                    type="radio"
                    name="listingType"
                    value="sale"
                    checked={listingType === 'sale'}
                    onChange={() => setListingType('sale')}
                    className={`h-4 w-4 ${darkMode ? 'text-blue-600 bg-gray-700' : 'text-blue-600'} focus:ring-blue-500`}
                  />
                  <span className="ml-2">Në shitje</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Property Details */}
        <div>
          <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Detajet e pronës</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {(propertyType === 'apartment' || propertyType === 'house') && (
              <>
                <div>
                  <label htmlFor="rooms\" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Numri i dhomave
                  </label>
                  <input
                    type="number"
                    id="rooms"
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    min="0"
                    className={`mt-1 block w-full rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300 text-gray-900'
                    } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                    placeholder="p.sh. 3"
                  />
                </div>
                
                <div>
                  <label htmlFor="bathrooms" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Numri i banjove
                  </label>
                  <input
                    type="number"
                    id="bathrooms"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    min="0"
                    className={`mt-1 block w-full rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300 text-gray-900'
                    } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                    placeholder="p.sh. 2"
                  />
                </div>
              </>
            )}
            
            <div>
              <label htmlFor="area" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Sipërfaqja (m²)
              </label>
              <input
                type="number"
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                min="0"
                step="0.01"
                className={`mt-1 block w-full rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-gray-300 text-gray-900'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                placeholder="p.sh. 85.5"
              />
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Përshkrimi <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className={`mt-1 block w-full rounded-md ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'border-gray-300 text-gray-900'
            } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
            placeholder="Përshkruani pronën tuaj me detaje..."
          />
        </div>
        
        {/* Features */}
        <div>
          <TagInput 
            tags={features} 
            onTagsChange={setFeatures} 
          />
        </div>
        
        {/* Image Upload */}
        <div>
          <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Fotot e pronës</h3>
          
          <div className={`border-2 border-dashed rounded-lg p-6 ${
            darkMode 
              ? 'border-gray-600 bg-gray-700/50' 
              : 'border-gray-300 bg-gray-50'
          }`}>
            <div className="text-center">
              <Upload className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              <div className="mt-2">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Klikoni për të ngarkuar</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}> ose tërhiqni dhe lëshoni</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                PNG, JPG, GIF bis zu 10 MB (maximal {isPremium ? 15 : 3} Fotos)
              </p>
            </div>
            
            {/* Display existing images */}
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {existingImageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Property ${index + 1}`}
                    className="h-24 w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(url)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {existingImageUrls.length + imagePreviewUrls.length < (isPremium ? 15 : 3) && (
                <div className="mt-4 flex justify-center">
                  <label
                    htmlFor="add-more-images"
                    className={`flex flex-col items-center justify-center h-24 w-24 rounded-md border-2 border-dashed cursor-pointer ${
                      darkMode 
                        ? 'border-gray-600 hover:border-gray-500' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Plus className={`h-6 w-6 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <span className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Shto foto</span>
                    <input
                      id="add-more-images"
                      type="file"
                      multiple
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Hinweis zum Immobilien-Limit */}
        {!isPremium && !isEditMode && (
          <div className="mb-4 p-3 rounded bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm">
            Sie können noch <b>{3 - (propertyCount ?? 0)}</b> von 3 Immobilien als Free-User posten. Für unbegrenzte Immobilien upgraden Sie auf Premium!
          </div>
        )}
        {isPremium && !isEditMode && (
          <div className="mb-4 p-3 rounded bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm">
            Als Premium-User können Sie <b>unbegrenzt viele Immobilien</b> posten.
          </div>
        )}
        
        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                {isEditMode ? 'Duke përditësuar pronën...' : 'Duke shtuar pronën...'}
              </>
            ) : (
              isEditMode ? 'Përditëso pronën' : 'Shto pronën'
            )}
          </button>
        </div>
      </div>
      
      {/* Modal für Bild-Limit */}
      {showImageLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold mb-2">Bild-Limit erreicht</h2>
            <p className="mb-4">{imageLimitMessage}</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setShowImageLimitModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default AddPropertyForm;