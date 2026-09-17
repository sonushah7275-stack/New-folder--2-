import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const PillarCard = ({ pillar }) => {
  return (
    <Link
      to={pillar.link}
      className="group block bg-[#FAF9F6] rounded-xs overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 border-l-4 border-l-[#B87333] hover:border-l-[#D4AF37] border-y border-r border-[#B87333]/20 flex flex-col h-full"
    >
      {/* Image Container with Subtle Zoom effect */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F3EF]">
        <img
          src={pillar.image}
          alt={pillar.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
      </div>

      {/* Text Content */}
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#B87333] font-semibold block mb-1">
            Pillar
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#0A2342] group-hover:text-[#D4AF37] transition-colors mb-2">
            {pillar.title}
          </h3>
          <p className="text-sm text-[#0A2342]/75 font-light line-clamp-2 leading-relaxed mb-4">
            {pillar.description}
          </p>
        </div>

        <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-[#B87333] group-hover:text-[#D4AF37] transition-colors pt-3 border-t border-[#B87333]/20">
          <span>Explore</span>
          <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform duration-300 group-hover:translate-x-1.5" />
        </div>
      </div>
    </Link>
  );
};
