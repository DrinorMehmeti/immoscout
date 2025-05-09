import React, { useState } from 'react';
import { MapPin, Building, Euro, Upload, X, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AddPropertyFormProps {
  onSuccess?: () => void;
}

const AddPropertyForm: React.FC<AddPropertyFormProps> = ({ onSuccess }) => {
  const { authState } = useAuth();
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
      setImages([...images, ...fileArray]);
      
      // Create preview URLs
      const newImageUrls = fileArray.map(file => URL.createObjectURL(file));
      setImageUrls([...imageUrls, ...newImageUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    // Release object URL to avoid memory leaks
    URL.revokeObjectURL(imageUrls[index]);
    
    setImages(images.filter((_, i) => i !== index));
    setImageUrls(imageUrls.filter((_, i) => i !== index));
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
      
      if (images.length > 0) {
        for (const image of images) {
          const fileExt = image.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `properties/${authState.user.id}/${fileName}`;
          
          const { error: uploadError, data } = await supabase.storage
            .from('property-images')
            .upload(filePath, image);
            
          if (uploadError) {
            throw new Error('Error gjatë ngarkimit të imazheve: ' + uploadError.message);
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('property-images')
            .getPublicUrl(filePath);
            
          uploadedImageUrls.push(publicUrl);
        }
      }
      
      // Create new property entry in database
      const { error: insertError } = await supabase
        .from('job_listings')
        .insert({
          employer_id: authState.user.id,
          title,
          description,
          requirements: features,
          salary_range: price,
          job_type: propertyType,
          location,
          is_remote: listingType === 'rent',
          is_active: true
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
      setImageUrls([]);
      
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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shtoni një pronë të re</h2>
      
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
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label htmlFor="listingType" className="block text-sm font-medium text-gray-700 mb-1">
              Lloji i shpalljes
            </label>
            <div className="flex space-x-4">
              <label className={`flex items-center px-4 py-2 rounded-lg border ${listingType === 'sale' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700'}`}>
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
              <label className={`flex items-center px-4 py-2 rounded-lg border ${listingType === 'rent' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700'}`}>
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
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
              Lloji i pronës
            </label>
            <div className="flex flex-wrap gap-3">
              <label className={`flex items-center px-4 py-2 rounded-lg border ${propertyType === 'apartment' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700'}`}>
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
              <label className={`flex items-center px-4 py-2 rounded-lg border ${propertyType === 'house' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700'}`}>
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
              <label className={`flex items-center px-4 py-2 rounded-lg border ${propertyType === 'land' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700'}`}>
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
              <label className={`flex items-center px-4 py-2 rounded-lg border ${propertyType === 'commercial' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700'}`}>
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
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Titulli i pronës
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="p.sh. Banesë luksoze në qendër të Prishtinës"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Përshkrimi
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Përshkruani pronën tuaj në detaje..."
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Çmimi ({listingType === 'rent' ? 'mujor' : 'total'})
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Euro className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Lokacioni
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
                  required
                  className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="p.sh. Prishtinë, Bregu i Diellit"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(propertyType === 'apartment' || propertyType === 'house') && (
              <div>
                <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">
                  Numri i dhomave
                </label>
                <input
                  type="number"
                  id="rooms"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  min="0"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            
            {(propertyType === 'apartment' || propertyType === 'house') && (
              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                  Numri i banjove
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  min="0"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                Sipërfaqja (m²)
              </label>
              <input
                type="number"
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                min="0"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Karakteristikat
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {features.map((feature, index) => (
                <div key={index} className="bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm flex items-center">
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(feature)}
                    className="ml-1 text-blue-400 hover:text-blue-600"
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
                className="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="p.sh. Parking, Ballkon, Ngrohje qendrore..."
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
              >
                Shto
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fotot e pronës
            </label>
            <div className="flex flex-wrap gap-4 mb-3">
              {imageUrls.map((url, index) => (
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
              <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400">
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="mt-1 text-xs text-gray-500">Ngarko foto</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
            </div>
            <p className="text-sm text-gray-500">Ngarko deri në 10 foto të pronës. Formati: JPG, PNG. Madhësia max: 5MB.</p>
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