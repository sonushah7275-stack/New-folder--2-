import React from 'react';
import { TextReveal } from '../common/TextReveal';
import { Button } from '../common/Button';
import brandBotanical from '../../assets/images/brand-botanical.svg';

export const BrandIntro = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F3EF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Story Content */}
          <div className="lg:col-span-6 space-y-6">
            <TextReveal>
              <span className="text-xs uppercase tracking-[0.25em] text-[#B87333] font-semibold block">
                Brand Philosophy
              </span>
            </TextReveal>

            <TextReveal delay={0.1}>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-[#0A2342] leading-tight font-medium">
                More Than Wellness. <br />
                A Way of Life.
              </h2>
            </TextReveal>

            <TextReveal delay={0.2}>
              <p className="text-base sm:text-lg text-[#0A2342]/85 font-light leading-relaxed">
                TEJOVA is a premium wellness platform dedicated to helping you live with greater awareness, natural vitality, and purpose. We unite ancient botanical wisdom with modern biological science to elevate your daily existence.
              </p>
            </TextReveal>

            <TextReveal delay={0.3}>
              <p className="text-sm sm:text-base text-[#0A2342]/75 font-light leading-relaxed">
                We believe in conscious living, mindful daily habits, and pure natural formulations to help you thrive from within.
              </p>
            </TextReveal>

            <TextReveal delay={0.4} className="pt-2">
              <Button to="/about" variant="secondary" icon>
                Our Philosophy
              </Button>
            </TextReveal>
          </div>

          {/* Right Column: Visual Composition */}
          <div className="lg:col-span-6 relative">
            <TextReveal delay={0.2}>
              <div className="relative rounded-t-full overflow-hidden shadow-xs border border-[#B87333]/30 aspect-[4/5] max-w-md mx-auto lg:max-w-none">
                <img
                  src={brandBotanical}
                  alt="Botanical plant leaves representing natural vitality"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </TextReveal>

            {/* Subtle floating quote card */}
            <TextReveal delay={0.5} className="absolute -bottom-6 -left-4 sm:left-4 max-w-xs bg-[#FAF9F6] p-5 rounded-xs shadow-md border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 hidden sm:block">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                <span className="text-xs uppercase tracking-widest text-[#B87333] font-semibold">
                  Pure Vitality
                </span>
              </div>
              <p className="font-serif text-sm text-[#0A2342] italic">
                "Conscious living for a brighter, healthier future."
              </p>
            </TextReveal>
          </div>

        </div>

      </div>
    </section>
  );
};
