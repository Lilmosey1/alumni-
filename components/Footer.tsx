import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, Twitter, Instagram, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Globe className="h-6 w-6 text-secondary" />
            <span className="text-xl font-bold text-white">Alumni</span>
          </div>
          <p className="text-sm leading-relaxed">
            Connect globally, trade locally. The trusted marketplace for quality secondhand goods. Sustainable shopping starts here.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Marketplace</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/items" className="hover:text-secondary transition-colors">New Arrivals</Link></li>
            <li><Link to="/items" className="hover:text-secondary transition-colors">Trending</Link></li>
            <li><Link to="/items" className="hover:text-secondary transition-colors">Categories</Link></li>
            <li><Link to="/advertise" className="hover:text-secondary transition-colors">Sell an Item</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/track-order" className="hover:text-secondary transition-colors">Track My Order</Link></li>
            <li><a href="#" className="hover:text-secondary transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-secondary transition-colors">Safety Guidelines</a></li>
            <li><Link to="/contact" className="hover:text-secondary transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Stay Connected</h4>
          <div className="flex space-x-4 mb-4">
            <a href="#" className="hover:text-secondary transition-colors"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="hover:text-secondary transition-colors"><Instagram className="h-5 w-5" /></a>
            <a href="#" className="hover:text-secondary transition-colors"><Facebook className="h-5 w-5" /></a>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-4 w-4" />
            <span>stevekondejnr@gmail.com</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
        &copy; {new Date().getFullYear()} Alumni Marketplace Inc. All rights reserved.
      </div>
    </footer>
  );
};