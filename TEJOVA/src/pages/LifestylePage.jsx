import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { pillars as staticPillars } from "../data/pillars";
import { articles as staticArticles } from "../data/articles";
import { SectionHeading } from "../components/common/SectionHeading";
import { ArticleGrid } from "../components/journal/ArticleGrid";
import { TextReveal } from "../components/common/TextReveal";
import { Button } from "../components/common/Button";
import { Compass, Wind, Moon, ArrowRight } from "lucide-react";
import { fetchPillars } from "../Redux/slices/pillarSlice";
import { fetchArticles } from "../Redux/slices/journalSlice";
import { fetchPageBySlug } from "../Redux/slices/contentSlice";
import DOMPurify from "dompurify";

const DEFAULT_LIFESTYLE_PILLARS = [
  {
    id: "life_pillar_1",
    kicker: "01. BREATH & MIND",
    title: "Cognitive Resilience",
    subtitle: "Mental Clarity",
    description: "Actionable breathwork practices that shift nervous system arousal to immediately improve mental clarity.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "life_pillar_2",
    kicker: "02. CHRONOBIOLOGY",
    title: "Circadian Alignment",
    subtitle: "Hormonal Harmony",
    description: "Anchoring your internal biological clock to natural light cycles to optimize hormone secretion and eliminate chronic fatigue.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "life_pillar_3",
    kicker: "03. ENVIRONMENT",
    title: "Ecological Symbiosis",
    subtitle: "Clean Living",
    description: "Optimizing your internal biology through sustainable, eco-conscious daily habits and clean environmental immersion.",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "life_pillar_4",
    kicker: "04. COMMUNITY",
    title: "Collective Vitality",
    subtitle: "Deep Belonging",
    description: "Redefining longevity through shared community goals, collective joy, and deep relational belonging.",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800",
  },
];

