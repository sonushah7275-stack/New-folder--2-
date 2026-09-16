import React from 'react';
import { TextReveal } from '../common/TextReveal';
import { Button } from '../common/Button';

export const VitalitySection = () => {
  return (
    <section className="py-20 md:py-28 bg-[#FAF8F3] border-t border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Wide Image */}
          <div className="lg:col-span-7 relative">
            <TextReveal>
              <div className="aspect-[16/10] overflow-hidden rounded-xs shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1200&auto=format&fit=crop"
                  alt="Woman in sunlit nature feeling vibrant vitality"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </TextReveal>
            
            {/* Corner Badge */}
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-5 py-3 rounded-xs border border-gray-200 hidden sm:block">
              <span className="text-xs uppercase tracking-wider text-[#668F6B] font-semibold block">More Energy</span>
              <span className="text-xs text-[#1F4D3B]">Better focus & natural vigor</span>
            </div>
          </div>

          {/* Right Editorial Story */}
          <div className="lg:col-span-5 space-y-6">
            <TextReveal delay={0.1}>
              <span className="text-xs uppercase tracking-[0.2em] text-[#668F6B] font-semibold block">
                Pillar 01
              </span>
            </TextReveal>

            <TextReveal delay={0.2}>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1F4D3B]">
                Vitality
              </h2>
              <h3 className="text-lg text-[#668F6B] font-serif italic mt-1">
                Natural Energy. True Wellbeing.
              </h3>
            </TextReveal>

            <TextReveal delay={0.3}>
              <p className="text-base text-[#687280] font-light leading-relaxed">
                Feel more energized, focused and alive with nature’s most powerful adaptogenic ingredients. Vitality isn’t just about physical exertion — it’s about your whole energetic self.
              </p>
            </TextReveal>

            <TextReveal delay={0.4} className="pt-2">
              <Button to="/vitality" variant="secondary" icon>
                Explore Vitality
              </Button>
            </TextReveal>
          </div>

        </div>

      </div>
    </section>
  );
};
