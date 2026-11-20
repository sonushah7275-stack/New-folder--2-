import React from 'react';
import { useSelector } from 'react-redux';
import { TextReveal } from '../common/TextReveal';
import { Button } from '../common/Button';
import nourishmentBowl from '../../assets/images/nourishment-bowl.svg';

export const NourishmentSection = () => {
  const { pagesMap } = useSelector((state) => state.content);
  const homePage = pagesMap?.home;
  const sec = homePage?.sections?.find(
    (s) => s.sectionId === "sec_nourishment" || s.type === "nourishment"
  );

  if (sec && sec.isVisible === false) {
    return null;
  }

  const kicker = sec?.kicker || "Pillar 02";
  const title = sec?.title || "Nourishment";
  const subtitle = sec?.subtitle || "Real Food. Lasting Health.";
  const content =
    sec?.content ||
    "Whole foods, natural nutrition, and conscious eating fuel your body, balance your microbiome, and support long-term cellular resilience.";
  const ctaText = sec?.cta?.text || "Explore Nourishment";
  const ctaUrl = sec?.cta?.url || "/nourishment";
  const mediaUrl = sec?.media?.url || sec?.mediaUrl || sec?.image || nourishmentBowl;
  const isVideo = sec?.media?.resourceType === "video";
  const altText = sec?.media?.alt || "Fresh organic whole food bowl symbolizing natural nourishment";

  const badgeRaw = sec?.badge || "Conscious Food | Microbiome & metabolic balance";
  const badgeParts = badgeRaw.includes("|")
    ? badgeRaw.split("|").map((p) => p.trim())
    : [badgeRaw, "Microbiome & metabolic balance"];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <TextReveal delay={0.1}>
              <span className="text-xs uppercase tracking-[0.25em] text-[#B87333] font-semibold block">
                {kicker}
              </span>
            </TextReveal>

            <TextReveal delay={0.2}>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-[#0A2342] font-medium tracking-tight">
                {title}
              </h2>
              {subtitle && (
                <h3 className="text-lg text-[#B87333] font-serif italic mt-1">
                  {subtitle}
                </h3>
              )}
            </TextReveal>

            <TextReveal delay={0.3}>
              <p className="text-base sm:text-lg text-[#0A2342]/85 font-light leading-relaxed">
                {content}
              </p>
            </TextReveal>

            <TextReveal delay={0.4} className="pt-2">
              <Button to={ctaUrl} variant="secondary" icon>
                {ctaText}
              </Button>
            </TextReveal>
          </div>

          {/* Right Wide Image */}
          <div className="lg:col-span-7 relative order-1 lg:order-2">
            <TextReveal>
              <div className="aspect-[16/10] overflow-hidden rounded-xs border border-[#B87333]/30 shadow-xs bg-[#FAF9F6]">
                {isVideo ? (
                  <video
                    src={mediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt={altText}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                )}
              </div>
            </TextReveal>

            {/* Accent badge */}
            {badgeParts[0] && (
              <div className="absolute bottom-6 left-6 bg-[#FAF9F6] px-5 py-3 rounded-xs border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 shadow-sm hidden sm:block">
                <span className="text-xs uppercase tracking-wider text-[#B87333] font-semibold block">
                  {badgeParts[0]}
                </span>
                {badgeParts[1] && (
                  <span className="text-xs text-[#0A2342]/90">
                    {badgeParts[1]}
                  </span>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
