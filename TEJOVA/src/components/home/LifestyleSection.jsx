import React from 'react';
import { TextReveal } from '../common/TextReveal';
import { Button } from '../common/Button';

export const LifestyleSection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F3EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Wide Image */}
          <div className="lg:col-span-7 relative">
            <TextReveal>
              <div className="aspect-[16/10] overflow-hidden rounded-xs border border-[#B87333]/30 shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop"
                  alt="Person practicing meditation at sunrise in nature"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </TextReveal>
          </div>

          {/* Right Text */}
          <div className="lg:col-span-5 space-y-6">
            <TextReveal delay={0.1}>
              <span className="text-xs uppercase tracking-[0.25em] text-[#B87333] font-semibold block">
                Pillar 03
              </span>
            </TextReveal>

            <TextReveal delay={0.2}>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-[#0A2342] font-medium tracking-tight">
                Lifestyle
              </h2>
              <h3 className="text-lg text-[#B87333] font-serif italic mt-1">
                Awareness. Growth. Potential.
              </h3>
            </TextReveal>

            <TextReveal delay={0.3}>
              <p className="text-base sm:text-lg text-[#0A2342]/85 font-light leading-relaxed">
                Live with intention. Cultivate mindfulness, nurture mental clarity, and unlock your potential through daily rituals aligned with natural rhythms.
              </p>
            </TextReveal>

            <TextReveal delay={0.4} className="pt-2">
              <Button to="/lifestyle" variant="secondary" icon>
                Explore Lifestyle
              </Button>
            </TextReveal>
          </div>

        </div>

      </div>
    </section>
  );
};
