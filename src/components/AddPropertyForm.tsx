import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import { Property } from '../types';
import TagInput from './TagInput';
import { MapPin, Euro, Building, BedDouble, Bath, Square, Image as ImageIcon, Upload, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const [propertyType, setPropertyType] = useState<Property['type']>('apartment');
  const [listingType, setListingType] = useState<Property['listing_type']>('sale');
  const [rooms, setRooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [area, setArea] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  
  // Image handling
  const [images, setImages] = useState<File[]>([]);
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      // Limit to 5 images total
      if (images.length + selectedFiles.length > 5) {
        alert('You can upload a maximum of 5 images');
        return;
      }
      
      setImages(prevImages => [...prevImages, ...selectedFiles]);
      
      // Create preview URLs
      const newImageURLs = selectedFiles.map(file => URL.createObjectURL(file));
      setImageURLs(prevURLs => [...prevURLs, ...newImageURLs]);
    }
  };
  
  // Remove image
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    
    // Also revoke the object URL to free memory
    URL.revokeObjectURL(imageURLs[index]);
    setImageURLs(imageURLs.filter((_, i) => i !== index));
  };
  
  // Upload images to Supabase Storage
  const uploadImages = async (): Promise<string[]> => {
    if (!authState.user) throw new Error('User not authenticated');
    
    const uploadPromises = images.map(async (image) => {
      const fileName = `${Date.now()}_${image.name}`;
      const filePath = `properties/${authState.user?.id}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('property_images')
        .upload(filePath, image);
      
      if (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property_images')
        .getPublicUrl(filePath);
      
      return publicUrl;
    });
    
    return Promise.all(uploadPromises);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!authState.user) {
        throw new Error('You must be logged in to add a property');
      }
      
      // Validate form
      if (!title || !description || !price || !location || !propertyType || !listingType) {
        throw new Error('Please fill in all required fields');
      }
      
      let imageUrls: string[] = [];
      
      // Upload images if any
      if (images.length > 0) {
        imageUrls = await uploadImages();
      }
      
      // Create the property in the database
      const propertyData = {
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
        images: imageUrls,
        status: 'pending' // All new properties start with pending status
      };
      
      const { error: insertError } = await supabase
        .from('properties')
        .insert([propertyData]);
      
      if (insertError) throw insertError;
      
      // Show success state
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
      
      // Revoke all image URLs to free memory
      imageURLs.forEach(url => URL.revokeObjectURL(url));
      setImageURLs([]);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Navigate to my properties page after short delay
      setTimeout(() => {
        navigate('/my-properties');
      }, 2000);
    } catch (err: any) {
      console.error('Error adding property:', err);
      setError(err.message || 'An error occurred while adding the property');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Cleanup preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      imageURLs.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imageURLs]);
  
  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-md overflow-hidden`}>
      {success ? (
        <div className="p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
          </div>
          <h3 className="mt-2 text-lg font-medium">Prona u shtua me sukses!</h3>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            Faleminderit! Prona juaj do të shfaqet në platformë pasi të rishikohet nga ekipi ynë.
          </p>
          <div className="mt-5">
            <button
              type="button"
              onClick={() => navigate('/my-properties')}
              className="inline-flex items-center px-4 py-2 border border-transparent font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Shko te pronat e mia
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-lg text-red-600 dark:text-red-300">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Informacioni bazë</h3>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Ju lutemi plotësoni të dhënat bazë për pronën tuaj
              </p>
              
              <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Titulli i pronës <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`block w-full rounded-md ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'border-gray-300 text-gray-900'
                      } focus:border-blue-500 focus:ring-blue-500`}
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Përshkrimi i pronës <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`block w-full rounded-md ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'border-gray-300 text-gray-900'
                      } focus:border-blue-500 focus:ring-blue-500`}
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Çmimi (€) <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Euro className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="price"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className={`block w-full rounded-md pl-10 ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'border-gray-300 text-gray-900'
                      } focus:border-blue-500 focus:ring-blue-500`}
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Lokacioni <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={`block w-full rounded-md pl-10 ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'border-gray-300 text-gray-900'
                      } focus:border-blue-500 focus:ring-blue-500`}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Property Details */}
            <div>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Detajet e pronës</h3>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Ju lutemi specifikoni më shumë detaje për pronën tuaj
              </p>
              
              <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="property-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Lloji i pronës <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="property-type"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value as Property['type'])}
                      className={`block w-full rounded-md pl-10 ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'border-gray-300 text-gray-900'
                      } focus:border-blue-500 focus:ring-blue-500`}
                      required
                    >
                      <option value="apartment">Banesë</option>
                      <option value="house">Shtëpi</option>
                      <option value="land">Tokë</option>
                      <option value="commercial">Lokal</option>
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="listing-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Lloji i listimit <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <input
                          id="sale"
                          name="listing-type"
                          type="radio"
                          checked={listingType === 'sale'}
                          onChange={() => setListingType('sale')}
                          className={`h-4 w-4 ${
                            darkMode
                              ? 'border-gray-600 text-blue-600 focus:ring-blue-600'
                              : 'border-gray-300 text-blue-600 focus:ring-blue-500'
                          }`}
                        />
                        <label htmlFor="sale" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Për shitje
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="rent"
                          name="listing-type"
                          type="radio"
                          checked={listingType === 'rent'}
                          onChange={() => setListingType('rent')}
                          className={`h-4 w-4 ${
                            darkMode
                              ? 'border-gray-600 text-blue-600 focus:ring-blue-600'
                              : 'border-gray-300 text-blue-600 focus:ring-blue-500'
                          }`}
                        />
                        <label htmlFor="rent" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Me qira
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                {(propertyType === 'apartment' || propertyType === 'house') && (
                  <>
                    <div className="sm:col-span-2">
                      <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Numri i dhomave
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <BedDouble className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="rooms"
                          min="0"
                          value={rooms}
                          onChange={(e) => setRooms(e.target.value)}
                          className={`block w-full rounded-md pl-10 ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'border-gray-300 text-gray-900'
                          } focus:border-blue-500 focus:ring-blue-500`}
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Numri i banjove
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Bath className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="bathrooms"
                          min="0"
                          value={bathrooms}
                          onChange={(e) => setBathrooms(e.target.value)}
                          className={`block w-full rounded-md pl-10 ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'border-gray-300 text-gray-900'
                          } focus:border-blue-500 focus:ring-blue-500`}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <div className={`sm:col-span-${(propertyType === 'apartment' || propertyType === 'house') ? '2' : '6'}`}>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sipërfaqja (m²)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Square className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="area"
                      min="0"
                      step="0.01"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className={`block w-full rounded-md pl-10 ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'border-gray-300 text-gray-900'
                      } focus:border-blue-500 focus:ring-blue-500`}
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-6">
                  <TagInput 
                    tags={features} 
                    onTagsChange={setFeatures} 
                  />
                </div>
              </div>
            </div>
            
            {/* Property Images */}
            <div>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Fotot e pronës</h3>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Ju lutemi ngarkoni foto të pronës. Maksimumi 5 foto.
              </p>
              
              <div className="mt-4">
                <div className={`flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                  darkMode 
                    ? 'border-gray-600 hover:border-gray-500'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm">
                      <label
                        htmlFor="images"
                        className={`relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none`}
                      >
                        <span>Ngarko foto</span>
                        <input
                          id="images"
                          name="images"
                          type="file"
                          accept="image/*"
                          multiple
                          className="sr-only"
                          onChange={handleImageChange}
                          ref={fileInputRef}
                        />
                      </label>
                      <p className={`pl-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ose zvarrit dhe lësho</p>
                    </div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      PNG, JPG, GIF deri në 10MB
                    </p>
                  </div>
                </div>
                
                {imageURLs.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {imageURLs.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full p-1"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Notice about approval process */}
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Procesi i Aprovimit
                  </h3>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-200">
                    <p>Të gjitha pronat e reja kalojnë në një proces rishikimi për të siguruar cilësinë e platformës sonë. Prona juaj do të jetë e dukshme për publikun pas aprovimit nga ekipi ynë.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Duke shtuar pronën...
                  </>
                ) : (
                  'Shto pronën'
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddPropertyForm;