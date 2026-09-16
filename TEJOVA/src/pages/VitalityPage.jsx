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
import { Zap, Sun, Activity, ShieldCheck } from 'lucide-react';

export const VitalityPage = () => {
  const vitalityData = pillars.find((p) => p.id === 'vitality');
  const relatedProducts = products.filter((p) => p.category === 'Vitality' || p.slug === 'vitality-tonic');
  const relatedArticles = articles.filter((a) => a.category === 'Nourishment' || a.category === 'Vitality');

  return (
    <PageContainer>
      {/* Editorial Hero */}
      <section className="relative py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#668F6B] font-semibold block">
              Pillar 01 — Vitality
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#1F4D3B] leading-tight">
              Natural Energy. <br />
              Peak Vigor.
            </h1>
            <p className="text-lg text-[#687280] font-light leading-relaxed">
              {vitalityData.longDescription}
            </p>
            <div className="pt-2">
              <Button to="/products/vitality-tonic" variant="primary" icon>
                Explore Vitality Tonic
              </Button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="aspect-[4/3] rounded-xs overflow-hidden shadow-lg">
              <img
                src={vitalityData.heroImage}
                alt="Natural energy vitality"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles Grid */}
      <section className="py-20 bg-white border-y border-gray-200/60 my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Biological Foundation"
            title="The 3 Pillars of Vitality"
            description="How adaptogenic botanicals and circadian light restore innate biological stamina."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vitalityData.highlights.map((item, idx) => (
              <TextReveal key={item.title} delay={idx * 0.1} className="bg-[#FAF8F3] p-8 rounded-xs border border-gray-200/80 space-y-4">
                <div className="w-10 h-10 rounded-full bg-[#1F4D3B] text-white flex items-center justify-center">
                  {idx === 0 ? <Zap className="w-5 h-5" /> : idx === 1 ? <Activity className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <h3 className="font-serif text-2xl text-[#1F4D3B]">{item.title}</h3>
                <p className="text-sm text-[#687280] font-light leading-relaxed">{item.desc}</p>
              </TextReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Practices Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Daily Protocols"
          title="Recommended Rituals"
          description="Simple routines to integrate into your morning and afternoon."
        />

        <div className="space-y-6 max-w-4xl mx-auto">
          {vitalityData.practices.map((practice, idx) => (
            <TextReveal key={practice.title} delay={idx * 0.1} className="bg-white p-6 sm:p-8 rounded-xs border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#668F6B]">{practice.time}</span>
                <h4 className="font-serif text-xl text-[#1F4D3B]">{practice.title}</h4>
                <p className="text-sm text-[#687280] font-light max-w-xl">{practice.desc}</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-[#1F4D3B]/40 shrink-0" />
            </TextReveal>
          ))}
        </div>
      </section>

      {/* Related Formulations */}
      <section className="py-20 bg-[#FAF8F3] border-t border-gray-200/60 my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Targeted Botanical Support"
            title="Formulations for Vitality"
          />
          <ProductGrid products={relatedProducts} columns={3} />
        </div>
      </section>

      {/* Journal Feature */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="From The Journal"
          title="Further Reading on Vitality"
        />
        <ArticleGrid articles={relatedArticles.slice(0, 2)} />
      </section>
    </PageContainer>
  );
};
