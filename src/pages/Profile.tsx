import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Settings, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile: authUpdateProfile } = useAuth();

  const [formData, setFormData] = useState({
    email: user?.email || '',
    fullName: user?.fullName || '',
    ownerName: user?.ownerName || '',
    shopName: user?.shopName || '',
    mobileNumber: user?.mobileNumber || '',
    shopAddress: user?.shopAddress || '',
    pinCode: user?.pinCode || '',
    revenue: user?.revenue || 0,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isArtisan = user?.role === 'artisan';

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        fullName: user.fullName || '',
        ownerName: user.ownerName || '',
        shopName: user.shopName || '',
        mobileNumber: user.mobileNumber || '',
        shopAddress: user.shopAddress || '',
        pinCode: user.pinCode || '',
        revenue: user.revenue || 0,
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        setErrorMsg("Please enter your current password to set a new one");
        setIsUpdating(false);
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setErrorMsg("Passwords do not match");
        setIsUpdating(false);
        return;
      }
      if (formData.newPassword.length < 6) {
        setErrorMsg("New password must be at least 6 characters");
        setIsUpdating(false);
        return;
      }
    }

    try {
      const updates: any = {};
      if (formData.email) updates.email = formData.email;
      if (formData.fullName) updates.fullName = formData.fullName;
      if (formData.mobileNumber) updates.mobileNumber = formData.mobileNumber;
      if (formData.pinCode) updates.pinCode = formData.pinCode;

      if (isArtisan) {
        if (formData.shopName) updates.shopName = formData.shopName;
        if (formData.ownerName) updates.ownerName = formData.ownerName;
        if (formData.shopAddress) updates.shopAddress = formData.shopAddress;
        if (formData.revenue !== undefined) updates.revenue = Number(formData.revenue);
      }

      if (formData.newPassword) {
        updates.currentPassword = formData.currentPassword;
        updates.password = formData.newPassword;
      }

      await authUpdateProfile(updates);
      setSuccessMsg("Profile updated successfully!");
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));

    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center space-x-3 mb-8 border-b dark:border-gray-700 pb-4">
          <Settings className="h-8 w-8 text-orange-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center text-red-700 dark:text-red-400">
            <AlertCircle className="h-5 w-5 mr-2" />
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <User className="h-5 w-5 mr-2 text-gray-500" />
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-orange-500" />
              </div>

              {!isArtisan && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-orange-500" />
                </div>
              )}

              {isArtisan && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Owner Name</label>
                    <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shop Name</label>
                    <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-orange-500" />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Number</label>
                <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-orange-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PIN Code</label>
                <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-orange-500" />
              </div>

              {isArtisan && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Revenue (₹)</label>
                    <input type="number" name="revenue" value={formData.revenue} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shop Address</label>
                    <input type="text" name="shopAddress" value={formData.shopAddress} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-orange-500" />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-6 mt-6 border-t dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Lock className="h-5 w-5 mr-2 text-gray-500" />
              Change Password
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Leave blank if you don't want to change your password.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-orange-500" placeholder="Enter current password to change it" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition-all shadow-md"
            >
              {isUpdating ? 'Saving...' : 'Save Profile Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