export const LifestylePage = () => {
  const dispatch = useDispatch();
  const { pillars: apiPillars } = useSelector((state) => state.pillar);
  const { articles: apiArticles } = useSelector((state) => state.journal);
  const { pagesMap } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchPillars());
    dispatch(fetchArticles());
    dispatch(fetchPageBySlug("lifestyle"));
  }, [dispatch]);

  const lifestyleCmsPage = pagesMap?.lifestyle;
  const dbPillar = apiPillars.find(
    (p) => p.slug === "lifestyle" || p.name?.toLowerCase() === "lifestyle"
  );
  const fallbackPillar = staticPillars.find((p) => p.id === "lifestyle") || staticPillars[2];

  const heroSubtitle = lifestyleCmsPage?.hero?.subtitle || "Sovereign Lifestyle";
  const heroTitle = lifestyleCmsPage?.hero?.title || "Awareness. Growth. Human Potential.";
  const heroDescription =
    lifestyleCmsPage?.hero?.description ||
    dbPillar?.description ||
    fallbackPillar.longDescription;
  const heroMedia =
    lifestyleCmsPage?.hero?.mediaUrl || lifestyleCmsPage?.hero?.media?.url || fallbackPillar.heroImage;

  // "Mindful Architecture" Rich Content Section (styled with Midnight Blue #0A2342 background)
  const richContentSection = lifestyleCmsPage?.sections?.find(
    (s) => s.type === "rich_content" || s.sectionId === "sec_lifestyle_body"
  );

  // The 4 Lifestyle Pillars (sec_lifestyle_pillars)
  const lifestylePillarsSection = lifestyleCmsPage?.sections?.find(
    (s) => (s.sectionId === "sec_lifestyle_pillars" || s.type === "cards") && s.isVisible !== false
  );

  const displayPillars =
    lifestylePillarsSection?.items && lifestylePillarsSection.items.length > 0
      ? lifestylePillarsSection.items.filter((item) => item.isVisible !== false)
      : DEFAULT_LIFESTYLE_PILLARS;

  // Real published Lifestyle journal articles
  const lifestyleArticles = (apiArticles && apiArticles.length > 0 ? apiArticles : staticArticles)
    .filter((a) => {
      const cat = typeof a.category === "object" ? a.category?.name : a.category;
      const catLower = (cat || "").toLowerCase();
      const tags = (a.tags || []).map((t) => (t || "").toLowerCase());
      return (
        catLower === "lifestyle" ||
        catLower === "conscious living" ||
        tags.includes("lifestyle") ||
        tags.includes("conscious living") ||
        catLower.includes("lifestyle")
      );
    })
    .map((a) => ({
      ...a,
      id: a._id || a.id,
      category: typeof a.category === "object" ? a.category?.name || "Lifestyle" : a.category || "Lifestyle",
      image: a.coverImage || a.image || a.featuredImage || "/assets/images/lifestyle-meditation.svg",
    }));

  const displayArticles =
    lifestyleArticles.length > 0
      ? lifestyleArticles
      : (apiArticles && apiArticles.length > 0 ? apiArticles : staticArticles).slice(0, 3).map((a) => ({
          ...a,
          id: a._id || a.id,
          category: typeof a.category === "object" ? a.category?.name || "Lifestyle" : a.category || "Lifestyle",
          image: a.coverImage || a.image || a.featuredImage || "/assets/images/lifestyle-meditation.svg",
        }));

  return (
    <PageContainer>
      {/* Editorial Header */}
      <section className="relative py-14 sm:py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#B87333] font-semibold block">
            {heroSubtitle}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[72px] text-[#0A2342] leading-tight font-medium">
            {heroTitle}
          </h1>
          <p className="text-base sm:text-lg text-[#0A2342]/85 font-light leading-relaxed">
            {heroDescription}
          </p>
          <div className="pt-4 flex justify-center">
            <Button
              to={lifestyleCmsPage?.hero?.ctaLink || "/contact"}
              variant="primary"
              icon
            >
              {lifestyleCmsPage?.hero?.ctaText || "Architect Your Routine"}
            </Button>
          </div>
        </div>

        <div className="mt-14 rounded-xs overflow-hidden border border-[#B87333]/30 shadow-xs aspect-[21/9] max-w-5xl mx-auto bg-[#FAF9F6]">
          <img
            src={heroMedia}
            alt="Conscious lifestyle sunrise in mountains"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Mindful Architecture Section — Midnight Blue (#0A2342) */}
      <section className="py-16 bg-[#0A2342] text-white my-12 border-y border-[#B87333]/30">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-medium block">
            {richContentSection?.kicker || "CONSCIOUS LIVING"}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F5F3EF] font-medium leading-tight">
            {richContentSection?.title || "Mindful Architecture for Daily Operations"}
          </h2>
          <div
            className="font-serif text-lg sm:text-2xl leading-relaxed italic text-[#FAF9F6]/90 max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                richContentSection?.content ||
                  "<p>Build formidable biological resilience and maximise your healthspan by uniting precise circadian alignment, proactive stress regulation, clean environmental living, and deep, purpose-driven community connection.</p>"
              ),
            }}
          />
          <span className="text-xs tracking-widest uppercase text-[#FAF9F6]/60 block font-light">
            — TEJOVA Lifestyle Architecture
          </span>
        </div>
      </section>

      {/* The 4 Pillars of Conscious Lifestyle (CMS sec_lifestyle_pillars) */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle={lifestylePillarsSection?.subtitle || "LIFESTYLE ARCHITECTURE"}
          title={lifestylePillarsSection?.title || "The 4 Pillars of Conscious Lifestyle"}
          description={lifestylePillarsSection?.kicker || "Unite circadian rhythm, autonomic breath, clean ecology, and collective vitality."}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPillars.map((item, idx) => (
            <TextReveal
              key={item.id || item.title}
              delay={idx * 0.1}
              className="bg-[#FAF9F6] rounded-xs border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              {item.image && (
                <div className="aspect-[16/10] overflow-hidden bg-[#F5F3EF]">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#B87333] block">
                    {item.kicker || `0${idx + 1}. PILLAR`}
                  </span>
                  <h3 className="font-serif text-2xl text-[#0A2342] font-medium leading-tight">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-xs font-serif italic text-[#B87333]">
                      {item.subtitle}
                    </p>
                  )}
                  <p className="text-sm text-[#0A2342]/75 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#B87333]/15">
                  <Link
                    to="/blog"
                    className="text-xs font-semibold uppercase tracking-wider text-[#0A2342] hover:text-[#B87333] inline-flex items-center gap-1.5 transition-colors"
                  >
                    Explore Protocol <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </TextReveal>
          ))}
        </div>
      </section>

      {/* 3 Rituals of Conscious Living (Preserved Lifestyle Rituals) */}
      <section className="py-16 sm:py-20 bg-[#FAF9F6] border-y border-[#B87333]/30 my-12 sm:my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Inner Alignment"
            title="The 3 Rituals of Conscious Living"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {fallbackPillar.highlights.map((item, idx) => (
              <TextReveal
                key={item.title}
                delay={idx * 0.1}
                className="bg-[#FAF9F6] p-7 sm:p-8 rounded-xs border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 space-y-4 shadow-xs"
              >
                <div className="w-10 h-10 rounded-full bg-[#0A2342] text-[#D4AF37] flex items-center justify-center shrink-0">
                  {idx === 0 ? (
                    <Compass className="w-5 h-5" />
                  ) : idx === 1 ? (
                    <Wind className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </div>
                <h3 className="font-serif text-2xl text-[#0A2342]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#0A2342]/75 font-light leading-relaxed">
                  {item.desc}
                </p>
              </TextReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Expanded Journal Editorial Feature (No ProductGrid) */}
      <section className="py-16 sm:py-20 border-t border-[#B87333]/20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="From The Journal"
          title="Mindfulness, Growth & Lifestyle Stories"
          description="Actionable wisdom for executive chronobiology, conscious environments, and inner stillness."
        />
        <ArticleGrid articles={displayArticles} />
      </section>
    </PageContainer>
  );
};
