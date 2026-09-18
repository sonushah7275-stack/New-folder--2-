import React from 'react';
import { Link } from 'react-router-dom';
import brandBotanical from '../../assets/images/brand-botanical.svg';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-[#FAF9F6] rounded-xs border border-[#B87333]/20 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* Left Column: Brand Nature Imagery (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-[#0A2342] text-white p-12 flex-col justify-between overflow-hidden">
          {/* Background Nature Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={brandBotanical}
              alt="TEJOVA Nature Imagery"
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2342] via-[#0A2342]/70 to-transparent" />
          </div>

          {/* Top Logo */}
          <div className="relative z-10">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl tracking-widest uppercase block text-white">TEJOVA</span>
              <span className="text-[9px] tracking-[0.25em] text-[#B87333] uppercase block font-light">
                Expand Your Light
              </span>
            </Link>
          </div>

          {/* Center Quote */}
          <div className="relative z-10 space-y-4 my-auto py-12">
            <span className="text-xs uppercase tracking-[0.25em] text-[#B87333] font-semibold block">
              Conscious Living
            </span>
            <p className="font-serif text-2xl leading-relaxed italic text-white/95">
              "A healthier, brighter tomorrow begins with mindful choices today."
            </p>
          </div>

          {/* Bottom Footer */}
          <div className="relative z-10 text-xs text-white/60 font-light">
            &copy; {new Date().getFullYear()} TEJOVA Platform
          </div>
        </div>

        {/* Right Column: Form Container */}
        <div className="lg:col-span-7 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-[#FAF9F6]">
          <div className="max-w-md w-full mx-auto">
            {/* Mobile Header Logo */}
            <div className="lg:hidden text-center mb-8">
              <Link to="/" className="inline-block">
                <span className="font-serif text-3xl tracking-wider uppercase text-[#0A2342]">TEJOVA</span>
                <span className="text-[9px] tracking-[0.25em] text-[#B87333] uppercase block font-light">
                  Expand Your Light
                </span>
              </Link>
            </div>

            <div className="mb-8 text-center lg:text-left">
              <h1 className="font-serif text-3xl sm:text-4xl text-[#0A2342] mb-2">{title}</h1>
              {subtitle && <p className="text-sm text-[#5C6B73] font-light">{subtitle}</p>}
            </div>

            {children}
          </div>
        </div>

      </div>
    </div>
  );
};
