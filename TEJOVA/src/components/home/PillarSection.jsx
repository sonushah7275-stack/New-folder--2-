import React from 'react';
import { pillars } from '../../data/pillars';
import { PillarCard } from './PillarCard';
import { SectionHeading } from '../common/SectionHeading';
import { TextReveal } from '../common/TextReveal';

export const PillarSection = () => {
  return (
    <section className="py-20 bg-[#F7F3E9] border-t border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          subtitle="Our Foundation"
          title="The Five Pillars"
          description="Five core pillars. One complete, holistic approach to long-term physical, mental and biological wellbeing."
        />

        {/* 5 Card Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {pillars.map((pillar, idx) => (
            <TextReveal key={pillar.id} delay={idx * 0.1}>
              <PillarCard pillar={pillar} />
            </TextReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
