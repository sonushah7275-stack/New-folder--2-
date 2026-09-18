import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Sun } from 'lucide-react';
import heroLandscape from '../../assets/images/hero-landscape.svg';

export const Hero = () => {
  return (
    <section className="relative bg-[#F5F3EF] text-[#0A2342] pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-36 lg:pb-24 overflow-hidden">
      
      {/* Subtle Ambient Background Accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-[#B87333]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Text & Content (Cols 1-7 on lg) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#FAF9F6] border border-[#B87333]/30 shadow-xs mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B87333]" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#B87333]">
                TEJOVA — Conscious Living
              </span>
            </motion.div>

            {/* Main Heading H1: 48px–72px desktop */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-[72px] font-medium tracking-tight leading-[1.08] mb-6 text-[#0A2342]"
            >
              Expand Your <span className="italic font-normal text-[#B87333]">Light.</span>
            </motion.h1>

            {/* Supporting Copy: 16px–18px (~1.6 line height) */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-[#0A2342]/85 leading-relaxed max-w-xl mb-8 font-normal"
            >
              Elevate your daily harmony with pure, natural vitality and conscious wellness rituals. Rooted in ancient wisdom, refined for modern living.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10"
            >
              <Button to="/products" variant="primary" size="lg" icon className="w-full sm:w-auto">
                Begin Your Journey
              </Button>
              <Button to="/about" variant="secondary" size="lg" className="w-full sm:w-auto">
                Discover TEJOVA
              </Button>
            </motion.div>

            {/* Subtle Feature Highlights in Copper/Midnight */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-6 border-t border-[#B87333]/20 w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#0A2342]/80 uppercase tracking-wider font-medium"
            >
              <div className="flex items-center space-x-2">
                <Leaf className="w-4 h-4 text-[#B87333] shrink-0" />
                <span>100% Pure Ingredients</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4 text-[#B87333] shrink-0" />
                <span>Ancient Wisdom</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#B87333] shrink-0" />
                <span>Conscious Living</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Visual Frame (Cols 8-12 on lg) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#B87333]/30 bg-[#FAF9F6]"
            >
              <div className="aspect-4/5 sm:aspect-4/3 lg:aspect-4/5 w-full overflow-hidden relative">
                <img
                  src={heroLandscape}
                  alt="Serene nature landscape representing TEJOVA conscious vitality"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2342]/60 via-transparent to-transparent" />
              </div>

              {/* Floating Overlay Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#0A2342]/90 backdrop-blur-md border border-[#B87333]/40 text-white flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-medium">Holistic Wellness</p>
                  <p className="text-sm font-serif font-medium text-white/95">Pure Vitality & Longevity</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#D4AF37] text-[#0A2342] flex items-center justify-center shrink-0 shadow-sm">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>

    </section>
  );
};
