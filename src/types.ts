export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: 'apartment' | 'house' | 'land' | 'commercial';
  listingType: 'rent' | 'sale';
  images: string[];
  features: string[];
  rooms?: number;
  bathrooms?: number;
  area?: number;
  userId: string;
  featured: boolean;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  userType: 'buyer' | 'seller' | 'renter' | 'landlord';
  isPremium: boolean;
  premiumUntil?: Date;
  properties: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}