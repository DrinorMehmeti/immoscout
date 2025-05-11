import React, { useState, useEffect } from 'react';
import { MapPin, Euro, Upload, X, Info, BedDouble, Bath, Square, Calendar, Building2, Car, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface AddPropertyFormProps {
  onSuccess?: () => void;
}

interface PropertyForm {
  // Basisdaten
  title: string;
  description: string;
  price: string;
  listingType: 'rent' | 'sale';
  propertyType: 'apartment' | 'house' | 'land' | 'commercial';
  
  // Adresse & Lage
  city: string;
  district: string;
  street: string;
  
  // Details
  area: string;
  rooms: string;
  bathrooms: string;
  yearBuilt: string;
  condition: 'new' | 'good' | 'old';
  floor: string;
  totalFloors: string;
  parking: boolean;
  parkingSpaces: string;
  
  // Ausstattung
  features: string[];
  
  // Medien
  images: File[];
}

const AddPropertyForm: React.FC<AddPropertyFormProps> = ({ onSuccess }) => {
  const { authState } = useAuth();
  const { darkMode } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<PropertyForm>({
    title: '',
    description: '',
    price: '',
    listingType: 'sale',
    propertyType: 'apartment',
    city: '',
    district: '',
    street: '',
    area: '',
    rooms: '',
    bathrooms: '',
    yearBuilt: '',
    condition: 'good',
    floor: '',
    totalFloors: '',
    parking: false,
    parkingSpaces: '',
    features: [],
    images: []
  });

  const [featureInput, setFeatureInput] = useState('');
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [bucketStatus, setBucketStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

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

  // Debug: aktuellen Schritt loggen
  useEffect(() => {
    console.log('Aktueller Schritt:', currentStep);
  }, [currentStep]);

  const handleAddFeature = () => {
    if (featureInput.trim() !== '' && !formData.features.includes(featureInput.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      
      // Limit to 10 images total
      const availableSlots = 10 - formData.images.length;
      const newFiles = fileArray.slice(0, availableSlots);
      
      if (newFiles.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newFiles]
        }));
        
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
    
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => {
      const next = prev < totalSteps ? prev + 1 : prev;
      console.log('nextStep aufgerufen, vorher:', prev, 'nachher:', next);
      return next;
    });
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index + 1 === currentStep
                  ? 'bg-blue-600 text-white'
                  : index + 1 < currentStep
                  ? 'bg-green-500 text-white'
                  : darkMode
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <div className={`ml-2 text-sm ${
                index + 1 === currentStep
                  ? darkMode ? 'text-white' : 'text-gray-900'
                  : darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {index === 0 && 'Basisdaten'}
                {index === 1 && 'Adresse & Lage'}
                {index === 2 && 'Details'}
                {index === 3 && 'Medien'}
              </div>
            </div>
            {index < totalSteps - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                index + 1 < currentStep
                  ? 'bg-green-500'
                  : darkMode
                  ? 'bg-gray-700'
                  : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Lloji i shpalljes
        </label>
        <div className="flex space-x-4">
          {['sale', 'rent'].map((type) => (
            <label
              key={type}
              className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                formData.listingType === type
                  ? darkMode
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-blue-50 border-blue-500 text-blue-700'
                  : darkMode
                  ? 'border-gray-700 text-gray-300 hover:border-gray-600'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="listingType"
                value={type}
                checked={formData.listingType === type}
                onChange={handleChange}
                className="sr-only"
              />
              <span className="font-medium">{type === 'sale' ? 'Në shitje' : 'Me qira'}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Lloji i pronës
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: 'apartment', label: 'Banesë' },
            { value: 'house', label: 'Shtëpi' },
            { value: 'land', label: 'Tokë' },
            { value: 'commercial', label: 'Lokal' }
          ].map((type) => (
            <label
              key={type.value}
              className={`flex items-center justify-center px-4 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                formData.propertyType === type.value
                  ? darkMode
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-blue-50 border-blue-500 text-blue-700'
                  : darkMode
                  ? 'border-gray-700 text-gray-300 hover:border-gray-600'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="propertyType"
                value={type.value}
                checked={formData.propertyType === type.value}
                onChange={handleChange}
                className="sr-only"
              />
              <span className="font-medium">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="title" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Titulli i pronës
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
            darkMode
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
          }`}
          placeholder="p.sh. Banesë luksoze në qendër të Prishtinës"
        />
      </div>

      <div>
        <label htmlFor="description" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Përshkrimi
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={5}
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
            darkMode
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
          }`}
          placeholder="Përshkruani pronën tuaj në detaje..."
        />
      </div>

      <div>
        <label htmlFor="price" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Çmimi ({formData.listingType === 'rent' ? 'mujor' : 'total'})
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Euro className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            className={`w-full pl-12 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
            }`}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );

  const renderLocation = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="city" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Qyteti
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
            darkMode
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
          }`}
          placeholder="p.sh. Prishtinë"
        />
      </div>

      <div>
        <label htmlFor="district" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Lagjja / Komuna
        </label>
        <input
          type="text"
          id="district"
          name="district"
          value={formData.district}
          onChange={handleChange}
          required
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
            darkMode
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
          }`}
          placeholder="p.sh. Dardania"
        />
      </div>

      <div>
        <label htmlFor="street" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Rruga
        </label>
        <input
          type="text"
          id="street"
          name="street"
          value={formData.street}
          onChange={handleChange}
          required
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
            darkMode
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
          }`}
          placeholder="p.sh. Rr. Dardania, Nr. 123"
        />
      </div>
    </div>
  );

  const renderDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="area" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            <div className="flex items-center">
              <Square className="h-5 w-5 mr-2" />
              <span>Sipërfaqja (m²)</span>
            </div>
          </label>
          <input
            type="number"
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            required
            min="0"
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
            }`}
          />
        </div>

        {(formData.propertyType === 'apartment' || formData.propertyType === 'house') && (
          <>
            <div>
              <label htmlFor="rooms" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                <div className="flex items-center">
                  <BedDouble className="h-5 w-5 mr-2" />
                  <span>Numri i dhomave</span>
                </div>
              </label>
              <select
                id="rooms"
                name="rooms"
                value={formData.rooms}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                }`}
              >
                <option value="">Zgjidhni numrin e dhomave</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="bathrooms" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2" />
                  <span>Numri i banjove</span>
                </div>
              </label>
              <select
                id="bathrooms"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                }`}
              >
                <option value="">Zgjidhni numrin e banjove</option>
                {Array.from({ length: 5 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="yearBuilt" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>Viti i ndërtimit</span>
            </div>
          </label>
          <input
            type="number"
            id="yearBuilt"
            name="yearBuilt"
            value={formData.yearBuilt}
            onChange={handleChange}
            min="1900"
            max={new Date().getFullYear()}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
            }`}
            placeholder="p.sh. 2020"
          />
        </div>

        <div>
          <label htmlFor="condition" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            <div className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              <span>Gjendja e pronës</span>
            </div>
          </label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
            }`}
          >
            <option value="new">E re</option>
            <option value="good">Në gjendje të mirë</option>
            <option value="old">E vjetër</option>
          </select>
        </div>
      </div>

      {(formData.propertyType === 'apartment' || formData.propertyType === 'house') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="floor" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Kat
            </label>
            <input
              type="number"
              id="floor"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              min="0"
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
              }`}
              placeholder="p.sh. 3"
            />
          </div>

          <div>
            <label htmlFor="totalFloors" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Numri i përgjithshëm i kateve
            </label>
            <input
              type="number"
              id="totalFloors"
              name="totalFloors"
              value={formData.totalFloors}
              onChange={handleChange}
              min="1"
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
              }`}
              placeholder="p.sh. 5"
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="parking"
            name="parking"
            checked={formData.parking}
            onChange={handleChange}
            className={`h-5 w-5 rounded border-2 ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500'
                : 'bg-white border-gray-300 text-blue-500 focus:ring-blue-500'
            }`}
          />
          <label htmlFor="parking" className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Parking i disponueshëm
          </label>
        </div>

        {formData.parking && (
          <div>
            <label htmlFor="parkingSpaces" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              <div className="flex items-center">
                <Car className="h-5 w-5 mr-2" />
                <span>Numri i vendeve të parkimit</span>
              </div>
            </label>
            <input
              type="number"
              id="parkingSpaces"
              name="parkingSpaces"
              value={formData.parkingSpaces}
              onChange={handleChange}
              min="1"
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
              }`}
              placeholder="p.sh. 1"
            />
          </div>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Karakteristikat
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.features.map((feature, index) => (
            <div
              key={index}
              className={`${
                darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-50 text-blue-700'
              } rounded-full px-4 py-2 text-sm flex items-center gap-2`}
            >
              <span>{feature}</span>
              <button
                type="button"
                onClick={() => handleRemoveFeature(feature)}
                className={`${
                  darkMode ? 'text-blue-400 hover:text-blue-200' : 'text-blue-500 hover:text-blue-700'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
            }`}
            placeholder="p.sh. Parking, Ballkon, Ngrohje qendrore..."
          />
          <button
            type="button"
            onClick={handleAddFeature}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
          >
            Shto
          </button>
        </div>
      </div>
    </div>
  );

  const renderMedia = () => (
    <div className="space-y-6">
      <div>
        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Fotot e pronës
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative aspect-square group">
              <img
                src={url}
                alt={`Property preview ${index + 1}`}
                className="w-full h-full object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {previewUrls.length < 10 && bucketStatus === 'available' && (
            <label
              className={`aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 ${
                darkMode
                  ? 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50'
              }`}
            >
              <Upload className={`h-8 w-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Ngarko foto
              </span>
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
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Ngarko deri në 10 foto të pronës. Formati: JPG, PNG. Madhësia max: 5MB.
        </p>
      </div>
    </div>
  );

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
      
      if (formData.images.length > 0 && bucketStatus === 'available') {
        const bucketName = 'property-images';
        
        try {
          for (const image of formData.images) {
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
      
      // Create new property entry in database
      const { data: newProperty, error: insertError } = await supabase
        .from('properties')
        .insert({
          owner_id: authState.user.id,
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          location: `${formData.city}, ${formData.district}, ${formData.street}`,
          type: formData.propertyType,
          listing_type: formData.listingType,
          rooms: formData.rooms ? parseInt(formData.rooms, 10) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms, 10) : null,
          area: formData.area ? parseFloat(formData.area) : null,
          features: formData.features,
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
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Redirect to the new property's detail page
      if (newProperty) {
        navigate(`/property/${newProperty.id}`);
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

  // Enter-Submit in Schritt 1-3 verhindern
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (currentStep !== totalSteps && e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-xl p-8 max-w-4xl mx-auto`}>
      <div className="mb-8">
        <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
          Shtoni një pronë të re
        </h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
          Plotësoni formularin më poshtë për të shtuar një pronë të re në platformën tonë
        </p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-xl flex items-start">
          <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-xl flex items-start">
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
      
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-8">
        {renderStepIndicator()}
        
        {currentStep === 1 && renderBasicInfo()}
        {currentStep === 2 && renderLocation()}
        {currentStep === 3 && renderDetails()}
        {currentStep === 4 && renderMedia()}
        
        <div className="flex justify-between pt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
            >
              Prapa
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center"
            >
              Vazhdo
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Duke u dërguar...' : 'Shto pronën'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddPropertyForm;