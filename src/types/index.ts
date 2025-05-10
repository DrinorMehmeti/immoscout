export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: 'apartment' | 'house' | 'land' | 'commercial';
  listing_type: 'rent' | 'sale';
  images?: string[];
  features?: string[];
  rooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  status: 'active' | 'inactive' | 'sold' | 'rented';
  featured?: boolean;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  userType: 'buyer' | 'seller' | 'renter' | 'landlord';
  isPremium: boolean;
  premiumUntil?: Date;
  properties?: string[];
}