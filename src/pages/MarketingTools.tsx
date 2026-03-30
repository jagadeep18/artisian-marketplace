import React, { useState } from 'react';
import { Instagram, Facebook, MessageCircle, Copy, Download, Sparkles, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const MarketingTools = () => {
  const { user } = useAuth();
  const artisan = user as any;
  const [selectedProduct, setSelectedProduct] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      if (!artisan?.id) return;
      try {
        const data = await apiService.getArtisanProducts(artisan.id);
        const mappedProducts = data.map((p: any) => ({
          id: p.id || p._id,
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          materials: p.materials?.join(', '),
          location: p.location,
          image: p.images?.[0] || 'https://images.pexels.com/photos/8148577/pexels-photo-8148577.jpeg?auto=compress&cs=tinysrgb&w=200'
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching products for marketing:', error);
      }
    };
    fetchProducts();
  }, [artisan?.id]);

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'pink' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'blue' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'green' }
  ];

  const handleGenerate = async () => {
    if (!selectedProduct) return;
    setIsGenerating(true);
    setSaveSuccess(false);

    const productData = products.find(p => p.id === selectedProduct);
    if (!productData) {
      setIsGenerating(false);
      return;
    }

    try {
      const aiPosts = await apiService.generateAIPosts({
        title: productData.name,
        description: productData.description || '',
        price: productData.price || '',
        category: productData.category || '',
        materialsUsed: productData.materials || '',
        location: productData.location || '',
        shopName: artisan?.shopName || '',
        contactDetails: artisan?.mobileNumber || '',
        platform: platform,
      });

      setGeneratedContent({
        caption: aiPosts[platform] || aiPosts.instagram || 'Content not available for this platform.',
        hashtags: ['#artisan', '#handmade', '#craft', '#traditional', '#handcrafted'],
        cta: platform === 'whatsapp'
          ? `DM or Call ${artisan?.mobileNumber || 'us'} to order!`
          : platform === 'instagram'
          ? 'Shop now and support traditional artisans! Link in bio 🛍️'
          : 'Explore our collection and support artisan communities today!',
        platform: platform,
        allPosts: aiPosts,
        productName: productData.name,
        productImage: productData.image,
      });
    } catch (error: any) {
      console.error('AI generation error:', error);
      setGeneratedContent({
        caption: error.message || 'Failed to generate content. Please try again.',
        hashtags: [],
        cta: ''
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedContent?.allPosts || !selectedProduct) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await apiService.saveAIPosts(selectedProduct, generatedContent.allPosts);
      setSaveSuccess(true);
    } catch (error: any) {
      console.error('Save error:', error);
      alert('Failed to save content: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    if (!generatedContent) return;
    setIsExporting(true);

    try {
      const zip = new JSZip();
      const productName = generatedContent.productName || 'product';
      const safeName = productName.replace(/[^a-zA-Z0-9]/g, '_');
      const folder = zip.folder(safeName);

      // Add content text file
      let content = generatedContent.caption || '';

      if (generatedContent.hashtags && generatedContent.hashtags.length > 0) {
        content += '\n\n' + generatedContent.hashtags.join(' ');
      }

      if (generatedContent.cta) {
        content += '\n\n' + generatedContent.cta;
      }

      folder?.file(`${safeName}_content.txt`, content);

      // Add image
      if (generatedContent.productImage) {
        try {
          const response = await fetch(generatedContent.productImage);
          if (response.ok) {
            const blob = await response.blob();
            const ext = blob.type.includes('png') ? 'png' : 'jpg';
            folder?.file(`${safeName}_image.${ext}`, blob);
          }
        } catch (imgError) {
          console.warn('Could not download product image for export:', imgError);
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${safeName}_marketing.zip`);
    } catch (error: any) {
      console.error('Export error:', error);
      alert('Failed to export content: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Marketing Content Generator</h1>
        <p className="text-gray-600 text-lg">
          Create compelling social media content and promotional materials with the power of AI.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate Content</h2>

          <div className="space-y-6">
            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Product
              </label>
              <div className="grid grid-cols-1 gap-3">
                {products.map((product) => (
                  <label key={product.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="product"
                      value={product.id}
                      checked={selectedProduct === product.id}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                      selectedProduct === product.id
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <span className="font-medium text-gray-900 flex-1">
                        {product.name}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Platform
              </label>
              <div className="grid grid-cols-3 gap-3">
                {platforms.map((platformOption) => {
                  const Icon = platformOption.icon;
                  const colorClasses = {
                    pink: 'border-pink-600 bg-pink-50 text-pink-600',
                    blue: 'border-blue-600 bg-blue-50 text-blue-600',
                    green: 'border-green-600 bg-green-50 text-green-600'
                  };

                  return (
                    <label key={platformOption.id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="platform"
                        value={platformOption.id}
                        checked={platform === platformOption.id}
                        onChange={(e) => setPlatform(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-all ${
                        platform === platformOption.id
                          ? colorClasses[platformOption.color as keyof typeof colorClasses]
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <Icon className="h-6 w-6" />
                        <span className="text-sm font-medium">{platformOption.name}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!selectedProduct || isGenerating}
              className="w-full bg-orange-600 text-white font-semibold py-3 rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Content
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Generated Content</h2>

          {!generatedContent ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600">Select a product and platform to generate content</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Caption */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-gray-700">Caption</label>
                  <button
                    onClick={() => copyToClipboard(generatedContent.caption)}
                    className="flex items-center text-sm text-orange-600 hover:text-orange-700"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {generatedContent.caption}
                  </p>
                </div>
              </div>

              {/* Hashtags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Hashtags</label>
                <div className="flex flex-wrap gap-2">
                  {generatedContent.hashtags.map((tag: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-gray-700">Call to Action</label>
                  <button
                    onClick={() => copyToClipboard(generatedContent.cta)}
                    className="flex items-center text-sm text-orange-600 hover:text-orange-700"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </button>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <p className="text-orange-800 font-medium">
                    {generatedContent.cta}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving || saveSuccess}
                  className={`flex-1 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center ${
                    saveSuccess
                      ? 'bg-green-600 text-white'
                      : 'bg-orange-600 text-white hover:bg-orange-700 disabled:bg-gray-400'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Saving...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Save Content
                    </>
                  )}
                </button>
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full mr-2" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketingTools;
