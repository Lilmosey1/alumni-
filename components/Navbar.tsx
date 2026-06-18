import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, Globe, PlusCircle, Package, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';

interface NavbarProps {
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, loginWithGoogle, logout } = useAuth();

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

          {/* Icons & User Auth */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/advertise" className="flex items-center gap-1 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors">
              <PlusCircle className="h-4 w-4 text-secondary" />
              <span>Sell</span>
            </Link>
            
            <Link to="/track-order" className="group" title="Track Order">
              <Package className={`h-5 w-5 transition-colors ${location.pathname === '/track-order' ? 'text-secondary' : 'text-gray-300 group-hover:text-white'}`} />
            </Link>
            
            <Link to="/order" className="relative group">
              <ShoppingBag className="h-6 w-6 text-gray-300 group-hover:text-secondary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'Avatar'} className="h-6 w-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-secondary text-primary font-bold text-xs flex items-center justify-center">
                    {user.displayName ? user.displayName.slice(0, 2).toUpperCase() : <UserIcon className="h-3 w-3" />}
                  </div>
                )}
                <span className="text-xs text-gray-200 hidden lg:inline max-w-[100px] truncate">{user.displayName || user.email}</span>
                <button 
                  onClick={logout} 
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="flex items-center space-x-1.5 bg-secondary hover:bg-teal-300 text-primary px-4 py-1.5 rounded-full font-semibold text-sm transition-all shadow-md active:scale-95"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/order" className="relative group">
              <ShoppingBag className="h-6 w-6 text-gray-300 group-hover:text-secondary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
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
            {user ? (
              <div className="px-3 py-2 pt-4 border-t border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="h-8 w-8 rounded-full border border-teal-400" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-secondary text-primary font-bold flex items-center justify-center text-sm">
                      {user.displayName ? user.displayName.slice(0, 1).toUpperCase() : <UserIcon className="h-4 w-4" />}
                    </div>
                  )}
                  <span className="text-gray-200 text-sm">{user.displayName || user.email}</span>
                </div>
                <button
                  onClick={() => { setIsOpen(false); logout(); }}
                  className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-300 px-2.5 py-1 rounded border border-red-500/30 transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="px-3 py-3 border-t border-slate-700">
                <button
                  onClick={() => { setIsOpen(false); loginWithGoogle(); }}
                  className="w-full flex items-center justify-center gap-2 bg-secondary text-primary py-2 rounded-md font-semibold text-sm shadow transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In with Google</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};