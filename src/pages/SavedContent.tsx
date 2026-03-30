import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle, Copy, CheckCircle2, Sparkles, Store, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';
import { Product } from '../types';

const SavedContent = () => {
  const { user } = useAuth();
  const artisan = user as any;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  useEffect(() => {
    const fetchProducts = async () => {
      if (!artisan?.id) return;
      try {
        const data = await apiService.getArtisanProducts(artisan.id);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [artisan?.id]);

  const productsWithContent = products.filter(
    p => p.aiPosts && Object.values(p.aiPosts).some(v => v && v.trim().length > 0)
  );

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'pink', bgClass: 'bg-pink-50 dark:bg-pink-900/20', textClass: 'text-pink-600 dark:text-pink-400', borderClass: 'border-pink-200 dark:border-pink-800' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'blue', bgClass: 'bg-blue-50 dark:bg-blue-900/20', textClass: 'text-blue-600 dark:text-blue-400', borderClass: 'border-blue-200 dark:border-blue-800' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'green', bgClass: 'bg-green-50 dark:bg-green-900/20', textClass: 'text-green-600 dark:text-green-400', borderClass: 'border-green-200 dark:border-green-800' },
    { id: 'marketplace', name: 'Marketplace', icon: Store, color: 'orange', bgClass: 'bg-orange-50 dark:bg-orange-900/20', textClass: 'text-orange-600 dark:text-orange-400', borderClass: 'border-orange-200 dark:border-orange-800' },
  ];

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <FileText className="h-8 w-8 text-orange-600 mr-3" />
            Saved Content
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage your AI-generated marketing content
          </p>
        </div>

        {/* Platform Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedPlatform('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPlatform === 'all'
                ? 'bg-orange-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            All Platforms
          </button>
          {platforms.map(p => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                  selectedPlatform === p.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {p.name}
              </button>
            );
          })}
        </div>

        {productsWithContent.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No saved content yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Generate and save marketing content for your products
            </p>
            <Link
              to="/marketing"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Generate Content
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {productsWithContent.map(product => {
              const filteredPlatforms = selectedPlatform === 'all'
                ? platforms.filter(pl => product.aiPosts?.[pl.id as keyof typeof product.aiPosts])
                : platforms.filter(pl => pl.id === selectedPlatform && product.aiPosts?.[pl.id as keyof typeof product.aiPosts]);

              if (filteredPlatforms.length === 0) return null;

              return (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {/* Product Header */}
                  <div className="flex items-center space-x-4 p-6 border-b border-gray-200 dark:border-gray-700">
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {product.category} {product.price ? `• ₹${product.price?.toLocaleString()}` : ''}
                      </p>
                    </div>
                    {product.aiGenerated && Object.values(product.aiGenerated).some(Boolean) && (
                      <span className="px-3 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-full flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Enhanced
                      </span>
                    )}
                  </div>

                  {/* Platform Content */}
                  <div className="p-6 space-y-6">
                    {filteredPlatforms.map(platform => {
                      const Icon = platform.icon;
                      const content = product.aiPosts?.[platform.id as keyof typeof product.aiPosts];
                      if (!content) return null;

                      const copyKey = `${product.id}-${platform.id}`;

                      return (
                        <div key={platform.id} className={`rounded-lg border ${platform.borderClass} overflow-hidden`}>
                          <div className={`flex items-center justify-between px-4 py-3 ${platform.bgClass}`}>
                            <div className="flex items-center space-x-2">
                              <Icon className={`h-5 w-5 ${platform.textClass}`} />
                              <span className={`font-medium ${platform.textClass}`}>{platform.name}</span>
                            </div>
                            <button
                              onClick={() => copyToClipboard(content, copyKey)}
                              className={`flex items-center text-sm ${platform.textClass} hover:opacity-80 transition-opacity`}
                            >
                              {copiedKey === copyKey ? (
                                <>
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 mr-1" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                          <div className="p-4 bg-white dark:bg-gray-800">
                            <p className="text-gray-800 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm">
                              {content}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedContent;
