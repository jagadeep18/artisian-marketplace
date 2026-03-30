import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Client, Artisan, AuthState } from '../types';
import { apiService } from '../services/apiService';

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

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const currentUser = await apiService.getCurrentUser();
            if (currentUser) {
              localStorage.setItem('user', JSON.stringify(currentUser));
              setAuthState({ user: currentUser, loading: false, error: null });
              return;
            }
          } catch (error) {
            // Server might be down - fall back to cached user
            const cachedUser = localStorage.getItem('user');
            if (cachedUser) {
              setAuthState({ user: JSON.parse(cachedUser), loading: false, error: null });
              return;
            }
          }
        }
        setAuthState({ user: null, loading: false, error: null });
      } catch (error) {
        setAuthState({ user: null, loading: false, error: null });
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiService.login(email, password);
      
      if (data.user && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setAuthState({ user: data.user, loading: false, error: null });
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Login failed';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMsg
      }));
      throw err;
    }
  };

  const register = async (userData: any, role: 'client' | 'artisan'): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiService.register(userData.email, userData.password, {
        role,
        fullName: userData.fullName,
        mobileNumber: userData.mobileNumber,
        shopName: userData.shopName,
        ownerName: userData.ownerName,
        shopAddress: userData.shopAddress,
        pinCode: userData.pinCode,
        revenue: userData.revenue,
      });

      if (data.user && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setAuthState({ user: data.user, loading: false, error: null });
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Registration failed';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMsg 
      }));
      throw err;
    }
  };

  const logout = async () => {
    try {
      apiService.logout();
      localStorage.removeItem('user');
      setAuthState({ user: null, loading: false, error: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (userData: any): Promise<void> => {
    if (!authState.user) throw new Error('No user logged in');
    
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const updatedUser = await apiService.updateProfile(userData);
      
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setAuthState({ user: updatedUser, loading: false, error: null });
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Update failed';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMsg 
      }));
      throw err;
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