import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { articles } from '../data/articles';
import { ArticleCard } from '../components/journal/ArticleCard';
import { ArticleGrid } from '../components/journal/ArticleGrid';
import { SectionHeading } from '../components/common/SectionHeading';

const categories = ['All', 'Vitality', 'Nourishment', 'Lifestyle', 'Longevity', 'Conscious Living'];

export const JournalPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  
  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter((a) => a.category === selectedCategory);

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        <SectionHeading
          subtitle="Conscious Living Journal"
          title="Essays & Insights"
          description="Reflections on biological vitality, clean nourishment, daily mindfulness and long-term health span."
        />

        {/* Featured Article */}
        <ArticleCard article={featuredArticle} featured />

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-[#1F4D3B] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1F4D3B] hover:text-[#1F4D3B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <ArticleGrid articles={filteredArticles} />

      </div>
    </PageContainer>
  );
};
