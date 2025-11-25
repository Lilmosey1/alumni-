import React from 'react';
import { Mail, MessageSquare, MapPin } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Get in touch</h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Have questions about a listing, shipping, or selling on Alumni? We're here to help you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input type="email" className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none" placeholder="john@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                <select className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none text-slate-600 bg-white">
                  <option>General Inquiry</option>
                  <option>Order Issue</option>
                  <option>Selling Support</option>
                  <option>Report a Listing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea rows={5} className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none" placeholder="How can we help?"></textarea>
              </div>
              <button type="button" className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors shadow-lg">
                Send Message
              </button>
              <p className="text-xs text-slate-400 text-center mt-4">
                Note: All help messages are forwarded directly to <strong>stevekondejnr@gmail.com</strong>
              </p>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div className="bg-primary rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-secondary rounded-full opacity-10"></div>
              <h3 className="text-xl font-bold mb-6 relative z-10">Contact Information</h3>
              <div className="space-y-6 relative z-10">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-secondary mr-4 mt-1" />
                  <div>
                    <p className="font-semibold">Email Support</p>
                    <p className="text-slate-300 text-sm">stevekondejnr@gmail.com</p>
                    <p className="text-slate-400 text-xs mt-1">Response time: ~24 hours</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-secondary mr-4 mt-1" />
                  <div>
                    <p className="font-semibold">Headquarters</p>
                    <p className="text-slate-300 text-sm">
                      Alumni Market Plaza<br />
                      Westlands, Nairobi<br />
                      Kenya
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MessageSquare className="h-6 w-6 text-secondary mr-4 mt-1" />
                  <div>
                    <p className="font-semibold">Live Chat</p>
                    <p className="text-slate-300 text-sm">Available Mon-Fri, 9am - 5pm EAT</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-xl font-bold text-primary mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-800">
                    <span>How is shipping calculated?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-slate-600 mt-3 group-open:animate-fadeIn text-sm">
                     Shipping costs are calculated dynamically based on the distance between the seller's verified location and your delivery address, plus the weight/dimensions of the item.
                  </p>
                </details>
                <hr className="border-slate-100" />
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-800">
                    <span>Is my purchase protected?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-slate-600 mt-3 group-open:animate-fadeIn text-sm">
                    Yes, Alumni Buyer Protection covers all eligible transactions. If an item arrives significantly not as described or doesn't arrive, we'll refund you.
                  </p>
                </details>
              </div>
            </div>
            
            {/* Map Placeholder */}
            <div className="w-full h-48 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden relative">
               <img 
                 src="https://images.unsplash.com/photo-1628109670733-5b8782f9c464?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                 alt="Nairobi Map Placeholder" 
                 className="w-full h-full object-cover opacity-50"
               />
               <span className="flex items-center gap-2 absolute bg-white/80 px-4 py-2 rounded-full font-medium text-slate-700 shadow-sm backdrop-blur-sm">
                 <MapPin className="h-4 w-4 text-secondary" /> Nairobi, Kenya
               </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};