import React from 'react';
import { Button } from '../common/Button';
import { TextReveal } from '../common/TextReveal';

export const CTASection = () => {
  return (
    <section className="relative py-24 sm:py-28 lg:py-32 overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000&auto=format&fit=crop"
          alt="Majestic sunrise over mountain peaks"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#0A2342]/85 backdrop-blur-xs" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <TextReveal>
          <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-medium block mb-4">
            Embrace Your Potential
          </span>
        </TextReveal>

        <TextReveal delay={0.1}>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-6 text-white">
            Your best years are ahead of you.
          </h2>
        </TextReveal>

        <TextReveal delay={0.2}>
          <p className="text-base sm:text-lg lg:text-xl font-light text-white/85 max-w-xl mx-auto mb-10 leading-relaxed">
            Explore TEJOVA and take the first step on your journey toward natural vitality, conscious living, and purpose.
          </p>
        </TextReveal>

        <TextReveal delay={0.3}>
          <Button to="/products" variant="primary" size="lg" icon>
            Begin Your Journey
          </Button>
        </TextReveal>
      </div>

    </section>
  );
};
