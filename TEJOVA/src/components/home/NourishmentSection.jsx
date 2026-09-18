import React from 'react';
import { TextReveal } from '../common/TextReveal';
import { Button } from '../common/Button';
import nourishmentBowl from '../../assets/images/nourishment-bowl.svg';

export const NourishmentSection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <TextReveal delay={0.1}>
              <span className="text-xs uppercase tracking-[0.25em] text-[#B87333] font-semibold block">
                Pillar 02
              </span>
            </TextReveal>

            <TextReveal delay={0.2}>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-[#0A2342] font-medium tracking-tight">
                Nourishment
              </h2>
              <h3 className="text-lg text-[#B87333] font-serif italic mt-1">
                Real Food. Lasting Health.
              </h3>
            </TextReveal>

            <TextReveal delay={0.3}>
              <p className="text-base sm:text-lg text-[#0A2342]/85 font-light leading-relaxed">
                Whole foods, natural nutrition, and conscious eating fuel your body, balance your microbiome, and support long-term cellular resilience.
              </p>
            </TextReveal>

            <TextReveal delay={0.4} className="pt-2">
              <Button to="/nourishment" variant="secondary" icon>
                Explore Nourishment
              </Button>
            </TextReveal>
          </div>

          {/* Right Wide Image */}
          <div className="lg:col-span-7 relative order-1 lg:order-2">
            <TextReveal>
              <div className="aspect-[16/10] overflow-hidden rounded-xs border border-[#B87333]/30 shadow-xs">
                <img
                  src={nourishmentBowl}
                  alt="Fresh organic whole food bowl symbolizing natural nourishment"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </TextReveal>

            {/* Accent badge */}
            <div className="absolute bottom-6 left-6 bg-[#FAF9F6] px-5 py-3 rounded-xs border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 shadow-sm hidden sm:block">
              <span className="text-xs uppercase tracking-wider text-[#B87333] font-semibold block">Conscious Food</span>
              <span className="text-xs text-[#0A2342]/90">Microbiome & metabolic balance</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
