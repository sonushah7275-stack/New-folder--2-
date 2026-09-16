import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

export const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block bg-white rounded-xs border border-gray-200/70 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col h-full"
    >
      {/* Image Wrap */}
      <div className="relative aspect-square overflow-hidden bg-[#FAF8F3] p-6 flex items-center justify-center">
        {product.badge && (
          <span className="absolute top-4 left-4 z-10 text-[10px] font-semibold uppercase tracking-wider bg-[#1F4D3B] text-white px-2.5 py-1 rounded-xs">
            {product.badge}
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Info Container */}
      <div className="p-6 flex flex-col justify-between flex-1 bg-white">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase tracking-widest text-[#668F6B] font-semibold">
              {product.category}
            </span>
            {product.rating && (
              <div className="flex items-center text-amber-600 text-xs font-medium">
                <Star className="w-3.5 h-3.5 fill-current mr-1" />
                <span>{product.rating}</span>
              </div>
            )}
          </div>

          <h3 className="font-serif text-xl text-[#1F4D3B] group-hover:text-[#668F6B] transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-[#687280] font-light mt-1 mb-4 line-clamp-1">
            {product.subtitle}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-lg font-medium text-[#1F4D3B]">
            ₹{product.price}
          </span>

          <span className="text-xs font-semibold uppercase tracking-wider text-[#1F4D3B] group-hover:text-[#668F6B] flex items-center transition-colors">
            View Details
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
};
