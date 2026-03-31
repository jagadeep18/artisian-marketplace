import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import ArtisanDashboard from './pages/ArtisanDashboard';
import ProductUpload from './pages/ProductUpload';
import MarketingTools from './pages/MarketingTools';
import Profile from './pages/Profile';
import Favourites from './pages/Favourites';
import SavedContent from './pages/SavedContent';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import ArtisanOrders from './pages/ArtisanOrders';
import FloatingElements from './components/FloatingElements';

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 overflow-hidden font-sans">
      {/* Global Animated Background Elements */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-orange-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob dark:bg-orange-900 dark:opacity-30 dark:mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[-10%] w-[25rem] h-[25rem] bg-amber-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-2000 dark:bg-yellow-800 dark:opacity-30 dark:mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[35rem] h-[35rem] bg-pink-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob animation-delay-4000 dark:bg-fuchsia-900 dark:opacity-20 dark:mix-blend-screen"></div>
      </div>
      
      {/* Floating Sparkles and Artisan Tools */}
      <FloatingElements />
      
      {/* Application Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1 w-full relative z-0">
          <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to={user.role === 'artisan' ? '/artisan-dashboard' : '/marketplace'} /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to={user.role === 'artisan' ? '/artisan-dashboard' : '/marketplace'} /> : <Register />} 
        />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route 
          path="/artisan-dashboard" 
          element={
            <ProtectedRoute requiredRole="artisan">
              <ArtisanDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/upload" 
          element={
            <ProtectedRoute requiredRole="artisan">
              <ProductUpload />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/marketing"
          element={
            <ProtectedRoute requiredRole="artisan">
              <MarketingTools />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <Favourites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-content"
          element={
            <ProtectedRoute requiredRole="artisan">
              <SavedContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artisan/orders"
          element={
            <ProtectedRoute requiredRole="artisan">
              <ArtisanOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route path="/cart" element={<Cart />} />
      </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;