import { Product } from './types';

export const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Collectibles', 'Sports', 'Vehicles'];

export const LOCATION_DATA: Record<string, Record<string, string[]>> = {
  "Africa": {
    "Kenya": [
      "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Kiambu", 
      "Machakos", "Nyeri", "Meru", "Kilifi", "Kajiado", "Kericho", 
      "Kakamega", "Kisii", "Kitui", "Uasin Gishu", "Laikipia"
    ],
    "South Africa": ["Cape Town", "Johannesburg", "Durban", "Pretoria"],
    "Nigeria": ["Lagos", "Abuja", "Kano"],
    "Egypt": ["Cairo", "Alexandria", "Giza"]
  },
  "Europe": {
    "France": ["Paris", "Lyon", "Marseille"],
    "UK": ["London", "Manchester", "Edinburgh"],
    "Italy": ["Rome", "Milan", "Florence"],
    "Denmark": ["Copenhagen", "Aarhus"],
    "Germany": ["Berlin", "Munich", "Hamburg"]
  },
  "Asia": {
    "Japan": ["Tokyo", "Osaka", "Kyoto"],
    "China": ["Shanghai", "Beijing", "Shenzhen"],
    "India": ["Mumbai", "Delhi", "Bangalore"]
  },
  "North America": {
    "USA": ["New York", "San Francisco", "Los Angeles", "Chicago", "Miami"],
    "Canada": ["Toronto", "Vancouver", "Montreal"]
  },
  "Australia": {
    "Australia": ["Sydney", "Melbourne", "Gold Coast", "Brisbane"]
  }
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Vintage Leica M3 Camera',
    price: 2400,
    currency: 'USD',
    image: 'https://picsum.photos/400/300?random=1',
    category: 'Electronics',
    location: { city: 'Tokyo', country: 'Japan' },
    condition: 'Good',
    description: 'A classic rangefinder camera from the 1950s. Fully functional mechanics, slight wear on the leatherette.',
    listedDate: '2023-10-15'
  },
  {
    id: '2',
    title: 'Mid-Century Modern Chair',
    price: 450,
    currency: 'USD',
    image: 'https://picsum.photos/400/300?random=2',
    category: 'Home & Living',
    location: { city: 'Copenhagen', country: 'Denmark' },
    condition: 'Like New',
    description: 'Original teak wood chair with new wool upholstery. Perfect for any modern living room.',
    listedDate: '2023-10-20'
  },
  {
    id: '3',
    title: 'Handcrafted Leather Satchel',
    price: 180,
    currency: 'USD',
    image: 'https://picsum.photos/400/300?random=3',
    category: 'Fashion',
    location: { city: 'Florence', country: 'Italy' },
    condition: 'New',
    description: 'Artisan made vegetable-tanned leather bag. Smell the quality.',
    listedDate: '2023-10-22'
  },
  {
    id: '4',
    title: 'First Edition Sci-Fi Novel',
    price: 120,
    currency: 'USD',
    image: 'https://picsum.photos/400/300?random=4',
    category: 'Collectibles',
    location: { city: 'London', country: 'UK' },
    condition: 'Fair',
    description: 'Rare first edition print. Dust jacket has some tears, but pages are clean.',
    listedDate: '2023-10-10'
  },
  {
    id: '5',
    title: 'Pro Surfboard 6ft',
    price: 300,
    currency: 'USD',
    image: 'https://picsum.photos/400/300?random=5',
    category: 'Sports',
    location: { city: 'Gold Coast', country: 'Australia' },
    condition: 'Good',
    description: 'High performance shortboard. Minor pressure dings on the deck.',
    listedDate: '2023-10-25'
  },
  {
    id: '6',
    title: 'Ceramic Vase Set',
    price: 85,
    currency: 'USD',
    image: 'https://picsum.photos/400/300?random=6',
    category: 'Home & Living',
    location: { city: 'Cape Town', country: 'South Africa' },
    condition: 'New',
    description: 'Set of 3 hand-thrown ceramic vases with local clay.',
    listedDate: '2023-10-26'
  },
  {
    id: '7',
    title: 'Toyota Land Cruiser Prado',
    price: 35000,
    currency: 'USD',
    image: 'https://picsum.photos/400/300?random=7',
    category: 'Vehicles',
    location: { city: 'Nairobi', country: 'Kenya' },
    condition: 'Good',
    description: 'Well maintained 2018 model. Leather interior, low mileage. Perfect for off-road adventures.',
    listedDate: '2023-10-27'
  },
  {
    id: '8',
    title: 'Maasai Beaded Necklace',
    price: 45,
    currency: 'USD',
    image: 'https://picsum.photos/400/300?random=8',
    category: 'Fashion',
    location: { city: 'Mombasa', country: 'Kenya' },
    condition: 'New',
    description: 'Authentic handmade jewelry. Vibrant colors and traditional patterns.',
    listedDate: '2023-10-28'
  },
  {
    id: '9',
    title: 'Gaming Laptop High Spec',
    price: 1200,
    currency: 'USD',
    image: 'https://picsum.photos/400/300?random=9',
    category: 'Electronics',
    location: { city: 'Kisumu', country: 'Kenya' },
    condition: 'Like New',
    description: 'Latest gen processor, RTX graphics card. Used for 2 months only.',
    listedDate: '2023-10-29'
  }
];