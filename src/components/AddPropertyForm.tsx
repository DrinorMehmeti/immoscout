import React, { useState, useEffect } from 'react';
import { MapPin, Building, Euro, Upload, X, Info, BedDouble, Bath, Square } from 'lucide-react';
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

  // Check if the bucket exists and create it if it doesn't
  useEffect(() => {
    const checkAndCreateBucket = async () => {
      try {
        // First check if we can list buckets
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        
        if (bucketError) {
          console.error('Error checking buckets:', bucketError);
          setBucketStatus('unavailable');
          return;
        }
        
        // Check if our specific bucket exists
        const propertyBucket = buckets.find(bucket => bucket.name === 'property-images');
        
        if (!propertyBucket) {
          console.log('Property images bucket not found, attempting to create it');
          
          // Try to create the bucket
          const { data: newBucket, error: createError } = await supabase.storage.createBucket('property-images', {
            public: true,
            fileSizeLimit: 5242880 // 5MB in bytes
          });
          
          if (createError) {
            console.error('Error creating bucket:', createError);
            setBucketStatus('unavailable');
            return;
          }
          
          console.log('Successfully created property-images bucket');
        }
        
        // Try to list some files in the bucket to confirm access
        const { data: files, error: listError } = await supabase.storage
          .from('property-images')
          .list();
          
        if (listError) {
          console.error('Error listing files in bucket:', listError);
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
    
    checkAndCreateBucket();
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

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Shtoni një pronë të re</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start">
          <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-start">
          <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>Prona u shtua me sukses!</p>
        </div>
      )}
      
      {bucketStatus === 'unavailable' && (
        <div className="mb-6 p-4 bg-yellow-50 text-yellow-700 rounded-lg flex items-start">
          <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>Vërejtje: Storage Bucket nuk është i disponueshëm. Fotot nuk do të mund të ngarkohen por ju mund të vazhdoni të shtoni pronën.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label htmlFor="listingType" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Lloji i shpalljes
            </label>
            <div className="flex space-x-4">
              <label className={`flex items-center px-4 py-2 rounded-lg border ${listingType === 'sale' 
                ? darkMode ? 'bg-blue-900 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-500 text-blue-700' 
                : darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}>
                <input
                  type="radio"
                  name="listingType"
                  value="sale"
                  checked={listingType === 'sale'}
                  onChange={() => setListingType('sale')}
                  className="sr-only"
                />
                <span>Në shitje</span>
              </label>
              <label className={`flex items-center px-4 py-2 rounded-lg border ${listingType === 'rent' 
                ? darkMode ? 'bg-blue-900 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-500 text-blue-700' 
                : darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}>
                <input
                  type="radio"
                  name="listingType"
                  value="rent"
                  checked={listingType === 'rent'}
                  onChange={() => setListingType('rent')}
                  className="sr-only"
                />
                <span>Me qira</span>
              </label>
            </div>
          </div>
          
          <div>
            <label htmlFor="propertyType" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Lloji i pronës
            </label>
            <div className="flex flex-wrap gap-3">
              <label className={`flex items-center px-4 py-2 rounded-lg border ${propertyType === 'apartment' 
                ? darkMode ? 'bg-blue-900 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-500 text-blue-700' 
                : darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}>
                <input
                  type="radio"
                  name="propertyType"
                  value="apartment"
                  checked={propertyType === 'apartment'}
                  onChange={() => setPropertyType('apartment')}
                  className="sr-only"
                />
                <span>Banesë</span>
              </label>
              <label className={`flex items-center px-4 py-2 rounded-lg border ${propertyType === 'house' 
                ? darkMode ? 'bg-blue-900 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-500 text-blue-700' 
                : darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}>
                <input
                  type="radio"
                  name="propertyType"
                  value="house"
                  checked={propertyType === 'house'}
                  onChange={() => setPropertyType('house')}
                  className="sr-only"
                />
                <span>Shtëpi</span>
              </label>
              <label className={`flex items-center px-4 py-2 rounded-lg border ${propertyType === 'land' 
                ? darkMode ? 'bg-blue-900 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-500 text-blue-700' 
                : darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}>
                <input
                  type="radio"
                  name="propertyType"
                  value="land"
                  checked={propertyType === 'land'}
                  onChange={() => setPropertyType('land')}
                  className="sr-only"
                />
                <span>Tokë</span>
              </label>
              <label className={`flex items-center px-4 py-2 rounded-lg border ${propertyType === 'commercial' 
                ? darkMode ? 'bg-blue-900 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-500 text-blue-700' 
                : darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}>
                <input
                  type="radio"
                  name="propertyType"
                  value="commercial"
                  checked={propertyType === 'commercial'}
                  onChange={() => setPropertyType('commercial')}
                  className="sr-only"
                />
                <span>Lokal</span>
              </label>
            </div>
          </div>
          
          <div>
            <label htmlFor="title" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Titulli i pronës
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'border-gray-300 text-gray-900'
              }`}
              placeholder="p.sh. Banesë luksoze në qendër të Prishtinës"
            />
          </div>
          
          <div>
            <label htmlFor="description" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Përshkrimi
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'border-gray-300 text-gray-900'
              }`}
              placeholder="Përshkruani pronën tuaj në detaje..."
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Çmimi ({listingType === 'rent' ? 'mujor' : 'total'})
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
                  className={`pl-10 block w-full rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="location" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Lokacioni
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
                  className={`pl-10 block w-full rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                  placeholder="p.sh. Prishtinë, Bregu i Diellit"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(propertyType === 'apartment' || propertyType === 'house') && (
              <div>
                <label htmlFor="rooms" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className="flex items-center">
                    <BedDouble className="h-4 w-4 mr-1" />
                    <span>Numri i dhomave</span>
                  </div>
                </label>
                <input
                  type="number"
                  id="rooms"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  min="0"
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            )}
            
            {(propertyType === 'apartment' || propertyType === 'house') && (
              <div>
                <label htmlFor="bathrooms" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span>Numri i banjove</span>
                  </div>
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  min="0"
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            )}
            
            <div>
              <label htmlFor="area" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  <span>Sipërfaqja (m²)</span>
                </div>
              </label>
              <input
                type="number"
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                min="0"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Karakteristikat
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {features.map((feature, index) => (
                <div key={index} className={`${
                  darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-700'
                } rounded-full px-3 py-1 text-sm flex items-center`}>
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(feature)}
                    className={`ml-1 ${darkMode ? 'text-blue-400 hover:text-blue-200' : 'text-blue-400 hover:text-blue-600'}`}
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
                className={`flex-1 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'border-gray-300 text-gray-900'
                }`}
                placeholder="p.sh. Parking, Ballkon, Ngrohje qendrore..."
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-r-md"
              >
                Shto
              </button>
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Fotot e pronës
            </label>
            <div className="flex flex-wrap gap-4 mb-3">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img 
                    src={url} 
                    alt={`Property preview ${index + 1}`} 
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {previewUrls.length < 10 && bucketStatus === 'available' && (
                <label className={`w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer ${
                  darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <Upload className={`h-8 w-8 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <span className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ngarko foto</span>
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
            {bucketStatus === 'available' ? (
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Ngarko deri në 10 foto të pronës. Formati: JPG, PNG. Madhësia max: 5MB.
              </p>
            ) : (
              <p className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                Ngarkimi i fotove nuk është i disponueshëm për momentin. Mund të vazhdoni të shtoni pronën pa foto.
              </p>
            )}
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Duke u dërguar...' : 'Shto pronën'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPropertyForm;