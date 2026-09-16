import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const PillarCard = ({ pillar }) => {
  return (
    <Link
      to={pillar.link}
      className="group block bg-white rounded-xs overflow-hidden shadow-xs hover:shadow-lg transition-all duration-500 border border-gray-100 flex flex-col h-full"
    >
      {/* Image Container with Zoom effect */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F3E9]">
        <img
          src={pillar.image}
          alt={pillar.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
      </div>

      {/* Text Content */}
      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-serif text-2xl text-[#1F4D3B] group-hover:text-[#668F6B] transition-colors mb-2">
            {pillar.title}
          </h3>
          <p className="text-xs text-[#687280] font-light line-clamp-2 leading-relaxed mb-4">
            {pillar.description}
          </p>
        </div>

        <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-[#1F4D3B] group-hover:text-[#668F6B] transition-colors pt-2 border-t border-gray-100">
          <span>Explore</span>
          <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform duration-300 group-hover:translate-x-1.5" />
        </div>
      </div>
    </Link>
  );
};
