import React, { useState } from 'react';
import { CartItem } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Truck, MapPin, ChevronRight, ChevronLeft, Trash2, Copy, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';

interface CheckoutProps {
  cart: CartItem[];
  onRemoveFromCart: (id: string) => void;
  onClearCart: () => void;
}

const steps = ['Cart Review', 'Shipping', 'Payment'];

export const Checkout: React.FC<CheckoutProps> = ({ cart, onRemoveFromCart, onClearCart }) => {
  const { user, getAuthToken } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<{
    trackingNumber: string;
    totalAmount: number;
    orderId: number;
  } | null>(null);

  const navigate = useNavigate();

  const [shippingDetails, setShippingDetails] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    address: '',
    city: '',
    country: 'Kenya',
    zip: ''
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const shippingCost = currentStep > 0 && shippingDetails.country 
    ? (shippingDetails.country.toLowerCase() === 'kenya' ? 10 : 35) 
    : 0;
  
  const total = subtotal + shippingCost;

  const handleNext = () => {
    if (currentStep === 1) {
      if (!shippingDetails.fullName || !shippingDetails.address || !shippingDetails.city || !shippingDetails.country || !shippingDetails.email) {
        setErrorMessage("Please fill in all required shipping and contact fields.");
        return;
      }
    }
    setErrorMessage('');
    if (currentStep < steps.length - 1) setCurrentStep(curr => curr + 1);
  };

  const handleBack = () => {
    setErrorMessage('');
    if (currentStep > 0) setCurrentStep(curr => curr - 1);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setErrorMessage('');
    try {
      const token = await getAuthToken();
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            id: item.id,
            price: item.price,
            quantity: item.quantity,
          })),
          shippingDetails: {
            name: shippingDetails.fullName,
            address: shippingDetails.address,
            city: shippingDetails.city,
            country: shippingDetails.country,
          },
          buyerEmail: shippingDetails.email,
          userIdToken: token || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit order transaction.");
      }

      const result = await response.json();
      setCompletedOrder({
        trackingNumber: result.trackingNumber,
        totalAmount: result.totalAmount,
        orderId: result.orderId,
      });
      onClearCart();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unexpected error occurred during database checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 1. Successful Placement Screen
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full border border-slate-100">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-9 w-9 text-teal-600 animate-bounce" />
          </div>
          
          <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-2">Order Placed!</h2>
          <p className="text-slate-500 text-center mb-8 leading-relaxed">
            Thank you for shopping on Alumni! Your transaction has been registered and is secure with global logistics.
          </p>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-8 divide-y divide-slate-100 space-y-3">
            <div className="flex justify-between text-sm py-1">
              <span className="text-slate-500">Order ID</span>
              <span className="font-semibold text-slate-800">#{completedOrder.orderId}</span>
            </div>
            <div className="flex justify-between text-sm pt-3 py-1">
              <span className="text-slate-500">Amount Paid</span>
              <span className="font-extrabold text-slate-900">${completedOrder.totalAmount.toFixed(2)}</span>
            </div>
            <div className="pt-3 py-1">
              <span className="block text-slate-500 text-sm mb-1.5 font-medium">Tracking Number (Copy for order tracking)</span>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={completedOrder.trackingNumber} 
                  className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-sm font-mono text-slate-800 focus:outline-none"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(completedOrder.trackingNumber);
                  }}
                  className="bg-primary hover:bg-slate-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center"
                  title="Copy Code"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link 
              to="/track-order" 
              className="w-full py-3.5 bg-primary text-white text-center rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <FileText className="h-5 w-5" />
              <span>Track Your Cargo</span>
            </Link>
            <Link 
              to="/items" 
              className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-center rounded-xl font-semibold transition-colors"
            >
              Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Empty Cart Check
  if (cart.length === 0 && currentStep === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Your cart is empty</h2>
        <p className="text-slate-500 mb-8">Looks like you haven't found a treasure yet.</p>
        <Link to="/items" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-slate-700 transition-colors">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-primary mb-8 animate-fade-in">Checkout</h1>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
            {steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center bg-slate-50 px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  index <= currentStep ? 'bg-secondary text-primary' : 'bg-slate-300 text-white'
                }`}>
                  {index < currentStep ? <CheckCircle className="h-5 w-5" /> : index + 1}
                </div>
                <span className={`text-xs mt-2 font-medium ${index <= currentStep ? 'text-primary' : 'text-slate-400'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            
            {errorMessage && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">
                {errorMessage}
              </div>
            )}

            {/* Step 1: Cart Review */}
            {currentStep === 0 && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-xl font-bold text-primary">Review Items</h2>
                </div>
                <ul className="divide-y divide-slate-100">
                  {cart.map(item => (
                    <li key={item.id} className="p-6 flex items-start gap-4">
                      <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg bg-slate-100" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-primary">{item.title}</h3>
                          <p className="font-bold text-primary">${item.price}</p>
                        </div>
                        <p className="text-sm text-slate-500 mb-2">{item.category}</p>
                        <div className="flex items-center text-xs text-slate-400 mb-4">
                           <MapPin className="h-3 w-3 mr-1" /> Ships from: {item.location.city}, {item.location.country}
                        </div>
                        <button 
                          onClick={() => onRemoveFromCart(item.id)}
                          className="text-red-500 text-sm hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step 2: Shipping */}
            {currentStep === 1 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-secondary" /> Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none" 
                      value={shippingDetails.fullName} 
                      onChange={e => setShippingDetails({...shippingDetails, fullName: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email for Delivery Updates</label>
                    <input 
                      type="email" 
                      required
                      className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none" 
                      value={shippingDetails.email} 
                      onChange={e => setShippingDetails({...shippingDetails, email: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                    <input 
                      type="text" 
                      required
                      className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none" 
                      value={shippingDetails.address} 
                      onChange={e => setShippingDetails({...shippingDetails, address: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                    <input 
                      type="text" 
                      required
                      className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none" 
                      value={shippingDetails.city} 
                      onChange={e => setShippingDetails({...shippingDetails, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Kenya" 
                      className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none" 
                      value={shippingDetails.country} 
                      onChange={e => setShippingDetails({...shippingDetails, country: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 2 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-secondary" /> Payment Details
                </h2>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4 text-sm text-slate-600">
                  <p>Secure SSL encrypted connection. This is a demo checkout. Complete verification by clicking "Complete Order".</p>
                </div>
                <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                     <input type="text" placeholder="5123 0000 0000 0000" className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                      <input type="text" placeholder="12/28" className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                      <input type="text" placeholder="123" className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <button 
                onClick={handleBack} 
                disabled={currentStep === 0}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${currentStep === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </button>
              
              {currentStep < 2 ? (
                <button 
                  onClick={handleNext}
                  className="flex items-center px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-lg"
                >
                  Continue <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              ) : (
                <button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex items-center px-8 py-3 bg-secondary text-primary rounded-lg font-bold hover:bg-teal-300 transition-colors shadow-lg min-w-[160px] justify-center"
                >
                  {isProcessing ? 'Processing...' : 'Complete Order'}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-1">
             <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h3 className="text-lg font-bold text-primary mb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping Estimate</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-lg text-primary">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">
                  * Shipping calculated based on origin and destination. International duties may apply upon delivery.
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
