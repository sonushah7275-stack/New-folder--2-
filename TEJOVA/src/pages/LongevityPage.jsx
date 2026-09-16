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
import { Shield, RefreshCw, Feather } from 'lucide-react';

export const LongevityPage = () => {
  const longevityData = pillars.find((p) => p.id === 'longevity');
  const relatedProducts = products.filter((p) => p.category === 'Longevity' || p.slug === 'restore-and-renew' || p.slug === 'cellular-youth-capsules');
  const relatedArticles = articles.filter((a) => a.category === 'Longevity');

  return (
    <PageContainer>
      {/* Editorial Hero */}
      <section className="relative py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#668F6B] font-semibold block">
              Pillar 04 — Longevity
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#1F4D3B] leading-tight">
              Longer Life. <br />
              Cellular Protection.
            </h1>
            <p className="text-lg text-[#687280] font-light leading-relaxed">
              {longevityData.longDescription}
            </p>
            <div className="pt-2">
              <Button to="/products/restore-and-renew" variant="primary" icon>
                Explore Sleep & Renewal Formulations
              </Button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="aspect-[4/3] rounded-xs overflow-hidden shadow-lg">
              <img
                src={longevityData.heroImage}
                alt="Timeless forest longevity landscape"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Longevity Pillars */}
      <section className="py-20 bg-white border-y border-gray-200/60 my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Biological Resilience"
            title="Keys to Cellular Longevity"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {longevityData.highlights.map((item, idx) => (
              <TextReveal key={item.title} delay={idx * 0.1} className="bg-[#FAF8F3] p-8 rounded-xs border border-gray-200/80 space-y-4">
                <div className="w-10 h-10 rounded-full bg-[#1F4D3B] text-white flex items-center justify-center">
                  {idx === 0 ? <RefreshCw className="w-5 h-5" /> : idx === 1 ? <Feather className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                </div>
                <h3 className="font-serif text-2xl text-[#1F4D3B]">{item.title}</h3>
                <p className="text-sm text-[#687280] font-light leading-relaxed">{item.desc}</p>
              </TextReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-20 bg-[#FAF8F3] border-b border-gray-200/60 my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Cellular & Restorative Science"
            title="Longevity Formulations"
          />
          <ProductGrid products={relatedProducts} columns={2} />
        </div>
      </section>

      {/* Articles */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Epigenetics & Healthspan"
          title="Longevity Research"
        />
        <ArticleGrid articles={relatedArticles} />
      </section>
    </PageContainer>
  );
};
