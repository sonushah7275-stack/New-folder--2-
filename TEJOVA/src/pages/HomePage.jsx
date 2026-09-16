import React from 'react';
import { EntryExperience } from '../components/home/EntryExperience';
import { Hero } from '../components/home/Hero';
import { BrandIntro } from '../components/home/BrandIntro';
import { PillarSection } from '../components/home/PillarSection';
import { VitalitySection } from '../components/home/VitalitySection';
import { NourishmentSection } from '../components/home/NourishmentSection';
import { LifestyleSection } from '../components/home/LifestyleSection';
import { LongevitySection } from '../components/home/LongevitySection';
import { ProductSection } from '../components/home/ProductSection';
import { JournalSection } from '../components/home/JournalSection';
import { CTASection } from '../components/home/CTASection';

export const HomePage = () => {
  return (
    <main className="min-h-screen bg-[#F7F3E9] overflow-hidden">
      <EntryExperience />
      <Hero />
      <BrandIntro />
      <PillarSection />
      <VitalitySection />
      <NourishmentSection />
      <LifestyleSection />
      <LongevitySection />
      <ProductSection />
      <JournalSection />
      <CTASection />
    </main>
  );
};
