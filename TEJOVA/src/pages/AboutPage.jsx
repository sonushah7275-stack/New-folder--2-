import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import { pillars } from '../data/pillars';

export const AboutPage = () => {
  return (
    <PageContainer>
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-[#668F6B] font-semibold block mb-4">
          Our Brand Story
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-[#1F4D3B] leading-tight max-w-4xl mx-auto mb-6">
          We Believe Wellness Should Expand Your Life, Not Limit It.
        </h1>
        <p className="text-lg sm:text-xl text-[#687280] font-light max-w-2xl mx-auto leading-relaxed">
          TEJOVA was born out of a quiet realization: true health isn't found in rigid routines or synthetic quick fixes, but in living in harmonious resonance with natural biological laws.
        </p>
      </section>

      {/* Hero Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="aspect-[21/9] rounded-xs overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop"
            alt="Sunrise over pristine wilderness"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-white border-y border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#668F6B] font-semibold block">
                The Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#1F4D3B] leading-tight">
                Expand Your Light
              </h2>
              <p className="text-base text-[#687280] font-light leading-relaxed">
                "Tej" in ancient Sanskrit represents inner radiance, biological brilliance, and vital heat. "Ova" signifies origin and continuous growth. Together, <strong>TEJOVA</strong> embodies the expansion of your innate physical and mental radiance.
              </p>
              <p className="text-base text-[#687280] font-light leading-relaxed">
                Every formulation we create, every article we write, and every ritual we share is designed to nurture your light — helping you show up fully for yourself, your loved ones, and the world around you.
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-[#FAF8F3] p-8 md:p-12 rounded-xs border border-gray-200 space-y-6">
                <h3 className="font-serif text-2xl text-[#1F4D3B]">Our Core Commitments</h3>
                <ul className="space-y-4 text-sm text-[#687280] font-light">
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-[#1F4D3B] mt-2 mr-3 shrink-0" />
                    <span><strong>Purity Without Compromise:</strong> Wildcrafted, 100% organic ingredients sourced directly from ethical bio-farms.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-[#1F4D3B] mt-2 mr-3 shrink-0" />
                    <span><strong>Biological Synergy:</strong> Formulas designed to complement natural metabolic pathways rather than override them.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-[#1F4D3B] mt-2 mr-3 shrink-0" />
                    <span><strong>Mindful Living:</strong> Elevating everyday routines into conscious, grounding daily rituals.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Five Pillars Summary */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="A Complete Approach"
          title="Built Upon Five Pillars"
          description="We view wellbeing through five interconnected dimensions that work together to create a vibrant life."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {pillars.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-xs border border-gray-200 space-y-3">
              <h4 className="font-serif text-xl text-[#1F4D3B]">{p.title}</h4>
              <p className="text-xs text-[#687280] font-light leading-relaxed">{p.tagline}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button to="/products" variant="primary" size="lg" icon>
            Explore Formulations
          </Button>
        </div>
      </section>

    </PageContainer>
  );
};
