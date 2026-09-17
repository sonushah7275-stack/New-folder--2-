import React from 'react';
import { TextReveal } from '../common/TextReveal';
import { Button } from '../common/Button';

export const VitalitySection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F3EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Visual: Indoor Biological Architecture & Yoga Studio */}
          <div className="lg:col-span-7 relative">
            <TextReveal>
              <div className="aspect-[16/10] overflow-hidden rounded-xs border border-[#B87333]/30 shadow-xs bg-[#FAF9F6]">
                <img
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop"
                  alt="Indoor yoga practice in a modern biological architecture studio with natural lighting"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </TextReveal>
            
            {/* Corner Badge */}
            <div className="absolute top-6 right-6 bg-[#FAF9F6] px-5 py-3 rounded-xs border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 shadow-sm hidden sm:block">
              <span className="text-xs uppercase tracking-wider text-[#B87333] font-semibold block">
                Biological Architecture
              </span>
              <span className="text-xs text-[#0A2342]/90 font-medium">
                Indoor Yoga & Mindful Movement
              </span>
            </div>
          </div>

          {/* Right Editorial Story */}
          <div className="lg:col-span-5 space-y-6">
            <TextReveal delay={0.1}>
              <span className="text-xs uppercase tracking-[0.25em] text-[#B87333] font-semibold block">
                Pillar 01
              </span>
            </TextReveal>

            <TextReveal delay={0.2}>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-[#0A2342] font-medium tracking-tight">
                Vitality
              </h2>
              <h3 className="text-lg text-[#B87333] font-serif italic mt-1">
                Natural Energy. True Wellbeing.
              </h3>
            </TextReveal>

            <TextReveal delay={0.3}>
              <p className="text-base sm:text-lg text-[#0A2342]/85 font-light leading-relaxed">
                Feel more energized, focused, and aligned through mindful somatic movement, organic spaces, and nature’s most powerful adaptogenic formulations. Vitality is about nurturing your total biological potential.
              </p>
            </TextReveal>

            <TextReveal delay={0.4} className="pt-2">
              <Button to="/vitality" variant="primary" icon>
                Explore Vitality
              </Button>
            </TextReveal>
          </div>

        </div>

      </div>
    </section>
  );
};
