import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, ShieldCheck, Globe2, Leaf } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface HomeProps {
  featuredProducts: Product[];
  onViewDetails: (product: Product) => void;
}

export const Home: React.FC<HomeProps> = ({ featuredProducts, onViewDetails }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/items?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Find Your Next Treasure,<br className="hidden md:block" />
            <span className="text-secondary">Globally or Locally.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300 mb-10">
            Join the world's most trusted community for buying and selling quality secondhand goods. From vintage finds to modern essentials.
          </p>

          <form onSubmit={handleSearch} className="max-w-md mx-auto relative mb-12">
            <input
              type="text"
              placeholder="What are you looking for today?"
              className="w-full py-4 pl-6 pr-14 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-secondary/50 shadow-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-2 p-2 bg-primary rounded-full hover:bg-slate-800 transition-colors">
              <Search className="h-6 w-6 text-white" />
            </button>
          </form>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/items" className="px-8 py-3 bg-secondary text-primary font-bold rounded-lg hover:bg-teal-300 transition-colors shadow-lg shadow-teal-500/20">
              Start Shopping
            </Link>
            <Link to="/advertise" className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors">
              List an Item
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="p-3 bg-blue-50 rounded-full mb-4">
                <Globe2 className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Borderless Shopping</h3>
              <p className="text-slate-600">Access inventory from Paris to Tokyo. We handle the logistics.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="p-3 bg-green-50 rounded-full mb-4">
                <ShieldCheck className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Verified Trust</h3>
              <p className="text-slate-600">Every listing is screened. Buyer protection on every order.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="p-3 bg-teal-50 rounded-full mb-4">
                <Leaf className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Sustainable Choice</h3>
              <p className="text-slate-600">Give items a second life and reduce your carbon footprint.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">New Arrivals</h2>
              <p className="text-slate-500">Fresh listings from around the globe</p>
            </div>
            <Link to="/items" className="flex items-center text-secondary hover:text-teal-600 font-semibold group">
              View All <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.slice(0, 3).map(product => (
              <ProductCard key={product.id} product={product} onViewDetails={onViewDetails} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};