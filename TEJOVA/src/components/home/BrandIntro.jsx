import React from 'react';
import { TextReveal } from '../common/TextReveal';
import { Button } from '../common/Button';

export const BrandIntro = () => {
  return (
    <section className="py-20 md:py-28 bg-[#F7F3E9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Story Content */}
          <div className="lg:col-span-6 space-y-6">
            <TextReveal>
              <span className="text-xs uppercase tracking-[0.2em] text-[#668F6B] font-semibold block">
                Brand Philosophy
              </span>
            </TextReveal>

            <TextReveal delay={0.1}>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1F4D3B] leading-tight">
                More Than Wellness. <br />
                A Way of Life.
              </h2>
            </TextReveal>

            <TextReveal delay={0.2}>
              <p className="text-base sm:text-lg text-[#687280] font-light leading-relaxed">
                TEJOVA is a premium wellness brand dedicated to helping you live with greater awareness, natural vitality and purpose. We bring together ancient botanical wisdom and modern science to support your journey toward lasting, holistic wellbeing.
              </p>
            </TextReveal>

            <TextReveal delay={0.3}>
              <p className="text-sm text-[#687280] font-light leading-relaxed">
                We believe in the power of natural living, mindful choices, and sustainable daily habits to help you feel better, live fuller and grow stronger from within.
              </p>
            </TextReveal>

            <TextReveal delay={0.4} className="pt-2">
              <Button to="/about" variant="text" icon>
                Our Philosophy
              </Button>
            </TextReveal>
          </div>

          {/* Right Column: Visual Composition */}
          <div className="lg:col-span-6 relative">
            <TextReveal delay={0.2}>
              <div className="relative rounded-t-full overflow-hidden shadow-lg aspect-[4/5] max-w-md mx-auto lg:max-w-none">
                <img
                  src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1200&auto=format&fit=crop"
                  alt="Botanical plant leaves representing natural vitality"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </TextReveal>

            {/* Subtle floating quote card */}
            <TextReveal delay={0.5} className="absolute -bottom-6 -left-4 sm:left-4 max-w-xs bg-white/90 backdrop-blur-md p-6 rounded-xs shadow-md border border-[#1F4D3B]/10 hidden sm:block">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#668F6B]" />
                <span className="text-xs uppercase tracking-widest text-[#668F6B] font-semibold">
                  Pure Vitality
                </span>
              </div>
              <p className="font-serif text-sm text-[#1F4D3B] italic">
                "Conscious living for a brighter, healthier future."
              </p>
            </TextReveal>
          </div>

        </div>

      </div>
    </section>
  );
};
