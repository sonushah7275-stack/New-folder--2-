import React from 'react';
import { useSelector } from 'react-redux';
import { pillars as staticPillars } from '../../data/pillars';
import { PillarCard } from './PillarCard';
import { SectionHeading } from '../common/SectionHeading';
import { TextReveal } from '../common/TextReveal';

export const PillarSection = () => {
  const { pagesMap } = useSelector((state) => state.content);
  const homePage = pagesMap?.home;
  const pillarSec = homePage?.sections?.find(
    (s) => (s.type === "four_pillars" || s.sectionId === "sec_four_pillars") && s.isVisible !== false
  );

  const sectionSubtitle = pillarSec?.subtitle || "A COMPLETE APPROACH";
  const sectionTitle = pillarSec?.title || "Built Upon Four Pillars";
  const sectionDesc =
    pillarSec?.content ||
    "We view wellbeing through four interconnected dimensions that work together to create a vibrant life.";

  const displayPillars =
    pillarSec?.items && pillarSec.items.length > 0
      ? pillarSec.items.map((item) => ({
          id: item.id || item.link?.replace('/', '') || 'pillar',
          kicker: item.kicker,
          title: item.title,
          tagline: item.subtitle,
          description: item.description,
          heroImage: item.image,
          link: item.link || `/${item.title?.toLowerCase()}`,
        }))
      : staticPillars;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          subtitle={sectionSubtitle}
          title={sectionTitle}
          description={sectionDesc}
        />

        {/* 4 Card Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPillars.map((pillar, idx) => (
            <TextReveal key={pillar.id || idx} delay={idx * 0.1}>
              <PillarCard pillar={pillar} />
            </TextReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
