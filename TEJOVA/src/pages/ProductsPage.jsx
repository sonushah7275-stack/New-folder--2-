import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { products } from '../data/products';
import { ProductGrid } from '../components/products/ProductGrid';
import { SectionHeading } from '../components/common/SectionHeading';

const categories = ['All', 'Vitality', 'Nourishment', 'Lifestyle', 'Longevity'];

export const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        <SectionHeading
          subtitle="Organic Botanical Formulations"
          title="The TEJOVA Collection"
          description="Ethically harvested, bio-available botanicals designed to restore your natural state of physical, mental and cellular vitality."
        />

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

        {/* Product Grid */}
        <ProductGrid products={filteredProducts} columns={3} />

      </div>
    </PageContainer>
  );
};
