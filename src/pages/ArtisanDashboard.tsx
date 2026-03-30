import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, TrendingUp, Users, DollarSign, BarChart3, CreditCard as Edit, Trash2, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Product, Artisan } from '../types';

const ArtisanDashboard = () => {
  const { user } = useAuth();
  const artisan = user as Artisan;
  const [products, setProducts] = useState<Product[]>([]);

  // Mock products data - In real app, this would come from your backend
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Traditional Rajasthani Block Print Saree',
        description: 'Exquisite handwoven saree featuring traditional Rajasthani motifs',
        price: 4500,
        images: ['https://images.pexels.com/photos/8148577/pexels-photo-8148577.jpeg?auto=compress&cs=tinysrgb&w=400'],
        artisanId: artisan?.id || '',
        category: 'Textiles',
        materials: ['Cotton', 'Natural Dyes'],
        inStock: true,
        featured: true,
        createdAt: new Date(),
        aiGenerated: {
          title: true,
          description: true,
          story: true,
          marketing: true,
        },
      },
      {
        id: '2',
        name: 'Handwoven Cotton Table Runner',
        description: 'Beautiful table runner with intricate geometric patterns',
        price: 1200,
        images: ['https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=400'],
        artisanId: artisan?.id || '',
        category: 'Home Decor',
        materials: ['Cotton'],
        inStock: true,
        featured: false,
        createdAt: new Date(),
        aiGenerated: {
          title: true,
          description: true,
          story: false,
          marketing: true,
        },
      },
    ];
    setProducts(mockProducts);
  }, [artisan?.id]);

  const stats = [
    { label: 'Total Products', value: products.length, icon: BarChart3, color: 'blue' },
    { label: 'Product Views', value: '2,847', icon: Eye, color: 'green' },
    { label: 'Monthly Revenue (₹)', value: artisan?.revenue?.toLocaleString() || '0', icon: DollarSign, color: 'orange' }
  ];

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  if (!artisan) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {artisan.ownerName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {artisan.ownerName}!</h1>
              <p className="text-gray-600 dark:text-gray-400">{artisan.shopName} • {artisan.shopAddress.split(',').slice(-2).join(',')}</p>
              <div className="flex items-center space-x-2 mt-1">
                {artisan.verified && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                    Verified
                  </span>
                )}
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Rating: {artisan.rating}/5 ({artisan.totalReviews} reviews)
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Link
              to="/upload"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Link>
            <Link
              to="/marketing"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Marketing Tools
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
            green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
            purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
            orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
          };
          
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Products Management */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Products</h2>
          <Link
            to="/upload"
            className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add New Product
          </Link>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Start by adding your first product to showcase your crafts</p>
            <Link
              to="/upload"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.featured && (
                    <div className="absolute top-3 left-3 bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.inStock 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                        : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    {Object.values(product.aiGenerated).some(Boolean) && (
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-full flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Enhanced
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">₹{product.price.toLocaleString()}</span>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Eye className="h-4 w-4 mr-1" />
                      245 views
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanDashboard;