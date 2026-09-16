import React from 'react';
import { TextReveal } from '../common/TextReveal';
import { Button } from '../common/Button';

export const LongevitySection = () => {
  return (
    <section className="py-20 md:py-28 bg-[#F7F3E9] border-t border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <TextReveal delay={0.1}>
              <span className="text-xs uppercase tracking-[0.2em] text-[#668F6B] font-semibold block">
                Pillar 04
              </span>
            </TextReveal>

            <TextReveal delay={0.2}>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1F4D3B]">
                Longevity
              </h2>
              <h3 className="text-lg text-[#668F6B] font-serif italic mt-1">
                Longer Life. Deeper Wellbeing.
              </h3>
            </TextReveal>

            <TextReveal delay={0.3}>
              <p className="text-base text-[#687280] font-light leading-relaxed">
                Support your body, calm your mind and nurture your spirit for a longer, healthier, happier life rooted in cellular protection and inner peace.
              </p>
            </TextReveal>

            <TextReveal delay={0.4} className="pt-2">
              <Button to="/longevity" variant="secondary" icon>
                Explore Longevity
              </Button>
            </TextReveal>
          </div>

          {/* Right Wide Image */}
          <div className="lg:col-span-7 relative order-1 lg:order-2">
            <TextReveal>
              <div className="aspect-[16/10] overflow-hidden rounded-xs shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop"
                  alt="Ancient misty mountain forest symbolizing timeless longevity"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </TextReveal>
          </div>

        </div>

      </div>
    </section>
  );
};
