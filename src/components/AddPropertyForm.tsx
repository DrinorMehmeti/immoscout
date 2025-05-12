import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Building, Euro, Upload, X, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import TagInput from './TagInput';

interface AddPropertyFormProps {
  onSuccess?: () => void;
}

const AddPropertyForm: React.FC<AddPropertyFormProps> = ({ onSuccess }) => {
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
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Limit to 10 images total
      if (images.length + newFiles.length > 10) {
        alert('Ju mund të ngarkoni maksimum 10 foto');
        return;
      }
      
      // Create preview URLs for the new images
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
  
  const uploadImagesToStorage = async (propertyId: string): Promise<string[]> => {
    if (images.length === 0) return [];
    
    try {
      const uploadedUrls: string[] = [];
      
      // Create a folder for this property using the user's ID and property ID
      const userId = authState.user?.id;
      if (!userId) throw new Error('User ID not found');
      
      // Check if the bucket exists first
      const { data: buckets, error: bucketError } = await supabase
        .storage
        .listBuckets();
      
      if (bucketError) {
        console.error('Error checking buckets:', bucketError);
        throw new Error('Error checking storage buckets');
      }
      
      const bucketExists = buckets.some(bucket => bucket.name === 'property_images');
      
      // Create the bucket if it doesn't exist
      if (!bucketExists) {
        try {
          const { data, error } = await supabase
            .storage
            .createBucket('property_images', {
              public: true,
              fileSizeLimit: 10485760, // 10MB
            });
            
          if (error) {
            console.error('Error creating bucket:', error);
            throw new Error('Error creating storage bucket');
          }
          
          console.log('Created bucket:', data);
        } catch (err) {
          console.error('Error in bucket creation:', err);
          throw new Error('Could not create storage bucket. Make sure you have the necessary permissions.');
        }
      }
      
      // Upload each image
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${userId}/${propertyId}/${fileName}`;
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / images.length) * 100));
        
        const { data, error } = await supabase.storage
          .from('property_images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (error) {
          console.error('Error uploading image:', error);
          throw error;
        }
        
        if (data) {
          // Get the public URL for the uploaded image
          const { data: { publicUrl } } = supabase.storage
            .from('property_images')
            .getPublicUrl(filePath);
            
          uploadedUrls.push(publicUrl);
        }
      }
      
      return uploadedUrls;
    } catch (error) {
      console.error('Error in upload process:', error);
      throw error;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authState.user) {
      setError('Ju duhet të jeni të kyçur për të shtuar një pronë');
      return;
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
      
      // Insert the property into the database
      const { data: property, error: insertError } = await supabase
        .from('properties')
        .insert({
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
          status: 'pending' // All new properties start as pending until approved
        })
        .select()
        .single();
        
      if (insertError) {
        throw insertError;
      }
      
      if (!property) {
        throw new Error('Ndodhi një gabim gjatë shtimit të pronës');
      }
      
      // Upload images if any
      if (images.length > 0) {
        const uploadedImageUrls = await uploadImagesToStorage(property.id);
        
        // Update the property with the image URLs
        if (uploadedImageUrls.length > 0) {
          const { error: updateError } = await supabase
            .from('properties')
            .update({
              images: uploadedImageUrls
            })
            .eq('id', property.id);
            
          if (updateError) {
            console.error('Error updating property with image URLs:', updateError);
            // Continue anyway, the property was created successfully
          }
        }
      }
      
      // Success!
      setSuccess(true);
      
      // Reset form
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
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Redirect to the property detail page or my properties page
      setTimeout(() => {
        navigate('/my-properties');
      }, 2000);
      
    } catch (err) {
      console.error('Error adding property:', err);
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
          <p>Prona u shtua me sukses! Do të ridrejtoheni së shpejti...</p>
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
                  <label htmlFor="rooms" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                PNG, JPG, GIF deri në 10 MB (maksimum 10 foto)
              </p>
            </div>
            
            {imagePreviewUrls.length > 0 && (
              <div className="mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Add more images button */}
                  {imagePreviewUrls.length < 10 && (
                    <div className="aspect-w-1 aspect-h-1 w-full">
                      <label
                        htmlFor="add-more-images"
                        className={`flex flex-col items-center justify-center h-full rounded-md border-2 border-dashed cursor-pointer ${
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
            )}
          </div>
        </div>
        
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
                Duke shtuar pronën...
              </>
            ) : (
              'Shto pronën'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddPropertyForm;