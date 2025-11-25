import React from 'react';
import { Product } from '../types';
import { MapPin, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-primary shadow-sm">
          {product.category}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-sm font-medium">Listed {product.listedDate}</p>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-primary line-clamp-1 group-hover:text-secondary transition-colors">
            {product.title}
          </h3>
          <span className="text-lg font-bold text-secondary">
            ${product.price}
          </span>
        </div>

        <div className="flex items-center text-slate-500 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="truncate">{product.location.city}, {product.location.country}</span>
        </div>

        <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        <button
          onClick={() => onViewDetails(product)}
          className="w-full mt-auto py-2 px-4 bg-slate-100 hover:bg-primary hover:text-white text-slate-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 group-btn"
        >
          View Details
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
