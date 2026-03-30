import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Palette, AlertCircle, User, Store } from 'lucide-react';

const Register = () => {
  const [userType, setUserType] = useState<'client' | 'artisan'>('client');
  const [formData, setFormData] = useState({
    // Common fields
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
    
    // Client fields
    fullName: '',
    
    // Artisan fields
    shopName: '',
    ownerName: '',
    shopAddress: '',
    pinCode: '',
    revenue: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const userData = userType === 'client' 
        ? {
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            mobileNumber: formData.mobileNumber,
          }
        : {
            email: formData.email,
            password: formData.password,
            shopName: formData.shopName,
            ownerName: formData.ownerName,
            mobileNumber: formData.mobileNumber,
            shopAddress: formData.shopAddress,
            pinCode: formData.pinCode,
            revenue: formData.revenue ? Number(formData.revenue) : 0,
          };

      await register(userData, userType);
      
      if (userType === 'client') {
        navigate('/marketplace');
      } else {
        navigate('/artisan-dashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
            <Palette className="h-10 w-10 text-orange-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">CraftAI</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create your account</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Join our community of artisans and craft lovers
          </p>
        </div>

        {/* User Type Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">I want to register as:</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="userType"
                value="client"
                checked={userType === 'client'}
                onChange={(e) => setUserType(e.target.value as 'client' | 'artisan')}
                className="sr-only"
              />
              <div className={`p-4 rounded-lg border-2 transition-all ${
                userType === 'client' 
                  ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}>
                <div className="flex items-center space-x-3">
                  <User className={`h-6 w-6 ${userType === 'client' ? 'text-orange-600' : 'text-gray-500 dark:text-gray-400'}`} />
                  <div>
                    <p className={`font-medium ${userType === 'client' ? 'text-orange-900 dark:text-orange-300' : 'text-gray-900 dark:text-white'}`}>
                      Client
                    </p>
                    <p className={`text-sm ${userType === 'client' ? 'text-orange-700 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      Browse and buy crafts
                    </p>
                  </div>
                </div>
              </div>
            </label>

            <label className="cursor-pointer">
              <input
                type="radio"
                name="userType"
                value="artisan"
                checked={userType === 'artisan'}
                onChange={(e) => setUserType(e.target.value as 'client' | 'artisan')}
                className="sr-only"
              />
              <div className={`p-4 rounded-lg border-2 transition-all ${
                userType === 'artisan' 
                  ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}>
                <div className="flex items-center space-x-3">
                  <Store className={`h-6 w-6 ${userType === 'artisan' ? 'text-orange-600' : 'text-gray-500 dark:text-gray-400'}`} />
                  <div>
                    <p className={`font-medium ${userType === 'artisan' ? 'text-orange-900 dark:text-orange-300' : 'text-gray-900 dark:text-white'}`}>
                      Artisan
                    </p>
                    <p className={`text-sm ${userType === 'artisan' ? 'text-orange-700 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      Sell your crafts
                    </p>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Fields */}
            {userType === 'client' && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            {/* Artisan Fields */}
            {userType === 'artisan' && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Shop/Business Name *
                    </label>
                    <input
                      id="shopName"
                      name="shopName"
                      type="text"
                      required
                      value={formData.shopName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter shop name"
                    />
                  </div>
                  <div>
                    <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Owner's Full Name *
                    </label>
                    <input
                      id="ownerName"
                      name="ownerName"
                      type="text"
                      required
                      value={formData.ownerName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter owner name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="shopAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Shop Address *
                  </label>
                  <textarea
                    id="shopAddress"
                    name="shopAddress"
                    required
                    rows={3}
                    value={formData.shopAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter complete shop address"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                  <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    PIN Code *
                  </label>
                  <input
                    id="pinCode"
                    name="pinCode"
                    type="text"
                    required
                    pattern="[0-9]{6}"
                    value={formData.pinCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter 6-digit PIN code"
                  />
                  </div>
                  <div>
                    <label htmlFor="revenue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Monthly Revenue (₹) *
                    </label>
                    <input
                      id="revenue"
                      name="revenue"
                      type="number"
                      required
                      min="0"
                      value={formData.revenue}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter monthly revenue"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Common Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mobile Number *
                </label>
                <input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="tel"
                  required
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 text-white font-semibold py-3 rounded-lg hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </>
              ) : (
                `Create ${userType === 'client' ? 'Client' : 'Artisan'} Account`
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;