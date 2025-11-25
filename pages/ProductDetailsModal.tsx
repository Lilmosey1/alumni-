import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, MapPin, Truck, ShieldCheck, Sparkles, Loader2, ShoppingCart } from 'lucide-react';
import { getProductInsights } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

// Mock price history data for the chart
const mockHistoryData = [
  { month: 'Jan', price: 95 },
  { month: 'Feb', price: 98 },
  { month: 'Mar', price: 92 },
  { month: 'Apr', price: 100 },
  { month: 'May', price: 96 },
  { month: 'Jun', price: 100 }, // Current (normalized to 100% of current price roughly)
];

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setAiInsight('');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleGenerateInsight = async () => {
    if (!product) return;
    setLoadingAi(true);
    const insight = await getProductInsights(product);
    setAiInsight(insight);
    setLoadingAi(false);
  };

  if (!isOpen || !product) return null;

  // Adjust chart data relative to current price for demo visual
  const chartData = mockHistoryData.map(d => ({
    ...d,
    price: Math.round(product.price * (d.price / 100))
  }));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/50 hover:bg-white rounded-full p-2 z-10 transition-colors"
          >
            <X className="h-6 w-6 text-slate-600" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Side */}
            <div className="h-64 md:h-full relative bg-slate-100">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Side */}
            <div className="p-6 md:p-10 flex flex-col h-full max-h-[90vh] overflow-y-auto">
              <div className="mb-1">
                <span className="text-secondary font-semibold text-sm tracking-wider uppercase">{product.category}</span>
              </div>
              <h2 className="text-3xl font-bold text-primary mb-2">{product.title}</h2>
              <div className="flex items-center text-slate-500 mb-6">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="font-medium text-primary mr-1">In Stock:</span>
                {product.location.city}, {product.location.country}
              </div>

              <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Price</p>
                  <p className="text-4xl font-bold text-slate-900">${product.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 mb-1">Condition</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold
                    ${product.condition === 'New' ? 'bg-green-100 text-green-800' :
                      product.condition === 'Like New' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }
                  `}>
                    {product.condition}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex space-x-6 border-b border-slate-200 mb-6">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 text-sm font-medium transition-colors relative ${activeTab === 'details' ? 'text-secondary' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Description
                  {activeTab === 'details' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary" />}
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`pb-2 text-sm font-medium transition-colors relative ${activeTab === 'history' ? 'text-secondary' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Market Value
                  {activeTab === 'history' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary" />}
                </button>
              </div>

              <div className="flex-grow mb-8">
                {activeTab === 'details' ? (
                  <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed">
                      {product.description}
                    </p>

                    {/* AI Feature */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-purple-500" /> Alumni AI Inspector
                        </h4>
                        {!aiInsight && !loadingAi && (
                          <button
                            onClick={handleGenerateInsight}
                            className="text-xs bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 px-3 py-1 rounded-full transition-colors font-medium"
                          >
                            Analyze Item
                          </button>
                        )}
                      </div>
                      
                      {loadingAi ? (
                        <div className="flex items-center justify-center py-4 text-slate-500 gap-2 text-sm">
                          <Loader2 className="h-4 w-4 animate-spin" /> Analyzing market data and condition...
                        </div>
                      ) : aiInsight ? (
                        <div className="text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-purple-100 shadow-sm">
                          {aiInsight}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">
                          Get an instant AI assessment of this item's value, history, and what to look for before buying.
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-64 w-full">
                    <p className="text-xs text-slate-500 mb-4">Estimated market value trend for similar items over last 6 months.</p>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} unit="$" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line type="monotone" dataKey="price" stroke="#2dd4bf" strokeWidth={3} dot={{ fill: '#2dd4bf', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 mt-auto">
                 <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="w-full py-4 bg-primary hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" /> Add to Cart
                </button>
                <div className="flex justify-center gap-6 text-xs text-slate-400 mt-2">
                   <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> Worldwide Shipping</span>
                   <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Buyer Protection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
