import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, MapPin, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

export const Tracking: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsLoading(true);
    setResult(null);
    setErrorMsg('');

    try {
      const response = await fetch(`/api/orders/track/${trackingId.toUpperCase().trim()}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Order not found. Please verify the tracking code.");
        }
        throw new Error("Failed to retrieve order tracking details.");
      }

      const orderData = await response.json();

      // Create a dynamic logistics timeline based on the database order status
      const status = orderData.status || "Processing";
      const createdDate = new Date(orderData.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const timeline = [];

      if (status === "Delivered") {
        timeline.push({
          date: 'Delivered Successfully',
          location: `${orderData.shippingCity}, ${orderData.shippingCountry}`,
          description: 'Package delivered and received',
          completed: true,
          current: true,
        });
        timeline.push({
          date: 'Completed Transit',
          location: 'International Logistics Hub',
          description: 'Package departed carrier facility',
          completed: true,
          current: false,
        });
        timeline.push({
          date: createdDate,
          location: 'Origin Hub',
          description: 'Order registered and processing finalized',
          completed: true,
          current: false,
        });
      } else if (status === "Shipped") {
        timeline.push({
          date: 'In Transit',
          location: 'International Logistics Hub',
          description: 'Package is on its path to destination',
          completed: false,
          current: true,
        });
        timeline.push({
          date: createdDate,
          location: 'Origin Hub',
          description: 'Order processed and ready for transit shipping',
          completed: true,
          current: false,
        });
      } else { // Processing
        timeline.push({
          date: createdDate,
          location: 'Main Logistics Desk',
          description: 'Payment authorized. Order list processed and packing items.',
          completed: true,
          current: true,
        });
      }

      setResult({
        id: orderData.trackingNumber,
        status: status,
        origin: 'International Warehouse',
        destination: `${orderData.shippingCity}, ${orderData.shippingCountry}`,
        estimatedDelivery: status === "Delivered" ? 'Delivered' : '4-7 Business Days',
        timeline: timeline
      });

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred during database lookup.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4">
            <ShieldCheck className="h-8 w-8 text-secondary" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-4">Track Your Shipment</h1>
          <p className="text-slate-500 max-w-lg mx-auto">
            Enter your tracking ID to see the real-time status of your package. 
            We ensure every step of the journey is monitored for your safety.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input 
                type="text" 
                placeholder="Enter Tracking ID (e.g., AL-283401-KE)"
                className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none text-lg font-mono"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-primary text-white font-bold py-4 px-8 rounded-xl hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 min-w-[140px]"
            >
              {isLoading ? "Searching..." : "Track Cargo"}
            </button>
          </form>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100 mb-8 max-w-xl mx-auto text-center animate-fade-in">
            {errorMsg}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
            {/* Status Header */}
            <div className="bg-slate-900 p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-slate-400 text-sm mb-1">Tracking Number</p>
                <p className="text-xl font-mono font-bold text-secondary">{result.id}</p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                <Truck className="h-5 w-5 text-secondary" />
                <span className="font-semibold">{result.status}</span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">From</p>
                  <p className="font-medium text-slate-900">{result.origin}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">To</p>
                  <p className="font-medium text-slate-900">{result.destination}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Estimated Delivery</p>
                  <p className="font-medium text-secondary">{result.estimatedDelivery}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-8">
              <h3 className="text-lg font-bold text-primary mb-6">Shipment Progress</h3>
              <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pb-2">
                {result.timeline.map((event: any, index: number) => (
                  <div key={index} className="relative pl-8">
                    <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 
                      ${event.current 
                        ? 'bg-secondary border-secondary shadow-[0_0_0_4px_rgba(45,212,191,0.2)]' 
                        : event.completed 
                          ? 'bg-slate-800 border-slate-800' 
                          : 'bg-white border-slate-300'
                      }`}
                    ></div>
                    <div className={`${event.current ? 'text-slate-900' : 'text-slate-500'}`}>
                      <p className="font-bold text-sm">{event.description}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm mt-1 gap-1 sm:gap-4">
                        <span className="flex items-center gap-1 text-xs font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-600 w-fit">
                          <MapPin className="h-3 w-3" /> {event.location}
                        </span>
                        <span className="text-xs text-slate-400">{event.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Safety Note */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            <strong>Buyer Protection Guarantee:</strong> All tracked shipments are insured. If your item does not arrive by the estimated date, please contact support immediately for a full refund or investigation.
          </p>
        </div>

      </div>
    </div>
  );
};
