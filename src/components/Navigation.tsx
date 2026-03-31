import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Palette, Moon, Sun, LogOut, User, Store, Settings, Menu, X, Heart, FileText, ShoppingCart, Package } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
            <Palette className="h-8 w-8 text-orange-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">CraftAI</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-colors"
            >
              Home
            </Link>
            
            {user ? (
              <>
                {user.role === 'client' ? (
                  <>
                    <Link
                      to="/marketplace"
                      className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-colors"
                    >
                      Marketplace
                    </Link>
                    <Link
                      to="/favourites"
                      className="flex items-center text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      Favourites
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-colors"
                    >
                      <Package className="h-4 w-4 mr-1" />
                      My Orders
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/artisan-dashboard"
                      className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/upload"
                      className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-colors"
                    >
                      Upload Product
                    </Link>
                    <Link
                      to="/marketing"
                      className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-colors"
                    >
                      Marketing
                    </Link>
                    <Link
                      to="/saved-content"
                      className="flex items-center text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-colors"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Saved Content
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/marketplace"
                  className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-colors"
                >
                  Marketplace
                </Link>
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Register
                </Link>
              </>
            )}

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors mr-2"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-orange-600 rounded-full">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User Menu */}
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                    {user.role === 'client' ? (
                      <User className="h-4 w-4 text-orange-600" />
                    ) : (
                      <Store className="h-4 w-4 text-orange-600" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.role === 'client'
                      ? (user as any).fullName
                      : (user as any).ownerName
                    }
                  </span>
                </div>
                <Link
                  to="/profile"
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  aria-label="Profile Settings"
                >
                  <Settings className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
            >
              Home
            </Link>

            {user ? (
              <>
                {user.role === 'client' ? (
                  <>
                    <Link
                      to="/marketplace"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                    >
                      Marketplace
                    </Link>
                    <Link
                      to="/favourites"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                    >
                      <Heart className="h-4 w-4 mr-2 text-red-500" />
                      Favourites
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      My Orders
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/artisan-dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/upload"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                    >
                      Upload Product
                    </Link>
                    <Link
                      to="/marketing"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                    >
                      Marketing
                    </Link>
                    <Link
                      to="/saved-content"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Saved Content
                    </Link>
                  </>
                )}

                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                <div className="flex items-center px-3 py-2">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mr-3">
                    {user.role === 'client' ? (
                      <User className="h-4 w-4 text-orange-600" />
                    ) : (
                      <Store className="h-4 w-4 text-orange-600" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.role === 'client'
                      ? (user as any).fullName
                      : (user as any).ownerName
                    }
                  </span>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Profile Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/marketplace"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                >
                  Marketplace
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg bg-orange-600 text-white text-center font-medium mt-2"
                >
                  Register
                </Link>
              </>
            )}

            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
            >
              <ShoppingCart className="h-5 w-5 mr-3" />
              Cart
              {getCartCount() > 0 && (
                <span className="ml-auto bg-orange-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {getCartCount()}
                </span>
              )}
            </Link>

            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            <button
              onClick={toggleTheme}
              className="flex items-center w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-5 w-5 mr-3" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5 mr-3" />
                  Dark Mode
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
