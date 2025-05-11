import React, { useState, useEffect } from 'react';
import { MapPin, Euro, Upload, X, Info, BedDouble, Bath, Square, Calendar, Building2, Car, ArrowRight, ChevronLeft, ChevronRight, Home, Check, Plus, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';

interface AddPropertyFormProps {
  onSuccess?: () => void;
}

// Define steps for the form
const STEPS = {
  BASIC_INFO: 0,
  DETAILS: 1,
  FEATURES: 2,
  IMAGES: 3,
  REVIEW: 4
} as const;

type StepKey = keyof typeof STEPS;
type StepValue = typeof STEPS[StepKey];

interface FormData {
  title: string;
  description: string;
  price: string;
  location: string;
  propertyType: string;
  listingType: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  features: string[];
  images: File[];
}

const AddPropertyForm: React.FC<AddPropertyFormProps> = ({ onSuccess }): JSX.Element => {
  const { authState } = useAuth();
  const { darkMode } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepValue>(STEPS.BASIC_INFO);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [bucketStatus, setBucketStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [featureInput, setFeatureInput] = useState('');
  
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: 'apartment',
    listingType: 'sale',
    bedrooms: '',
    bathrooms: '',
    area: '',
    features: [],
    images: []
  });

  // Additional details fields
  const [buildingYear, setBuildingYear] = useState('');
  const [floor, setFloor] = useState('');
  const [totalFloors, setTotalFloors] = useState('');
  const [hasParking, setHasParking] = useState(false);
  const [parkingSpaces, setParkingSpaces] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [condition, setCondition] = useState<'new' | 'good' | 'needs-renovation'>('good');

  // Step validation state
  const [stepValidation, setStepValidation] = useState<Record<StepValue, boolean>>({
    [STEPS.BASIC_INFO]: false,
    [STEPS.DETAILS]: true,
    [STEPS.FEATURES]: true,
    [STEPS.IMAGES]: true,
    [STEPS.REVIEW]: true
  });

  // Check if the bucket exists without trying to create it
  useEffect(() => {
    const checkBucketAvailability = async () => {
      try {
        // Check if we can access the property_images bucket (note the underscore)
        const { error: listError } = await supabase.storage
          .from('property_images')
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

  // Update step validation
  const updateStepValidation = (step: StepValue, isValid: boolean) => {
    setStepValidation(prev => ({
      ...prev,
      [step]: isValid
    }));
  };

  // In the useEffect for step validation
  useEffect(() => {
    const validateCurrentStep = () => {
      switch (currentStep) {
        case STEPS.BASIC_INFO:
          updateStepValidation(STEPS.BASIC_INFO, 
            Boolean(formData.title && formData.description && formData.price && formData.location)
          );
          break;
        case STEPS.DETAILS:
          updateStepValidation(STEPS.DETAILS, true);
          break;
        case STEPS.FEATURES:
          updateStepValidation(STEPS.FEATURES, true);
          break;
        case STEPS.IMAGES:
          updateStepValidation(STEPS.IMAGES, true);
          break;
        case STEPS.REVIEW:
          updateStepValidation(STEPS.REVIEW, true);
          break;
      }
    };

    validateCurrentStep();
  }, [currentStep, formData.title, formData.description, formData.price, formData.location]);

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

  // Go to next step if current step is valid
  const nextStep = () => {
    if (currentStep < STEPS.REVIEW && stepValidation[currentStep]) {
      setCurrentStep((currentStep + 1) as StepValue);
      window.scrollTo(0, 0);
    }
  };

  // Go to previous step
  const prevStep = () => {
    if (currentStep > STEPS.BASIC_INFO) {
      setCurrentStep((currentStep - 1) as StepValue);
      window.scrollTo(0, 0);
    }
  };

  // Handle final form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      if (!authState.isAuthenticated || !authState.user) {
        throw new Error('Ju duhet të jeni të kyçur për të shtuar pronë');
      }
      
      // Validate price
      if (!formData.price || formData.price.trim() === '') {
        throw new Error('Çmimi është i detyruar. Ju lutemi vendosni një vlerë.');
      }

      const priceValue = parseFloat(formData.price);
      if (isNaN(priceValue) || priceValue <= 0) {
        throw new Error('Ju lutemi vendosni një çmim të vlefshëm më të madh se 0.');
      }
      
      // Upload images to Supabase Storage
      const uploadedImageUrls: string[] = [];
      
      if (formData.images.length > 0 && bucketStatus === 'available') {
        const bucketName = 'property_images'; // Using underscore instead of hyphen
        
        try {
          for (const image of formData.images) {
            const fileExt = image.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `properties/${authState.user.id}/${fileName}`;
            
            const { error: uploadError } = await supabase.storage
              .from(bucketName)
              .upload(filePath, image);
              
            if (uploadError) {
              console.error('Error in upload process:', uploadError);
              // Continue without this image
              continue;
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
          title: formData.title,
          description: formData.description,
          price: priceValue,
          location: formData.location,
          type: formData.propertyType,
          listing_type: formData.listingType,
          rooms: formData.bedrooms ? parseInt(formData.bedrooms, 10) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms, 10) : null,
          area: formData.area ? parseFloat(formData.area) : null,
          features: formData.features,
          images: uploadedImageUrls.length > 0 ? uploadedImageUrls : [],
          status: 'pending', // Set status to pending for admin approval
          featured: false
        });
        
      if (insertError) {
        throw new Error('Gabim gjatë ruajtjes së të dhënave: ' + insertError.message);
      }
      
      setSuccess(true);
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        location: '',
        propertyType: 'apartment',
        listingType: 'sale',
        bedrooms: '',
        bathrooms: '',
        area: '',
        features: [],
        images: []
      });
      setPreviewUrls([]);
      setCurrentStep(STEPS.BASIC_INFO);
      
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

  const renderStepIndicator = () => {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center">
          {Object.values(STEPS).filter(step => typeof step === 'number').map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentStep === step 
                    ? 'bg-blue-600 text-white' 
                    : currentStep > step 
                      ? 'bg-green-500 text-white' 
                      : darkMode 
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-200 text-gray-600'
                }`}
              >
                {currentStep > step ? <Check className="h-5 w-5" /> : step + 1}
              </div>
              <span className={`text-xs mt-2 ${
                currentStep === step 
                  ? 'text-blue-600 font-medium' 
                  : darkMode 
                    ? 'text-gray-400' 
                    : 'text-gray-500'
              }`}>
                {step === STEPS.BASIC_INFO && 'Bazike'}
                {step === STEPS.DETAILS && 'Detajet'}
                {step === STEPS.FEATURES && 'Karakteristikat'}
                {step === STEPS.IMAGES && 'Fotot'}
                {step === STEPS.REVIEW && 'Përfundo'}
              </span>
            </div>
          ))}
        </div>
        <div className="relative flex items-center justify-between mt-2">
          <div className="absolute left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 top-1/2 transform -translate-y-1/2 z-0"></div>
          {Object.values(STEPS).filter(step => typeof step === 'number').map((step) => (
            <div 
              key={step}
              className={`w-full h-1 z-10 transition-colors ${
                step < currentStep 
                  ? 'bg-green-500' 
                  : step === currentStep 
                    ? 'bg-blue-600' 
                    : darkMode 
                      ? 'bg-gray-700' 
                      : 'bg-gray-200'
              }`}
            ></div>
          ))}
        </div>
      </div>
    );
  };

  const renderBasicInfoStep = () => {
    return (
      <>
        <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Informacionet Bazike
        </h3>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="listingType" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Lloji i shpalljes
            </label>
            <div className="flex space-x-4">
              <label className={`flex items-center px-4 py-2 rounded-lg border ${formData.listingType === 'sale' 
                ? darkMode ? 'bg-blue-900 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-500 text-blue-700' 
                : darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}>
                <input
                  type="radio"
                  name="listingType"
                  value="sale"
                  checked={formData.listingType === 'sale'}
                  onChange={(e) => setFormData(prev => ({ ...prev, listingType: 'sale' }))}
                  className="sr-only"
                />
                <span>Në shitje</span>
              </label>
              <label className={`flex items-center px-4 py-2 rounded-lg border ${formData.listingType === 'rent' 
                ? darkMode ? 'bg-blue-900 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-500 text-blue-700' 
                : darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}>
                <input
                  type="radio"
                  name="listingType"
                  value="rent"
                  checked={formData.listingType === 'rent'}
                  onChange={(e) => setFormData(prev => ({ ...prev, listingType: 'rent' }))}
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
              <label className={`flex items-center px-4 py-2 rounded-lg border ${formData.propertyType === 'apartment' 
                ? darkMode ? 'bg-blue-900 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-500 text-blue-700' 
                : darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}>
                <input
                  type="radio"
                  name="propertyType"
                  value="apartment"
                  checked={formData.propertyType === 'apartment'}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyType: 'apartment' }))}
                  className="sr-only"
                />
                <span>Banesë</span>
              </label>
              <label className={`flex items-center px-4 py-2 rounded-lg border ${formData.propertyType === 'house' 
                ? darkMode ? 'bg-blue-900 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-500 text-blue-700' 
                : darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}>
                <input
                  type="radio"
                  name="propertyType"
                  value="house"
                  checked={formData.propertyType === 'house'}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyType: 'house' }))}
                  className="sr-only"
                />
                <span>Shtëpi</span>
              </label>
              <label className={`flex items-center px-4 py-2 rounded-lg border ${formData.propertyType === 'land' 
                ? darkMode ? 'bg-blue-900 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-500 text-blue-700' 
                : darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}>
                <input
                  type="radio"
                  name="propertyType"
                  value="land"
                  checked={formData.propertyType === 'land'}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyType: 'land' }))}
                  className="sr-only"
                />
                <span>Tokë</span>
              </label>
              <label className={`flex items-center px-4 py-2 rounded-lg border ${formData.propertyType === 'commercial' 
                ? darkMode ? 'bg-blue-900 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-500 text-blue-700' 
                : darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}>
                <input
                  type="radio"
                  name="propertyType"
                  value="commercial"
                  checked={formData.propertyType === 'commercial'}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyType: 'commercial' }))}
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
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
                Çmimi ({formData.listingType === 'rent' ? 'mujor' : 'total'})
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Euro className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                  min="1"
                  step="any"
                  className={`pl-10 block w-full rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                  placeholder="0"
                />
              </div>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Çmimi është i detyrueshëm dhe duhet të jetë më i madh se 0
              </p>
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
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
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
        </div>
      </>
    );
  };

  const renderDetailsStep = () => {
    return (
      <>
        <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Detajet e Pronës
        </h3>
        
        <div className="space-y-6">
          {/* Basic measurements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(formData.propertyType === 'apartment' || formData.propertyType === 'house') && (
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
                  value={formData.bedrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                  min="0"
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            )}
            
            {(formData.propertyType === 'apartment' || formData.propertyType === 'house') && (
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
                  value={formData.bathrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
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
                value={formData.area}
                onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                min="0"
                step="0.01"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
          
          {/* Additional property details */}
          {(formData.propertyType === 'apartment' || formData.propertyType === 'house') && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="buildingYear" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Viti i ndërtimit</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    id="buildingYear"
                    value={buildingYear}
                    onChange={(e) => setBuildingYear(e.target.value)}
                    min="1900"
                    max={new Date().getFullYear()}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300 text-gray-900'
                    }`}
                    placeholder="p.sh. 2010"
                  />
                </div>
                
                {formData.propertyType === 'apartment' && (
                  <div>
                    <label htmlFor="floor" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-1" />
                        <span>Kati</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      id="floor"
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                      min="0"
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300 text-gray-900'
                      }`}
                      placeholder="p.sh. 3"
                    />
                  </div>
                )}
                
                {formData.propertyType === 'apartment' && (
                  <div>
                    <label htmlFor="totalFloors" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-1" />
                        <span>Numri i përgjithshëm i kateve</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      id="totalFloors"
                      value={totalFloors}
                      onChange={(e) => setTotalFloors(e.target.value)}
                      min="1"
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300 text-gray-900'
                      }`}
                      placeholder="p.sh. 8"
                    />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    <div className="flex items-center">
                      <Car className="h-4 w-4 mr-1" />
                      <span>Vendparkimi</span>
                    </div>
                  </label>
                  <div className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      id="hasParking"
                      checked={hasParking}
                      onChange={(e) => setHasParking(e.target.checked)}
                      className={`h-4 w-4 rounded focus:ring-blue-500 ${
                        darkMode ? 'text-blue-600 border-gray-600' : 'text-blue-600 border-gray-300'
                      }`}
                    />
                    <label htmlFor="hasParking" className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Ka parking të dedikuar
                    </label>
                  </div>
                  
                  {hasParking && (
                    <div className="mt-2">
                      <label htmlFor="parkingSpaces" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Numri i vendeve të parkimit
                      </label>
                      <input
                        type="number"
                        id="parkingSpaces"
                        value={parkingSpaces}
                        onChange={(e) => setParkingSpaces(e.target.value)}
                        min="1"
                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="condition" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Gjendja e pronës
                  </label>
                  <select
                    id="condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as 'new' | 'good' | 'needs-renovation')}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="new">E re</option>
                    <option value="good">E mirë</option>
                    <option value="needs-renovation">Nevojitet renovim</option>
                  </select>
                </div>
              </div>
            </>
          )}
          
          <div>
            <label htmlFor="neighborhood" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Lagjja / Vendndodhja specifike
            </label>
            <input
              type="text"
              id="neighborhood"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'border-gray-300 text-gray-900'
              }`}
              placeholder="p.sh. Dardania, afër shkollës Ismail Qemali"
            />
          </div>
        </div>
      </>
    );
  };

  const renderFeaturesStep = () => {
    return (
      <>
        <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Karakteristikat dhe Pajisjet
        </h3>
        
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Veçoritë e pronës
          </label>
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Shtoni karakteristikat e veçanta të pronës tuaj për të tërhequr vëmendjen e klientëve
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.features.map((feature, index) => (
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddFeature();
                }
              }}
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
          
          <div className="mt-6">
            <h4 className={`text-lg font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Veçoritë e zakonshme
            </h4>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Kliko në veçoritë e mëposhtme për t'i shtuar më shpejt
            </p>
            
            <div className="flex flex-wrap gap-2">
              {['Ballkon', 'Parking', 'Ngrohje qendrore', 'Ashensor', 'Klimë', 'Internet', 
                'E mobiluar', 'Kuzhinë e ndarë', 'Pemë frutore', 'Siguri', 'Vendparkimi i mbuluar',
                'Dritare dyshe', 'Sistem alarmi', 'Afër qendrës', 'Afër shkollës'].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    if (!formData.features.includes(suggestion)) {
                      setFormData(prev => ({ ...prev, features: [...prev.features, suggestion] }))
                    }
                  }}
                  disabled={formData.features.includes(suggestion)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    formData.features.includes(suggestion)
                      ? darkMode 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderImagesStep = () => {
    return (
      <>
        <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Fotot e Pronës
        </h3>
        
        <div>
          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Fotot tërheqin më shumë klientë potencialë. Ngarkoni foto të cilësisë së mirë për të rritur shanset e shijes së pronës suaj.
          </p>
          
          {bucketStatus === 'checking' && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg flex items-start">
              <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>Duke kontrolluar disponueshmërinë e ruajtjes së fotove...</p>
            </div>
          )}
          
          {bucketStatus === 'unavailable' && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-lg flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Vërejtje: Ruajtja e fotove është përkohësisht e padisponueshme</p>
                <p className="mt-1">Ju mund të vazhdoni pa foto për momentin dhe t'i shtoni ato më vonë. Prona juaj do të publikohet pa foto.</p>
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative aspect-square">
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
                <label className={`aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer ${
                  darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <Upload className={`h-8 w-8 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <span className={`mt-2 text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Kliko për të ngarkuar foto
                    <br />
                    <span className="text-xs">
                      {10 - previewUrls.length} foto të mbetura
                    </span>
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
            
            {bucketStatus === 'available' ? (
              <div>
                <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  Këshilla për foto efektive:
                </h4>
                <ul className={`list-disc pl-5 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <li>Përdorni dritë natyrore sa më shumë të jetë e mundur</li>
                  <li>Kapni dhomën nga kënde të ndryshme</li>
                  <li>Sigurohuni që hapësira të jetë e pastër dhe e rregulluar</li>
                  <li>Fotografoni të gjitha hapësirat kryesore të pronës</li>
                  <li>Madhësia maksimale e skedarit: 5MB për foto</li>
                </ul>
              </div>
            ) : (
              bucketStatus === 'unavailable' && (
                <p className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  Ngarkimi i fotove nuk është i disponueshëm për momentin. Mund të vazhdoni të shtoni pronën pa foto.
                </p>
              )
            )}
          </div>
        </div>
      </>
    );
  };

  const renderReviewStep = () => {
    return (
      <>
        <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Rishikimi dhe Dorëzimi
        </h3>
        
        {/* Add approval notice */}
        <div className={`p-4 mb-6 rounded-lg ${
          darkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'
        } flex items-start`}>
          <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Prona juaj do të duhet të aprovohet nga administratorët</p>
            <p className="mt-1">Pas shtimit, prona juaj do të jetë në statusin "Në pritje" derisa të aprovohet nga administratorët tanë. Ky proces zakonisht zgjat 24-48 orë.</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h4 className={`text-lg font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Informacionet Bazike
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Lloji i shpalljes:
                </p>
                <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {formData.listingType === 'sale' ? 'Në shitje' : 'Me qira'}
                </p>
              </div>
              
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Lloji i pronës:
                </p>
                <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {formData.propertyType === 'apartment' && 'Banesë'}
                  {formData.propertyType === 'house' && 'Shtëpi'}
                  {formData.propertyType === 'land' && 'Tokë'}
                  {formData.propertyType === 'commercial' && 'Lokal'}
                </p>
              </div>
              
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Titulli:
                </p>
                <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {formData.title}
                </p>
              </div>
              
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Çmimi:
                </p>
                <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {formData.price} € {formData.listingType === 'rent' ? '/muaj' : ''}
                </p>
              </div>
              
              <div className="md:col-span-2">
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Lokacioni:
                </p>
                <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {formData.location}
                </p>
              </div>
              
              <div className="md:col-span-2">
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Përshkrimi:
                </p>
                <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {formData.description}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h4 className={`text-lg font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Detajet e Pronës
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formData.bedrooms && (
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Dhoma:
                  </p>
                  <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {formData.bedrooms}
                  </p>
                </div>
              )}
              
              {formData.bathrooms && (
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Banjo:
                  </p>
                  <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {formData.bathrooms}
                  </p>
                </div>
              )}
              
              {formData.area && (
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Sipërfaqja:
                  </p>
                  <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {formData.area} m²
                  </p>
                </div>
              )}
              
              {buildingYear && (
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Viti i ndërtimit:
                  </p>
                  <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {buildingYear}
                  </p>
                </div>
              )}
              
              {floor && (
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Kati:
                  </p>
                  <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {floor}
                  </p>
                </div>
              )}
              
              {hasParking && (
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Parkimi:
                  </p>
                  <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {parkingSpaces ? `${parkingSpaces} vende` : 'Ka parking'}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {formData.features.length > 0 && (
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h4 className={`text-lg font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Karakteristikat
              </h4>
              
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <span 
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {previewUrls.length > 0 && (
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h4 className={`text-lg font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Fotot e pronës ({previewUrls.length})
              </h4>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="aspect-square">
                    <img 
                      src={url} 
                      alt={`Property preview ${index + 1}`} 
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="border-t pt-6">
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Duke klikuar në butonin "Publiko pronën", ju pajtoheni me kushtet e përdorimit dhe konfirmoni që të gjitha të dhënat e dhëna janë të sakta.
            </p>
          </div>
        </div>
      </>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case STEPS.BASIC_INFO:
        return renderBasicInfoStep();
      case STEPS.DETAILS:
        return renderDetailsStep();
      case STEPS.FEATURES:
        return renderFeaturesStep();
      case STEPS.IMAGES:
        return renderImagesStep();
      case STEPS.REVIEW:
        return renderReviewStep();
      default:
        return renderBasicInfoStep();
    }
  };

  const renderStepNavigation = () => {
    return (
      <div className="flex justify-between mt-8">
        {currentStep > STEPS.BASIC_INFO ? (
          <button
            type="button"
            onClick={prevStep}
            className={`flex items-center px-4 py-2 rounded-md ${
              darkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Kthehu mbrapa
          </button>
        ) : (
          <div></div> // Empty div to maintain flex spacing
        )}
        
        {currentStep < STEPS.REVIEW ? (
          <button
            type="button"
            onClick={nextStep}
            disabled={!stepValidation[currentStep]}
            className={`flex items-center px-6 py-2 rounded-md font-medium ${
              stepValidation[currentStep]
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : darkMode 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Vazhdo
            <ChevronRight className="h-5 w-5 ml-2" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                Publiko pronën
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  if (success) {
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 animate-fadeIn`}>
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Prona u shtua me sukses!
          </h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            Prona juaj tani është në pritje të aprovimit nga stafi ynë. Sapo të aprovohet, 
            prona do të jetë në dispozicion për klientët potencialë për ta shikuar.
          </p>
          <div className={`p-4 mb-8 rounded-lg ${
            darkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'
          }`}>
            <p>Procesi i aprovimit zakonisht zgjat 24-48 orë. Do të merrni një njoftim 
            kur prona juaj aprovohet.</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Shto një pronë tjetër
            </button>
            <button
              onClick={() => window.location.href = '/my-properties'}
              className={`px-6 py-3 rounded-md flex items-center justify-center ${
                darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Home className="h-5 w-5 mr-2" />
              Shko tek pronat e mia
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 animate-fadeIn`}>
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg flex items-start">
          <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      {renderStepIndicator()}
      
      <form onSubmit={(e) => {
        e.preventDefault();
        if (currentStep === STEPS.REVIEW) {
          handleSubmit(e);
        } else {
          nextStep();
        }
      }}>
        {renderCurrentStep()}
        {renderStepNavigation()}
      </form>
    </div>
  );
};

export default AddPropertyForm;