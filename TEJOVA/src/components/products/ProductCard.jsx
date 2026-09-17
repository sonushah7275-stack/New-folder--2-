import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

export const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block bg-[#FAF9F6] rounded-xs border-l-4 border-l-[#B87333] hover:border-l-[#D4AF37] border-y border-r border-[#B87333]/20 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full"
    >
      {/* 1. Product Image */}
      <div className="relative aspect-square overflow-hidden bg-[#F5F3EF] p-4 sm:p-6 flex items-center justify-center">
        {/* 6. Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 text-[10px] font-semibold uppercase tracking-wider bg-[#D4AF37] text-[#0A2342] px-2.5 py-1 rounded-xs shadow-xs">
            {product.badge}
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Info Container */}
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 bg-[#FAF9F6]">
        <div>
          {/* 2. Category & Rating */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#B87333]">
              {product.category}
            </span>
            {product.rating && (
              <div className="flex items-center text-[#B87333] text-xs font-medium">
                <Star className="w-3.5 h-3.5 fill-current mr-1 text-[#D4AF37]" />
                <span>{product.rating}</span>
              </div>
            )}
          </div>

          {/* 3. Product Title (20px–24px) */}
          <h3 className="font-serif text-xl sm:text-2xl text-[#0A2342] group-hover:text-[#D4AF37] transition-colors leading-snug">
            {product.name}
          </h3>

          {/* 4. Description (Min 14px, line height 1.6) */}
          <p className="text-sm text-[#0A2342]/80 font-light mt-1.5 mb-4 line-clamp-2 leading-relaxed">
            {product.subtitle || product.description}
          </p>
        </div>

        {/* 5. Price & 7. CTA / Action */}
        <div className="flex items-center justify-between pt-3 border-t border-[#B87333]/20">
          <span className="text-base sm:text-lg font-medium text-[#0A2342]">
            ₹{product.price}
          </span>

          <span className="text-xs font-semibold uppercase tracking-wider text-[#0A2342] group-hover:text-[#D4AF37] flex items-center transition-colors">
            Details
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
};
