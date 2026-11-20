import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { fetchPublicContent, fetchPageBySlug } from "../Redux/slices/contentSlice";
import { fetchPublicSettings } from "../Redux/slices/settingsSlice";
import { fetchPillars } from "../Redux/slices/pillarSlice";

// Component registry for dynamic section rendering
const SECTION_COMPONENTS = {
  brand_story: BrandIntro,
  four_pillars: PillarSection,
  vitality: VitalitySection,
  nourishment: NourishmentSection,
  lifestyle: LifestyleSection,
  longevity: LongevitySection,
  products: ProductSection,
  journal: JournalSection,
  cta: CTASection,
};

// Default fallback ordering
const DEFAULT_SECTION_ORDER = [
  { type: "brand_story", id: "sec_brand_story" },
  { type: "four_pillars", id: "sec_four_pillars" },
  { type: "vitality", id: "sec_vitality" },
  { type: "nourishment", id: "sec_nourishment" },
  { type: "lifestyle", id: "sec_lifestyle" },
  { type: "longevity", id: "sec_longevity" },
  { type: "products", id: "sec_products" },
  { type: "journal", id: "sec_journal" },
  { type: "cta", id: "sec_cta" },
];

export const HomePage = () => {
  const dispatch = useDispatch();
  const { pagesMap } = useSelector((state) => state.content);
  const homePage = pagesMap?.home;

  useEffect(() => {
    dispatch(fetchPublicContent());
    dispatch(fetchPageBySlug("home"));
    dispatch(fetchPublicSettings());
    dispatch(fetchPillars());
  }, [dispatch]);

  const renderedSections = useMemo(() => {
    const rawSections = homePage?.sections;

    // If CMS sections are loaded, use them ordered by `order`
    if (Array.isArray(rawSections) && rawSections.length > 0) {
      // Exclude entry_sequence and announcement which are handled outside body grid
      const contentSections = rawSections
        .filter(
          (s) =>
            s.isVisible !== false &&
            s.type !== "entry_sequence" &&
            s.type !== "announcement" &&
            (SECTION_COMPONENTS[s.type] || SECTION_COMPONENTS[s.sectionId])
        )
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      // If matched at least one registered section, use dynamic list
      if (contentSections.length > 0) {
        const seenComponents = new Set();
        const deduplicated = [];
        for (const sec of contentSections) {
          const Comp = SECTION_COMPONENTS[sec.type] || SECTION_COMPONENTS[sec.sectionId];
          if (Comp && !seenComponents.has(Comp)) {
            seenComponents.add(Comp);
            deduplicated.push({
              key: sec.sectionId || sec.type,
              Component: Comp,
            });
          }
        }
        return deduplicated;
      }
    }

    // Default static fallback while loading or if no CMS sections configured
    return DEFAULT_SECTION_ORDER.map((item) => ({
      key: item.id,
      Component: SECTION_COMPONENTS[item.type],
    }));
  }, [homePage]);

  const showHero = homePage?.hero?.isVisible !== false;

  return (
    <main className="min-h-screen bg-[#F5F3EF] overflow-hidden">
      <EntryExperience />
      {showHero && <Hero />}
      {renderedSections.map(({ key, Component }) => (
        <div key={key} className="border-t border-[#B87333]/30">
          <Component />
        </div>
      ))}
    </main>
  );
};
export default HomePage;
