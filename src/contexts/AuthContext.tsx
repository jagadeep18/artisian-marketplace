import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Client, Artisan, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any, role: 'client' | 'artisan') => Promise<void>;
  logout: () => void;
  updateProfile: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({ user, loading: false, error: null });
      } catch (error) {
        localStorage.removeItem('user');
        setAuthState({ user: null, loading: false, error: null });
      }
    } else {
      setAuthState({ user: null, loading: false, error: null });
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulate API call - In real app, this would be a backend call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - In real app, this would come from your backend
      const mockUsers = [
        {
          id: '1',
          email: 'client@example.com',
          role: 'client' as const,
          fullName: 'John Doe',
          mobileNumber: '+91 9876543210',
          createdAt: new Date(),
        },
        {
          id: '2',
          email: 'artisan@example.com',
          role: 'artisan' as const,
          shopName: 'Traditional Crafts',
          ownerName: 'Priya Sharma',
          mobileNumber: '+91 9876543211',
          shopAddress: '123 Craft Street, Jaipur',
          pinCode: '302001',
          verified: true,
          rating: 4.8,
          totalReviews: 156,
          createdAt: new Date(),
        }
      ];

      const user = mockUsers.find(u => u.email === email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      localStorage.setItem('user', JSON.stringify(user));
      setAuthState({ user, loading: false, error: null });
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      }));
      throw error;
    }
  };

  const register = async (userData: any, role: 'client' | 'artisan'): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        role,
        createdAt: new Date(),
        ...userData,
      };

      if (role === 'artisan') {
        (newUser as any).revenue = parseInt(userData.revenue) || 0;
      }

      localStorage.setItem('user', JSON.stringify(newUser));
      setAuthState({ user: newUser, loading: false, error: null });
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({ user: null, loading: false, error: null });
  };

  const updateProfile = async (userData: any): Promise<void> => {
    if (!authState.user) throw new Error('No user logged in');
    
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...authState.user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setAuthState({ user: updatedUser, loading: false, error: null });
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Update failed' 
      }));
      throw error;
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};