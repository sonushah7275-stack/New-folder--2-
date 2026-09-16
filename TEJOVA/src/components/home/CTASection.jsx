import React from 'react';
import { Button } from '../common/Button';
import { TextReveal } from '../common/TextReveal';

export const CTASection = () => {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000&auto=format&fit=crop"
          alt="Majestic sunrise over mountain peaks"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <TextReveal>
          <span className="text-xs uppercase tracking-[0.3em] text-[#A7B99F] font-medium block mb-4">
            Embrace Your Potential
          </span>
        </TextReveal>

        <TextReveal delay={0.1}>
          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal leading-tight mb-6">
            Your best years are ahead of you.
          </h2>
        </TextReveal>

        <TextReveal delay={0.2}>
          <p className="text-base sm:text-xl font-light text-white/80 max-w-xl mx-auto mb-10 leading-relaxed">
            Explore TEJOVA and take the first step on your journey toward natural vitality, conscious living, and purpose.
          </p>
        </TextReveal>

        <TextReveal delay={0.3}>
          <Button to="/products" variant="light" size="lg" icon>
            Begin Your Journey
          </Button>
        </TextReveal>
      </div>

    </section>
  );
};
