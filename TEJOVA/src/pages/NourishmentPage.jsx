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
import { Heart, Sparkles, Utensils } from 'lucide-react';

export const NourishmentPage = () => {
  const nourishData = pillars.find((p) => p.id === 'nourishment');
  const relatedProducts = products.filter((p) => p.category === 'Nourishment' || p.slug === 'earth-ritual-serum');
  const relatedArticles = articles.filter((a) => a.category === 'Nourishment');

  return (
    <PageContainer>
      {/* Unique Editorial Layout for Nourishment */}
      <section className="relative py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="aspect-[4/3] rounded-xs overflow-hidden shadow-lg">
              <img
                src={nourishData.heroImage}
                alt="Conscious nourishment whole food"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#668F6B] font-semibold block">
              Pillar 02 — Nourishment
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#1F4D3B] leading-tight">
              Real Food. <br />
              Cellular Renewal.
            </h1>
            <p className="text-lg text-[#687280] font-light leading-relaxed">
              {nourishData.longDescription}
            </p>
            <div className="pt-2">
              <Button to="/products/earth-ritual-serum" variant="primary" icon>
                Discover Botanical Formulations
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Callout Quote */}
      <section className="py-16 bg-[#1F4D3B] text-white my-12">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.3em] text-[#A7B99F] font-medium">The Nourishment Ethos</span>
          <blockquote className="font-serif text-2xl sm:text-4xl leading-relaxed italic text-[#F7F3E9]">
            "Nourishment is not merely calories in a bowl; it is an active dialog with your microbiome and cellular health."
          </blockquote>
          <span className="text-xs tracking-widest uppercase text-white/70 block font-light">— TEJOVA Research Group</span>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Microbiome & Whole Foods"
          title="Nourishment Foundations"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {nourishData.highlights.map((item, idx) => (
            <TextReveal key={item.title} delay={idx * 0.1} className="bg-white p-8 rounded-xs border border-gray-200 space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#668F6B] text-white flex items-center justify-center">
                {idx === 0 ? <Utensils className="w-5 h-5" /> : idx === 1 ? <Heart className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </div>
              <h3 className="font-serif text-2xl text-[#1F4D3B]">{item.title}</h3>
              <p className="text-sm text-[#687280] font-light leading-relaxed">{item.desc}</p>
            </TextReveal>
          ))}
        </div>
      </section>

      {/* Formulations Grid */}
      <section className="py-20 bg-[#FAF8F3] border-t border-gray-200/60 my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Whole-Food Formulations"
            title="Supplements & Botanicals"
          />
          <ProductGrid products={relatedProducts} columns={2} />
        </div>
      </section>

      {/* Articles */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Nourishment Stories"
          title="Insights & Articles"
        />
        <ArticleGrid articles={relatedArticles} />
      </section>
    </PageContainer>
  );
};
