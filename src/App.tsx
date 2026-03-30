import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import ArtisanDashboard from './pages/ArtisanDashboard';
import ProductUpload from './pages/ProductUpload';
import MarketingTools from './pages/MarketingTools';

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navigation />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to={user.role === 'artisan' ? '/dashboard' : '/marketplace'} /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to={user.role === 'artisan' ? '/dashboard' : '/marketplace'} /> : <Register />} 
        />
        <Route 
          path="/marketplace" 
          element={
            <Marketplace />
          } 
        />
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
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;