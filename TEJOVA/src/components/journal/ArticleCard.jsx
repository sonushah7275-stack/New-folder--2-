import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar } from 'lucide-react';

export const ArticleCard = ({ article, featured = false }) => {
  if (featured) {
    return (
      <Link
        to={`/journal/${article.slug}`}
        className="group block bg-[#FAF9F6] rounded-xs overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 border-l-4 border-l-[#B87333] hover:border-l-[#D4AF37] border-y border-r border-[#B87333]/20 mb-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 aspect-[16/10] overflow-hidden bg-[#F5F3EF]">
            <img
              src={article.image}
              alt={article.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
          <div className="lg:col-span-5 p-6 md:p-10 flex flex-col justify-between bg-[#FAF9F6]">
            <div>
              <div className="flex items-center space-x-3 mb-3 text-xs font-semibold uppercase tracking-wider text-[#B87333]">
                <span>{article.category}</span>
                <span>•</span>
                <span className="flex items-center text-[#0A2342]/70 font-normal">
                  <Clock className="w-3.5 h-3.5 mr-1" /> {article.readTime}
                </span>
              </div>

              <h2 className="font-serif text-2xl md:text-3xl text-[#0A2342] group-hover:text-[#D4AF37] transition-colors mb-4 leading-tight">
                {article.title}
              </h2>

              <p className="text-sm text-[#0A2342]/80 font-light leading-relaxed mb-6">
                {article.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-[#B87333]/20 flex items-center justify-between text-xs">
              <span className="text-[#0A2342]/70 font-light">{article.date}</span>
              <span className="font-semibold uppercase tracking-wider text-[#0A2342] group-hover:text-[#D4AF37] flex items-center transition-colors">
                Read Article <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/journal/${article.slug}`}
      className="group block bg-[#FAF9F6] rounded-xs overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 border-l-4 border-l-[#B87333] hover:border-l-[#D4AF37] border-y border-r border-[#B87333]/20 flex flex-col h-full"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#F5F3EF]">
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 z-10 text-[10px] font-semibold uppercase tracking-wider bg-[#FAF9F6]/90 backdrop-blur-md text-[#B87333] px-2.5 py-1 rounded-xs border border-[#B87333]/30">
          {article.category}
        </span>
      </div>

      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 bg-[#FAF9F6]">
        <div>
          <div className="flex items-center space-x-3 mb-2 text-xs text-[#0A2342]/70 font-light">
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" /> {article.date}
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" /> {article.readTime}
            </span>
          </div>

          <h3 className="font-serif text-lg sm:text-xl text-[#0A2342] group-hover:text-[#D4AF37] transition-colors mb-2 leading-snug">
            {article.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#0A2342]/75 font-light line-clamp-2 leading-relaxed mb-4">
            {article.excerpt}
          </p>
        </div>

        <div className="pt-3 border-t border-[#B87333]/20 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#0A2342] group-hover:text-[#D4AF37]">
          <span>Read Story</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};
