import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { pillars } from '../data/pillars';
import { products } from '../data/products';
import { articles } from '../data/articles';
import { SectionHeading } from '../components/common/SectionHeading';
import { ProductGrid } from '../components/products/ProductGrid';
import { ArticleGrid } from '../components/journal/ArticleGrid';
import { TextReveal } from '../components/common/TextReveal';
import { Button } from '../components/common/Button';
import { Compass, Wind, Moon } from 'lucide-react';

export const LifestylePage = () => {
  const lifestyleData = pillars.find((p) => p.id === 'lifestyle');
  const relatedProducts = products.filter((p) => p.category === 'Lifestyle' || p.slug === 'mindful-clarity-elixir');
  const relatedArticles = articles.filter((a) => a.category === 'Conscious Living' || a.category === 'Personal Growth');

  return (
    <PageContainer>
      {/* Editorial Header */}
      <section className="relative py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#668F6B] font-semibold block">
            Pillar 03 — Lifestyle
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#1F4D3B] leading-tight">
            Awareness. Growth. Human Potential.
          </h1>
          <p className="text-lg text-[#687280] font-light leading-relaxed">
            {lifestyleData.longDescription}
          </p>
          <div className="pt-4 flex justify-center">
            <Button to="/products/mindful-clarity-elixir" variant="primary" icon>
              Explore Nootropic Clarity Elixir
            </Button>
          </div>
        </div>

        <div className="mt-14 rounded-xs overflow-hidden shadow-lg aspect-[21/9] max-w-5xl mx-auto">
          <img
            src={lifestyleData.heroImage}
            alt="Conscious lifestyle sunrise in mountains"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 3 Pillars of Living */}
      <section className="py-20 bg-white border-y border-gray-200/60 my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Inner Alignment"
            title="The 3 Rituals of Conscious Living"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {lifestyleData.highlights.map((item, idx) => (
              <TextReveal key={item.title} delay={idx * 0.1} className="bg-[#FAF8F3] p-8 rounded-xs border border-gray-200/80 space-y-4">
                <div className="w-10 h-10 rounded-full bg-[#886F4F] text-white flex items-center justify-center">
                  {idx === 0 ? <Compass className="w-5 h-5" /> : idx === 1 ? <Wind className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </div>
                <h3 className="font-serif text-2xl text-[#1F4D3B]">{item.title}</h3>
                <p className="text-sm text-[#687280] font-light leading-relaxed">{item.desc}</p>
              </TextReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {relatedProducts.length > 0 && (
        <section className="py-20 bg-[#FAF8F3] border-b border-gray-200/60 my-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              subtitle="Nootropics & Clarity"
              title="Products for Lifestyle Support"
            />
            <ProductGrid products={relatedProducts} columns={3} />
          </div>
        </section>
      )}

      {/* Articles */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Mindfulness & Growth"
          title="Journal Entries"
        />
        <ArticleGrid articles={relatedArticles} />
      </section>
    </PageContainer>
  );
};
