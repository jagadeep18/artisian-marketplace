export interface User {
  id: string;
  email: string;
  role: 'client' | 'artisan';
  createdAt: Date;
}

export interface Client extends User {
  role: 'client';
  fullName: string;
  mobileNumber: string;
}

export interface Artisan extends User {
  role: 'artisan';
  shopName: string;
  ownerName: string;
  mobileNumber: string;
  shopAddress: string;
  pinCode: string;
  revenue: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  artisanId: string;
  artisan?: Artisan;
  category: string;
  materials: string[];
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
  aiGenerated: {
    title: boolean;
    description: boolean;
    story: boolean;
    marketing: boolean;
  };
}

export interface MarketingContent {
  platform: string;
  caption: string;
  hashtags: string[];
  cta: string;
  generatedAt: Date;
}

export interface AIGeneratedContent {
  title: string;
  description: string;
  story: string;
  keywords: string[];
  marketing: {
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  search?: string;
}