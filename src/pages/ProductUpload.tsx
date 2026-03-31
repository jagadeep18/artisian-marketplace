import React, { useState } from 'react';
import { Camera, Sparkles, Check, ArrowRight } from 'lucide-react';
import { apiService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const ProductUpload = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    dressType: '',
    description: '',
    price: '',
    color: '',
    designType: '',
    category: '',
    location: '',
    contactDetails: '',
    shopName: '',
    materialsUsed: '',
    occasionType: '',
    customizationAvailable: '',
    deliveryOptions: '',
    additionalNotes: ''
  });

  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    try {
      const posts = await apiService.generateAIPosts(formData);
      setGeneratedContent({ marketing: posts });
    } catch (e) {
      console.error(e);
      alert("Failed to generate AI content. Ensure GEMINI_API_KEY is in your server/.env");
    } finally {
      setIsGenerating(false);
      setStep(3);
    }
  };

  const handlePublishProduct = async () => {
    try {
      await apiService.createProduct({
        name: formData.title,
        description: formData.description,
        price: Number(formData.price),
        dressType: formData.dressType,
        color: formData.color,
        design: formData.designType,
        category: formData.category,
        location: formData.location,
        contact: formData.contactDetails,
        shopName: formData.shopName,
        materials: [formData.materialsUsed],
        occasion: formData.occasionType,
        customization: formData.customizationAvailable,
        delivery: formData.deliveryOptions,
        images: [uploadedImage || 'https://images.pexels.com/photos/1124725/pexels-photo-1124725.jpeg'],
        inStock: true,
        featured: true,
        aiPosts: generatedContent?.marketing,
        aiGenerated: {
          title: true,
          description: true,
          story: true,
          marketing: true,
        }
      });
      alert('Product published successfully!');
      navigate('/artisan-dashboard');
    } catch (error) {
      console.error('Error publishing product:', error);
      alert('Failed to publish product. Please try again.');
    }
  };

  const steps = [
    { number: 1, title: 'Upload Image', description: 'Add photos of your craft' },
    { number: 2, title: 'Product Details', description: 'Provide information' },
    { number: 3, title: 'AI Magic', description: 'Review promotional posts' }
  ];

  const formFields = [
    { key: 'title', label: 'Product Title', placeholder: 'e.g., Royal Silk Saree' },
    { key: 'dressType', label: 'Dress Type', placeholder: 'e.g., Saree, Lehenga' },
    { key: 'description', label: 'Description', placeholder: 'Overview...' },
    { key: 'price', label: 'Cost / Price (₹)', placeholder: 'e.g., 2999', type: 'number' },
    { key: 'color', label: 'Color', placeholder: 'e.g., Royal Blue' },
    { key: 'designType', label: 'Design Type', placeholder: 'e.g., Handwoven block print' },
    { key: 'category', label: 'Category', placeholder: 'e.g., Ethnic Wear' },
    { key: 'location', label: 'Location', placeholder: 'e.g., Hyderabad' },
    { key: 'contactDetails', label: 'Contact Details (Mobile)', placeholder: 'e.g., 9876543210', type: 'number' },
    { key: 'shopName', label: 'Shop Name', placeholder: 'e.g., Sri Lakshmi Boutique' },
    { key: 'materialsUsed', label: 'Materials Used', placeholder: 'e.g., Pure Silk' },
    { key: 'occasionType', label: 'Occasion Type', placeholder: 'e.g., Wedding, Festive' },
    { key: 'customizationAvailable', label: 'Customization Available', placeholder: 'e.g., Yes, size alterations' },
    { key: 'deliveryOptions', label: 'Delivery Options', placeholder: 'e.g., Pan India, 5-7 days' },
    { key: 'additionalNotes', label: 'Additional Notes', placeholder: 'Any other info...' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          {steps.map((stepInfo, index) => (
            <div key={index} className="flex items-center">
              <div className={`flex items-center space-x-3 ${
                step >= stepInfo.number ? 'text-orange-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step >= stepInfo.number 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepInfo.number ? <Check className="h-5 w-5" /> : stepInfo.number}
                </div>
                <div className="hidden md:block">
                  <p className="font-medium">{stepInfo.title}</p>
                  <p className="text-sm">{stepInfo.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  step > stepInfo.number ? 'bg-orange-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Image Upload */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Your Craft</h2>
            <p className="text-gray-600 mb-8">
              Upload clear photos of your handmade products.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-orange-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <Camera className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">Click to upload image</p>
                    <p className="text-sm text-gray-600">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Artisan Information */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Details</h2>
            <p className="text-gray-600">
              Provide specific information about your product so the AI can generate high-quality marketing content.
            </p>
          </div>

          {uploadedImage && (
            <div className="mb-6">
              <img
                src={uploadedImage}
                alt="Uploaded craft"
                className="w-32 h-32 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {formFields.map(field => (
              <div key={field.key} className={field.key === 'description' || field.key === 'additionalNotes' ? "md:col-span-2" : ""}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                </label>
                {field.key === 'category' ? (
                  <select
                    required
                    value={formData[field.key as keyof typeof formData]}
                    onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="" disabled>Select a category</option>
                    <option value="Textiles & Apparel">Textiles & Apparel</option>
                    <option value="Pottery & Ceramics">Pottery & Ceramics</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Jewelry & Accessories">Jewelry & Accessories</option>
                    <option value="Woodwork">Woodwork</option>
                    <option value="Art & Collectibles">Art & Collectibles</option>
                    <option value="Toys & Entertainment">Toys & Entertainment</option>
                    <option value="Vintage">Vintage</option>
                    <option value="Food & Drink">Food & Drink</option>
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    required
                    value={formData[field.key as keyof typeof formData]}
                    onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerateContent}
            disabled={!Object.values(formData).every(val => val && val.toString().trim() !== '') || isGenerating}
            className="w-full bg-orange-600 text-white font-semibold py-4 rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Generating via AI...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate AI Promotional Posts
              </>
            )}
          </button>
        </div>
      )}

      {/* Step 3: Generated Content */}
      {step === 3 && (
        <div className="space-y-6">
          {generatedContent && (
            <>
              {/* Marketing Content */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Sparkles className="h-5 w-5 text-orange-600 mr-2" />
                  Generated Promotional Posts
                </h3>
                
                <div className="space-y-8">
                  {Object.entries({
                    'WhatsApp Post': generatedContent.marketing?.whatsapp,
                    'Instagram Caption': generatedContent.marketing?.instagram,
                    'Facebook Post': generatedContent.marketing?.facebook,
                    'Marketplace Description': generatedContent.marketing?.marketplace,
                  }).map(([platform, text]) => (
                    <div key={platform}>
                      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">{platform}</label>
                      <pre className="text-sm font-sans text-gray-800 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap border border-gray-200">
                        {text || 'Content could not be generated.'}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit Details
                </button>
                <button
                  onClick={handlePublishProduct}
                  className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all duration-200 flex items-center"
                >
                  Publish Product
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductUpload;