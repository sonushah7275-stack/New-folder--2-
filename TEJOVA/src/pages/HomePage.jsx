import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { EntryExperience } from "../components/home/EntryExperience";
import { Hero } from "../components/home/Hero";
import { BrandIntro } from "../components/home/BrandIntro";
import { PillarSection } from "../components/home/PillarSection";
import { VitalitySection } from "../components/home/VitalitySection";
import { NourishmentSection } from "../components/home/NourishmentSection";
import { LifestyleSection } from "../components/home/LifestyleSection";
import { LongevitySection } from "../components/home/LongevitySection";
import { ProductSection } from "../components/home/ProductSection";
import { JournalSection } from "../components/home/JournalSection";
import { CTASection } from "../components/home/CTASection";
import { fetchPublicContent } from "../Redux/slices/contentSlice";
import { fetchPublicSettings } from "../Redux/slices/settingsSlice";
import { fetchPillars } from "../Redux/slices/pillarSlice";

export const HomePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPublicContent());
    dispatch(fetchPublicSettings());
    dispatch(fetchPillars());
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-[#F5F3EF] overflow-hidden">
      <EntryExperience />
      <Hero />
      <div className="border-t border-[#B87333]/30">
        <BrandIntro />
      </div>
      <div className="border-t border-[#B87333]/30">
        <PillarSection />
      </div>
      <div className="border-t border-[#B87333]/30">
        <VitalitySection />
      </div>
      <div className="border-t border-[#B87333]/30">
        <NourishmentSection />
      </div>
      <div className="border-t border-[#B87333]/30">
        <LifestyleSection />
      </div>
      <div className="border-t border-[#B87333]/30">
        <LongevitySection />
      </div>
      <div className="border-t border-[#B87333]/30">
        <ProductSection />
      </div>
      <div className="border-t border-[#B87333]/30">
        <JournalSection />
      </div>
      <div className="border-t border-[#B87333]/30">
        <CTASection />
      </div>
    </main>
  );
};
