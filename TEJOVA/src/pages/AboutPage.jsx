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
        <span className="text-xs uppercase tracking-[0.3em] text-[#B87333] font-semibold block mb-4">
          Our Brand Story
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[72px] text-[#0A2342] leading-tight max-w-4xl mx-auto mb-6 font-medium">
          We Believe Wellness Should Expand Your Life, Not Limit It.
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-[#0A2342]/85 font-light max-w-2xl mx-auto leading-relaxed">
          TEJOVA was born out of a quiet realization: true health isn't found in rigid routines or synthetic quick fixes, but in living in harmonious resonance with natural biological laws.
        </p>
      </section>

      {/* Hero Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="aspect-[21/9] rounded-xs overflow-hidden border border-[#B87333]/30 shadow-xs">
          <img
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop"
            alt="Sunrise over pristine wilderness"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 sm:py-20 bg-[#FAF9F6] border-y border-[#B87333]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#B87333] font-semibold block">
                The Philosophy
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-[#0A2342] leading-tight font-medium">
                Expand Your Light
              </h2>
              <p className="text-base sm:text-lg text-[#0A2342]/85 font-light leading-relaxed">
                "Tej" in ancient Sanskrit represents inner radiance, biological brilliance, and vital heat. "Ova" signifies origin and continuous growth. Together, <strong>TEJOVA</strong> embodies the expansion of your innate physical and mental radiance.
              </p>
              <p className="text-sm sm:text-base text-[#0A2342]/75 font-light leading-relaxed">
                Every formulation we create, every article we write, and every ritual we share is designed to nurture your light — helping you show up fully for yourself, your loved ones, and the world around you.
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-[#FAF9F6] p-8 md:p-10 rounded-xs border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 shadow-xs space-y-6">
                <h3 className="font-serif text-2xl text-[#0A2342]">Our Core Commitments</h3>
                <ul className="space-y-4 text-sm sm:text-base text-[#0A2342]/80 font-light">
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-[#B87333] mt-2 mr-3 shrink-0" />
                    <span><strong>Purity Without Compromise:</strong> Wildcrafted, 100% organic ingredients sourced directly from ethical bio-farms.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-[#B87333] mt-2 mr-3 shrink-0" />
                    <span><strong>Biological Synergy:</strong> Formulas designed to complement natural metabolic pathways rather than override them.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-[#B87333] mt-2 mr-3 shrink-0" />
                    <span><strong>Mindful Living:</strong> Elevating everyday routines into conscious, grounding daily rituals.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Five Pillars Summary */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="A Complete Approach"
          title="Built Upon Five Pillars"
          description="We view wellbeing through five interconnected dimensions that work together to create a vibrant life."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {pillars.map((p) => (
            <div key={p.id} className="bg-[#FAF9F6] p-6 rounded-xs border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 space-y-3">
              <h4 className="font-serif text-xl text-[#0A2342]">{p.title}</h4>
              <p className="text-xs text-[#0A2342]/75 font-light leading-relaxed">{p.tagline}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Button to="/products" variant="primary" size="lg" icon>
            Explore Formulations
          </Button>
        </div>
      </section>

    </PageContainer>
  );
};
