import React, { useState } from 'react';
import { Upload, CheckCircle, MapPin, DollarSign, Tag, Lock, LogIn } from 'lucide-react';
import { CATEGORIES, LOCATION_DATA } from '../constants';
import { useAuth } from '../contexts/AuthContext.tsx';

interface AdvertiseProps {
  onProductCreated: () => void;
}

export const Advertise: React.FC<AdvertiseProps> = ({ onProductCreated }) => {
  const { user, loginWithGoogle, getAuthToken } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    price: '',
    continent: 'Africa',
    country: 'Kenya',
    city: 'Nairobi',
    condition: 'Good',
    description: '',
    contactEmail: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Derive countries based on selected continent
  const availableCountries = formData.continent ? Object.keys(LOCATION_DATA[formData.continent] || {}) : [];
  
  // Derive cities based on selected country
  const availableCities = (formData.continent && formData.country) 
    ? LOCATION_DATA[formData.continent][formData.country] || []
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg("You must be signed in to publish listings.");
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error("Unable to retrieve authorization token.");
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          price: parseFloat(formData.price),
          city: formData.city,
          country: formData.country,
          condition: formData.condition,
          description: formData.description,
          image: "https://picsum.photos/400/300?random=" + Math.floor(Math.random() * 50)
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to publish item listing");
      }

      setSubmitted(true);
      onProductCreated();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong. Please check back later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[75vh] bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-100">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-3">Authentication Required</h2>
          <p className="text-slate-500 mb-6 leading-relaxed">
            Listed advertisements are linked securely to your Alumni verified profile. Sign in to start selling!
          </p>
          <button 
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-secondary hover:bg-teal-300 text-primary font-bold rounded-xl shadow-md transition-all active:scale-95"
          >
            <LogIn className="h-5 w-5" />
            <span>Sign In with Google</span>
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Listing Published!</h2>
          <p className="text-slate-600 mb-6">
            Your item "{formData.title}" has been listed on the global Alumni marketplace successfully.
          </p>
          <button 
            onClick={() => {
              setSubmitted(false);
              setFormData({ 
                title: '', 
                category: 'Electronics',
                price: '', 
                continent: 'Africa',
                country: 'Kenya',
                city: 'Nairobi',
                condition: 'Good',
                description: '', 
                contactEmail: '' 
              });
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
            {errorMsg && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">
                {errorMsg}
              </div>
            )}
            
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
                    min="1"
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
                  <span className="text-sm font-medium">Automatic placeholder uploaded</span>
                  <span className="text-xs text-slate-400 mt-1">Images are automatically optimized and verified.</span>
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
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-primary text-white text-lg font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:bg-slate-400 disabled:scale-100"
              >
                {submitting ? "Publishing listing details..." : "Publish Listing"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};
