export interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  location: {
    city: string;
    country: string;
  };
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  description: string;
  listedDate: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface FilterState {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  location: string;
}

export interface UserLocation {
  city: string;
  country: string;
}
