import React, { useState } from 'react';
import { Upload, Camera, Sparkles, Check, ArrowRight } from 'lucide-react';
import { generateProductContent } from '../utils/aiMock';

const ProductUpload = () => {
  const [step, setStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [artisanInfo, setArtisanInfo] = useState({
    name: '',
    tradition: '',
    material: '',
    location: ''
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
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const content = generateProductContent(artisanInfo);
    setGeneratedContent(content);
    setIsGenerating(false);
    setStep(3);
  };

  const steps = [
    { number: 1, title: 'Upload Image', description: 'Add photos of your craft' },
    { number: 2, title: 'Artisan Details', description: 'Tell us about your tradition' },
    { number: 3, title: 'AI Magic', description: 'Review generated content' }
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
              Upload clear photos of your handmade products. Our AI will analyze them to create 
              compelling descriptions and stories.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tell Your Story</h2>
            <p className="text-gray-600">
              Help our AI understand your craft tradition to create authentic, culturally-rich content.
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={artisan.name}
                onChange={(e) => setArtisanInfo({...artisanInfo, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Radha Devi"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={artisanInfo.location}
                onChange={(e) => setArtisanInfo({...artisanInfo, location: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Bishnupur, West Bengal"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Craft Tradition
              </label>
              <input
                type="text"
                value={artisanInfo.tradition}
                onChange={(e) => setArtisanInfo({...artisanInfo, tradition: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Traditional Bengali Pottery"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Material
              </label>
              <input
                type="text"
                value={artisanInfo.material}
                onChange={(e) => setArtisanInfo({...artisanInfo, material: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Natural Clay, Cotton, Silk"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateContent}
            disabled={!artisanInfo.name || !artisanInfo.tradition}
            className="w-full bg-orange-600 text-white font-semibold py-4 rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Generate AI Content
          </button>
        </div>
      )}

      {/* Step 3: Generated Content */}
      {step === 3 && (
        <div className="space-y-6">
          {isGenerating ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI is Working Its Magic...</h3>
              <p className="text-gray-600">Creating compelling content for your beautiful craft</p>
            </div>
          ) : generatedContent && (
            <>
              {/* Product Title & Description */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 text-orange-600 mr-2" />
                  Product Description
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <p className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {generatedContent.title}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg leading-relaxed">
                      {generatedContent.description}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.keywords.map((keyword: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Artisan Story */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 text-orange-600 mr-2" />
                  Your Story
                </h3>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {generatedContent.story}
                </p>
              </div>

              {/* Marketing Content */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 text-orange-600 mr-2" />
                  Marketing Content
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Caption</label>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {generatedContent.marketing.instagram}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Message</label>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {generatedContent.marketing.whatsapp}
                    </p>
                  </div>
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
                <button className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all duration-200 flex items-center">
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