import React, { useState } from 'react';
import { Upload, CheckCircle, MapPin, DollarSign, Tag } from 'lucide-react';
import { CATEGORIES, LOCATION_DATA } from '../constants';

export const Advertise: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    price: '',
    continent: '',
    country: '',
    city: '',
    condition: 'excellent',
    description: '',
    contactEmail: ''
  });

  const [submitted, setSubmitted] = useState(false);

  // Derive countries based on selected continent
  const availableCountries = formData.continent ? Object.keys(LOCATION_DATA[formData.continent] || {}) : [];
  
  // Derive cities based on selected country
  const availableCities = (formData.continent && formData.country) 
    ? LOCATION_DATA[formData.continent][formData.country] || []
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to a backend
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Listing Submitted!</h2>
          <p className="text-slate-600 mb-6">
            Your item "{formData.title}" has been submitted for review. It will appear on the marketplace shortly.
          </p>
          <button 
            onClick={() => {
              setSubmitted(false);
              setFormData({ ...formData, title: '', price: '', description: '', city: '' });
            }}
            className="w-full py-3 bg-secondary text-primary font-bold rounded-lg hover:bg-teal-300 transition-colors"
          >
            List Another Item
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary mb-4">Advertise Your Goods</h1>
          <p className="text-slate-500">
            Reach thousands of buyers globally or in your local neighborhood. 
            List your items on Alumni today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-8 space-y-8">
            
            {/* Basic Info */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-primary border-b border-slate-100 pb-2">Item Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Item Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Vintage Sony Walkman"
                  className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4" /> Category
                  </label>
                  <select 
                    className="w-full border border-slate-200 rounded-lg p-3 bg-white focus:ring-2 focus:ring-secondary outline-none"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" /> Price (USD)
                  </label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    placeholder="0.00"
                    className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-secondary outline-none"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Condition</label>
                <div className="flex gap-4">
                  {['New', 'Like New', 'Good', 'Fair'].map(cond => (
                    <label key={cond} className="flex items-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="condition" 
                        value={cond}
                        checked={formData.condition === cond}
                        onChange={e => setFormData({...formData, condition: e.target.value})}
                        className="mr-2 text-secondary focus:ring-secondary"
                      />
                      <span className="text-sm text-slate-700">{cond}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-primary border-b border-slate-100 pb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Location
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Continent</label>
                  <select 
                    required
                    className="w-full border border-slate-200 rounded-lg p-3 bg-white focus:ring-2 focus:ring-secondary outline-none"
                    value={formData.continent}
                    onChange={e => setFormData({...formData, continent: e.target.value, country: '', city: ''})}
                  >
                    <option value="">Select Continent</option>
                    {Object.keys(LOCATION_DATA).map(cont => (
                      <option key={cont} value={cont}>{cont}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                  <select 
                    required
                    disabled={!formData.continent}
                    className="w-full border border-slate-200 rounded-lg p-3 bg-white focus:ring-2 focus:ring-secondary outline-none disabled:bg-slate-100 disabled:text-slate-400"
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value, city: ''})}
                  >
                    <option value="">Select Country</option>
                    {availableCountries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {formData.country === 'Kenya' ? 'County / City' : 'City'}
                  </label>
                  {availableCities.length > 0 ? (
                    <select 
                      required
                      disabled={!formData.country}
                      className="w-full border border-slate-200 rounded-lg p-3 bg-white focus:ring-2 focus:ring-secondary outline-none disabled:bg-slate-100 disabled:text-slate-400"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                    >
                       <option value="">Select Location</option>
                       {availableCities.map(city => (
                         <option key={city} value={city}>{city}</option>
                       ))}
                    </select>
                  ) : (
                    <input 
                      type="text" 
                      required
                      disabled={!formData.country}
                      placeholder="Enter City"
                      className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-secondary outline-none disabled:bg-slate-100"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Description & Media */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-primary border-b border-slate-100 pb-2">Description & Contact</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Describe your item..."
                  className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-secondary outline-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

               <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Photos</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mb-2" />
                  <span className="text-sm">Click to upload or drag and drop</span>
                  <span className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</span>
                </div>
              </div>

               <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email (Hidden from public)</label>
                <input 
                  type="email" 
                  required
                  placeholder="your@email.com"
                  className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-secondary outline-none"
                  value={formData.contactEmail}
                  onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full bg-primary text-white text-lg font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
                Publish Listing
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};