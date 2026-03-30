import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Heart, ShoppingBag, Phone, Mail } from 'lucide-react';
import { Product, ProductFilters, Artisan } from '../types';

const Marketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Mock data - In real app, this would come from your backend
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Traditional Rajasthani Block Print Saree',
      description: 'Exquisite handwoven saree featuring traditional Rajasthani motifs, crafted with natural dyes and time-honored techniques.',
      price: 4500,
      images: ['https://images.pexels.com/photos/8148577/pexels-photo-8148577.jpeg?auto=compress&cs=tinysrgb&w=800'],
      artisanId: '2',
      artisan: {
        id: '2',
        email: 'artisan@example.com',
        role: 'artisan',
        shopName: 'Traditional Crafts',
        ownerName: 'Priya Sharma',
        mobileNumber: '+91 9876543211',
        shopAddress: '123 Craft Street, Jaipur, Rajasthan',
        pinCode: '302001',
        verified: true,
        rating: 4.8,
        totalReviews: 156,
        createdAt: new Date(),
      },
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
      description: 'Beautiful table runner with intricate geometric patterns, perfect for adding traditional charm to your dining space.',
      price: 1200,
      images: ['https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=800'],
      artisanId: '2',
      artisan: {
        id: '2',
        email: 'artisan@example.com',
        role: 'artisan',
        shopName: 'Traditional Crafts',
        ownerName: 'Priya Sharma',
        mobileNumber: '+91 9876543211',
        shopAddress: '123 Craft Street, Jaipur, Rajasthan',
        pinCode: '302001',
        verified: true,
        rating: 4.8,
        totalReviews: 156,
        createdAt: new Date(),
      },
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
    {
      id: '3',
      name: 'Handmade Pottery Vase',
      description: 'Elegant terracotta vase with traditional Bengali designs, perfect for displaying flowers or as a decorative piece.',
      price: 1800,
      images: ['https://images.pexels.com/photos/1124725/pexels-photo-1124725.jpeg?auto=compress&cs=tinysrgb&w=800'],
      artisanId: '3',
      artisan: {
        id: '3',
        email: 'potter@example.com',
        role: 'artisan',
        shopName: 'Bengal Pottery',
        ownerName: 'Ravi Das',
        mobileNumber: '+91 9876543212',
        shopAddress: '456 Potter Lane, Kolkata, West Bengal',
        pinCode: '700001',
        verified: true,
        rating: 4.6,
        totalReviews: 89,
        createdAt: new Date(),
      },
      category: 'Pottery',
      materials: ['Clay', 'Natural Glazes'],
      inStock: true,
      featured: true,
      createdAt: new Date(),
      aiGenerated: {
        title: false,
        description: true,
        story: true,
        marketing: false,
      },
    },
  ];

  useEffect(() => {
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  useEffect(() => {
    let filtered = products;

    if (filters.search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search!.toLowerCase()) ||
        product.category.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(product => product.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.price <= filters.maxPrice!);
    }

    if (filters.location) {
      filtered = filtered.filter(product =>
        product.artisan?.shopAddress.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  const categories = ['All', 'Textiles', 'Pottery', 'Home Decor', 'Jewelry', 'Woodwork'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Artisan Marketplace</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Discover authentic handcrafted products from local artisans
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 lg:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products, artisans, or categories..."
                  value={filters.search || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={category === 'All' ? '' : category}
                        checked={category === 'All' ? !filters.category : filters.category === category}
                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value || undefined }))}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Price Range</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Min Price (₹)</label>
                    <input
                      type="number"
                      value={filters.minPrice || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value ? Number(e.target.value) : undefined }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Max Price (₹)</label>
                    <input
                      type="number"
                      value={filters.maxPrice || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value ? Number(e.target.value) : undefined }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="10000"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Location</h3>
                <input
                  type="text"
                  value={filters.location || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter city or state"
                />
              </div>

              <button
                onClick={() => setFilters({})}
                className="w-full px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Showing {filteredProducts.length} of {products.length} products
              </p>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
                <option>Rating: High to Low</option>
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
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
                      <button className="absolute top-3 right-3 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Heart className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-orange-600 font-medium">{product.category}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{product.artisan?.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center space-x-2 mb-4">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {product.artisan?.shopAddress.split(',').slice(-2).join(',')}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{product.price.toLocaleString()}</span>
                        </div>
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
        </div>
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
                  ✕
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ₹{selectedProduct.price.toLocaleString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Artisan Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-semibold">
                            {selectedProduct.artisan?.ownerName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{selectedProduct.artisan?.shopName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">by {selectedProduct.artisan?.ownerName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{selectedProduct.artisan?.shopAddress}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <a
                          href={`tel:${selectedProduct.artisan?.mobileNumber}`}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </a>
                        <a
                          href={`mailto:${selectedProduct.artisan?.email}`}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button className="flex-1 bg-orange-600 text-white font-semibold py-3 rounded-lg hover:bg-orange-700 transition-colors">
                      Add to Cart
                    </button>
                    <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;