export interface User { id: string; name: string; email: string; phone: string; }

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  listingType: 'sale' | 'rent';
  type: 'house' | 'apartment' | 'villa' | 'land' | 'commercial';
  bedrooms: number;
  bathrooms: number;
  area: number;
  city: string;
  address: string;
  images: string[];
  amenities: string[];
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  createdAt: string;
  isFavorite?: boolean;
}
