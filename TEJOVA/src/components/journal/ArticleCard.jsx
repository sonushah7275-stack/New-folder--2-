import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar } from 'lucide-react';

export const ArticleCard = ({ article, featured = false }) => {
  if (featured) {
    return (
      <Link
        to={`/journal/${article.slug}`}
        className="group block bg-white rounded-xs overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 border border-gray-200/70 mb-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 aspect-[16/10] overflow-hidden bg-[#FAF8F3]">
            <img
              src={article.image}
              alt={article.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
          <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between bg-white">
            <div>
              <div className="flex items-center space-x-3 mb-4 text-xs font-semibold uppercase tracking-wider text-[#668F6B]">
                <span>{article.category}</span>
                <span>•</span>
                <span className="flex items-center text-gray-500 font-normal">
                  <Clock className="w-3.5 h-3.5 mr-1" /> {article.readTime}
                </span>
              </div>

              <h2 className="font-serif text-2xl md:text-3xl text-[#1F4D3B] group-hover:text-[#668F6B] transition-colors mb-4 leading-tight">
                {article.title}
              </h2>

              <p className="text-sm text-[#687280] font-light leading-relaxed mb-6">
                {article.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-light">{article.date}</span>
              <span className="font-semibold uppercase tracking-wider text-[#1F4D3B] group-hover:text-[#668F6B] flex items-center">
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
      className="group block bg-white rounded-xs overflow-hidden shadow-xs hover:shadow-lg transition-all duration-500 border border-gray-200/70 flex flex-col h-full"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#FAF8F3]">
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 z-10 text-[10px] font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#1F4D3B] px-2.5 py-1 rounded-xs border border-gray-200">
          {article.category}
        </span>
      </div>

      <div className="p-6 flex flex-col justify-between flex-1 bg-white">
        <div>
          <div className="flex items-center space-x-3 mb-2 text-xs text-gray-400 font-light">
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" /> {article.date}
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" /> {article.readTime}
            </span>
          </div>

          <h3 className="font-serif text-xl text-[#1F4D3B] group-hover:text-[#668F6B] transition-colors mb-2 leading-snug">
            {article.title}
          </h3>

          <p className="text-xs text-[#687280] font-light line-clamp-2 leading-relaxed mb-4">
            {article.excerpt}
          </p>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#1F4D3B] group-hover:text-[#668F6B]">
          <span>Read Story</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};
