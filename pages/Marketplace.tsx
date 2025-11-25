import React, { useState } from 'react';
import { Product, FilterState } from '../types';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES, LOCATION_DATA } from '../constants';
import { Filter, X, MapPin, Tag, Search, Globe2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface MarketplaceProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
}

interface ExtendedFilterState extends FilterState {
  continent: string;
  country: string;
  city: string;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ products, onViewDetails }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';

  const [filters, setFilters] = useState<ExtendedFilterState>({
    search: initialSearch,
    category: 'All',
    minPrice: 0,
    maxPrice: 50000,
    location: '', // Legacy simple location string, not used in favor of structured below
    continent: '',
    country: '',
    city: ''
  });

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Derived available options based on selection
  const availableCountries = filters.continent ? Object.keys(LOCATION_DATA[filters.continent] || {}) : [];
  const availableCities = (filters.continent && filters.country) 
    ? LOCATION_DATA[filters.continent][filters.country] || [] 
    : [];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                          product.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === 'All' || product.category === filters.category;
    const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
    
    // Improved Location Logic
    let matchesLocation = true;
    if (filters.country) {
       matchesLocation = product.location.country === filters.country;
       if (matchesLocation && filters.city) {
         matchesLocation = product.location.city === filters.city;
       }
    } else if (filters.continent) {
       // If only continent is selected, check if country is in that continent's list
       const countriesInContinent = Object.keys(LOCATION_DATA[filters.continent] || {});
       matchesLocation = countriesInContinent.includes(product.location.country);
    }

    return matchesSearch && matchesCategory && matchesPrice && matchesLocation;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-4">
            <button 
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm text-slate-700 w-full justify-center"
            >
              <Filter className="h-4 w-4" /> Filters
            </button>
          </div>

          {/* Sidebar Filters */}
          <aside className={`
            fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:bg-transparent md:w-64 md:block md:z-0 p-6 md:p-0 overflow-y-auto md:overflow-visible
            ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="md:hidden flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-primary">Filters</h2>
              <button onClick={() => setIsMobileFiltersOpen(false)}><X className="h-6 w-6 text-slate-500" /></button>
            </div>

            <div className="bg-white md:rounded-xl md:shadow-sm md:p-6 space-y-8 sticky top-24">
              <div>
                <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                   Search
                </h3>
                <input
                  type="text"
                  placeholder="Search item..."
                  className="w-full border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none border"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>

              <div>
                <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Category
                </h3>
                <div className="space-y-2">
                  {CATEGORIES.map(cat => (
                    <label key={cat} className="flex items-center space-x-2 cursor-pointer group">
                      <div className={`
                        w-4 h-4 rounded border flex items-center justify-center transition-colors
                        ${filters.category === cat ? 'bg-secondary border-secondary' : 'border-slate-300 group-hover:border-secondary'}
                      `}>
                        {filters.category === cat && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <input
                        type="radio"
                        name="category"
                        className="hidden"
                        checked={filters.category === cat}
                        onChange={() => setFilters({...filters, category: cat})}
                      />
                      <span className={`text-sm ${filters.category === cat ? 'text-secondary font-medium' : 'text-slate-600'}`}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                   Price Range
                </h3>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-secondary"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>$0</span>
                    <span className="font-medium text-primary">${filters.maxPrice}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                  <Globe2 className="h-4 w-4" /> Location
                </h3>
                
                <div className="space-y-3">
                  <select
                    className="w-full border-slate-200 rounded-lg p-2 text-sm text-slate-600 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none border bg-white"
                    value={filters.continent}
                    onChange={(e) => setFilters({...filters, continent: e.target.value, country: '', city: ''})}
                  >
                    <option value="">All Continents</option>
                    {Object.keys(LOCATION_DATA).map(cont => (
                      <option key={cont} value={cont}>{cont}</option>
                    ))}
                  </select>

                  <select
                    className="w-full border-slate-200 rounded-lg p-2 text-sm text-slate-600 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none border bg-white disabled:bg-slate-100 disabled:text-slate-400"
                    value={filters.country}
                    disabled={!filters.continent}
                    onChange={(e) => setFilters({...filters, country: e.target.value, city: ''})}
                  >
                    <option value="">All Countries</option>
                    {availableCountries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>

                  {/* Show Counties/Cities if Country is Selected (Specifically useful for Kenya) */}
                  {(filters.country && availableCities.length > 0) && (
                     <select
                      className="w-full border-slate-200 rounded-lg p-2 text-sm text-slate-600 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none border bg-white"
                      value={filters.city}
                      onChange={(e) => setFilters({...filters, city: e.target.value})}
                    >
                      <option value="">All Locations ({filters.country === 'Kenya' ? 'Counties' : 'Cities'})</option>
                      {availableCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <button 
                onClick={() => setFilters({search: '', category: 'All', minPrice: 0, maxPrice: 50000, location: '', continent: '', country: '', city: ''})}
                className="w-full py-2 text-sm text-slate-500 hover:text-primary underline"
              >
                Clear all filters
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-primary">Marketplace Listings</h1>
              <span className="text-sm text-slate-500">{filteredProducts.length} items found</span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onViewDetails={onViewDetails} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                <div className="inline-block p-4 bg-slate-50 rounded-full mb-4">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No items found</h3>
                <p className="text-slate-500">Try adjusting your search or filters.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};