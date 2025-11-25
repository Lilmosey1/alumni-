import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, Globe, PlusCircle, Package } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-secondary' : 'text-gray-300 hover:text-white';

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-secondary" />
            <span className="text-2xl font-bold tracking-tight">Alumni</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`${isActive('/')} font-medium transition-colors`}>Home</Link>
            <Link to="/items" className={`${isActive('/items')} font-medium transition-colors`}>Marketplace</Link>
            <Link to="/advertise" className={`${isActive('/advertise')} font-medium transition-colors`}>Advertise</Link>
            <Link to="/contact" className={`${isActive('/contact')} font-medium transition-colors`}>Contact</Link>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/advertise" className="flex items-center gap-1 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors">
              <PlusCircle className="h-4 w-4 text-secondary" />
              <span>Sell</span>
            </Link>
            
            <Link to="/track-order" className="group" title="Track Order">
              <Package className={`h-5 w-5 transition-colors ${location.pathname === '/track-order' ? 'text-secondary' : 'text-gray-300 group-hover:text-white'}`} />
            </Link>

            <div className="relative group cursor-pointer">
              <Search className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
            </div>
            
            <Link to="/order" className="relative group">
              <ShoppingBag className="h-6 w-6 text-gray-300 group-hover:text-secondary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-700">Home</Link>
            <Link to="/items" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">Marketplace</Link>
            <Link to="/advertise" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">Advertise / Sell</Link>
            <Link to="/track-order" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700 flex items-center gap-2">
              <Package className="h-4 w-4" /> Track Order
            </Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">Contact</Link>
            <Link to="/order" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-secondary hover:text-white hover:bg-slate-700">
              Cart ({cartCount})
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};