import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Marketplace } from './pages/Marketplace';
import { ProductDetailsModal } from './pages/ProductDetailsModal';
import { Checkout } from './pages/Checkout';
import { Contact } from './pages/Contact';
import { Advertise } from './pages/Advertise';
import { Tracking } from './pages/Tracking';
import { INITIAL_PRODUCTS } from './constants';
import { Product, CartItem } from './types';

const App: React.FC = () => {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Slight delay to clear product to avoid content jump during animation
    setTimeout(() => setSelectedProduct(null), 200);
  };

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar cartCount={totalCartItems} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home featuredProducts={products} onViewDetails={handleViewDetails} />} />
            <Route path="/items" element={<Marketplace products={products} onViewDetails={handleViewDetails} />} />
            <Route path="/advertise" element={<Advertise />} />
            <Route path="/track-order" element={<Tracking />} />
            <Route path="/order" element={
              <Checkout 
                cart={cart} 
                onRemoveFromCart={handleRemoveFromCart}
                onClearCart={handleClearCart} 
              />
            } />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer />

        <ProductDetailsModal 
          product={selectedProduct} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      </div>
    </HashRouter>
  );
};

export default App;