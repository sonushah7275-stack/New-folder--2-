import React from 'react';
import { useSelector } from 'react-redux';
import { TextReveal } from '../common/TextReveal';
import { Button } from '../common/Button';
import brandBotanical from '../../assets/images/brand-botanical.svg';

export const BrandIntro = () => {
  const { pagesMap } = useSelector((state) => state.content);
  const homePage = pagesMap?.home;
  const sec = homePage?.sections?.find((s) => s.type === "brand_philosophy");

  const title = sec?.title || "Beyond Wellness. A Sovereign Lifestyle.";
  const subtitle = sec?.subtitle || sec?.kicker || "BRAND PHILOSOPHY";
  const contentHtml = sec?.content || "<p>TEJOVA is a premium performance protocol dedicated to engineering your ultimate state of being. We unite ancient yogic wisdom with modern biological science to elevate your daily existence through our four core pillars: Vitality, Nourishment, Lifestyle, and Longevity.</p><p>We believe true luxury is a highly functioning body and a calm, commanding mind. By integrating conscious daily habits and pure, natural nourishment, we help you reclaim your life force and thrive from within.</p>";
  const ctaText = sec?.cta?.text || "Discover Our Protocol →";
  const ctaUrl = sec?.cta?.url || "/vitality";
  const mediaUrl = sec?.media?.url || brandBotanical;
  const badgeText = sec?.badge || "PEAK VITALITY";

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F3EF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Story Content */}
          <div className="lg:col-span-6 space-y-6">
            <TextReveal>
              <span className="text-xs uppercase tracking-[0.25em] text-[#B87333] font-semibold block">
                {subtitle}
              </span>
            </TextReveal>

            <TextReveal delay={0.1}>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-[#0A2342] leading-tight font-medium">
                {title}
              </h2>
            </TextReveal>

            <TextReveal delay={0.2}>
              <div
                className="text-base sm:text-lg text-[#0A2342]/85 font-light leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </TextReveal>

            <TextReveal delay={0.4} className="pt-2">
              <Button to={ctaUrl} variant="secondary" icon>
                {ctaText}
              </Button>
            </TextReveal>
          </div>

          {/* Right Column: Visual Composition */}
          <div className="lg:col-span-6 relative">
            <TextReveal delay={0.2}>
              <div className="relative rounded-t-full overflow-hidden shadow-xs border border-[#B87333]/30 aspect-[4/5] max-w-md mx-auto lg:max-w-none">
                <img
                  src={mediaUrl}
                  alt="Botanical plant leaves representing natural vitality"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </TextReveal>

            {/* Floating accent box */}
            <TextReveal delay={0.5} className="absolute -bottom-6 -left-4 sm:left-4 max-w-xs bg-[#FAF9F6] p-5 rounded-xs shadow-md border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 hidden sm:block">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                <span className="text-xs uppercase tracking-widest text-[#B87333] font-semibold">
                  {badgeText}
                </span>
              </div>
              <p className="font-serif text-sm text-[#0A2342] italic">
                "Definitive performance built into your daily operations."
              </p>
            </TextReveal>
          </div>

        </div>

      </div>
    </section>
  );
};
