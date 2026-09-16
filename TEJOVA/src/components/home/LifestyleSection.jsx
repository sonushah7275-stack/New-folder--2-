import React from 'react';
import { TextReveal } from '../common/TextReveal';
import { Button } from '../common/Button';

export const LifestyleSection = () => {
  return (
    <section className="py-20 md:py-28 bg-[#FAF8F3] border-t border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Wide Image */}
          <div className="lg:col-span-7 relative">
            <TextReveal>
              <div className="aspect-[16/10] overflow-hidden rounded-xs shadow-md">
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
              <span className="text-xs uppercase tracking-[0.2em] text-[#668F6B] font-semibold block">
                Pillar 03
              </span>
            </TextReveal>

            <TextReveal delay={0.2}>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1F4D3B]">
                Lifestyle
              </h2>
              <h3 className="text-lg text-[#668F6B] font-serif italic mt-1">
                Awareness. Growth. Potential.
              </h3>
            </TextReveal>

            <TextReveal delay={0.3}>
              <p className="text-base text-[#687280] font-light leading-relaxed">
                Live with intention. Cultivate mindfulness, nurture your mind and unlock your human potential through a conscious lifestyle tailored to natural biological rhythms.
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
