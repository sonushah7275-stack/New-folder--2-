import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import { ChevronDown } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      
      {/* Background Cinematic Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop"
          alt="Natural landscape showing serenity and light"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000 ease-out"
        />
        {/* Soft Dark Overlay for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center text-white pt-12 pb-20">
        
        {/* Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#A7B99F] font-medium">
            TEJOVA — Conscious Living Platform
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-tight leading-[1.05] mb-6 text-white text-shadow-sm"
        >
          Expand Your Light
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl font-light text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Conscious living. Natural vitality. <br className="hidden sm:inline" />
          A healthier, brighter tomorrow.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <Button to="/products" variant="primary" size="lg" icon className="w-full sm:w-auto">
            Begin Your Journey
          </Button>
          <Button to="/about" variant="light" size="lg" className="w-full sm:w-auto">
            Discover TEJOVA
          </Button>
        </motion.div>

      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer text-white/70 hover:text-white transition-colors"
        onClick={() => window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' })}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] mb-1 font-light">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.div>

    </section>
  );
};
