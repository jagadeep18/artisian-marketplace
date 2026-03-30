import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Star, ShoppingBag, X, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';
import { Product } from '../types';

const Favourites = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavourites = async () => {
      if (!user) return;
      try {
        const data = await apiService.getFavourites();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching favourites:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, [user]);

  const removeFavourite = async (productId: string) => {
    try {
      await apiService.removeFavourite(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      if (selectedProduct?.id === productId) {
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error('Error removing favourite:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const artisan = selectedProduct?.artisan as any;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Heart className="h-8 w-8 text-red-500 fill-red-500 mr-3" />
            My Favourites
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Products you've saved for later
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No favourites yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Browse the marketplace and click the heart icon to save products
            </p>
            <Link
              to="/marketplace"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavourite(product.id);
                    }}
                    className="absolute top-3 right-3 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-110 transition-all"
                  >
                    <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                  </button>
                  {product.featured && (
                    <div className="absolute top-3 left-3 bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-orange-600 font-medium">{product.category}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{product.artisan?.rating || 0}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {product.artisan?.shopAddress && (
                    <div className="flex items-center space-x-2 mb-4">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {product.artisan.shopAddress.split(',').slice(-2).join(',')}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{product.price?.toLocaleString()}</span>
                    <button className="flex items-center px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProduct.name}</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <img
                    src={selectedProduct.images?.[0]}
                    alt={selectedProduct.name}
                    className="w-full aspect-square object-cover rounded-lg cursor-zoom-in hover:opacity-90 transition-opacity"
                    onClick={() => setZoomedImage(selectedProduct.images?.[0])}
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ₹{selectedProduct.price?.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  {selectedProduct.category && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Category:</span>
                      <span className="text-sm font-medium text-orange-600">{selectedProduct.category}</span>
                    </div>
                  )}

                  {selectedProduct.materials && selectedProduct.materials.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Materials:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedProduct.materials.join(', ')}</span>
                    </div>
                  )}

                  {/* Artisan Details */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Artisan Details</h3>
                    {artisan ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                            <span className="text-orange-600 font-semibold">
                              {artisan.ownerName
                                ? artisan.ownerName.split(' ').map((n: string) => n[0]).join('')
                                : 'A'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{artisan.shopName || 'Artisan Shop'}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">by {artisan.ownerName || 'Artisan'}</p>
                          </div>
                        </div>

                        {artisan.shopAddress && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{artisan.shopAddress}</span>
                          </div>
                        )}

                        <div className="flex items-center space-x-4">
                          {artisan.mobileNumber && (
                            <a
                              href={`tel:${artisan.mobileNumber}`}
                              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Artisan information not available</p>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <button className="flex-1 bg-orange-600 text-white font-semibold py-3 rounded-lg hover:bg-orange-700 transition-colors">
                      Add to Cart
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavourite(selectedProduct.id);
                      }}
                      className="px-6 py-3 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
          onMouseLeave={() => setZoomedImage(null)}
        >
          <img
            src={zoomedImage}
            alt="Zoomed"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default Favourites;
