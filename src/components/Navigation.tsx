import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Palette, Moon, Sun, LogOut, User, Store } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Palette className="h-8 w-8 text-orange-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">CraftAI</span>
          </Link>

          {/* Navigation Links */}
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
                  <Link
                    to="/marketplace"
                    className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-colors"
                  >
                    Marketplace
                  </Link>
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
            <button className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;