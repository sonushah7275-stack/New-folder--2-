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
import { Shield, RefreshCw, Feather, ArrowRight } from "lucide-react";
import { fetchPillars } from "../Redux/slices/pillarSlice";
import { fetchArticles } from "../Redux/slices/journalSlice";
import { fetchPageBySlug } from "../Redux/slices/contentSlice";
import DOMPurify from "dompurify";

const DEFAULT_LONGEVITY_PILLARS = [
  {
    id: "long_pillar_1",
    kicker: "01. METABOLIC HEALTH",
    title: "Nutrition and Metabolic Health",
    subtitle: "Cellular Repair",
    description: "Our protocol employs plant-aligned whole foods, time-restricted eating and proactive caloric control to repair your cellular architecture, sustain elite cognitive energy, and defend against lifestyle diseases.",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "long_pillar_2",
    kicker: "02. RECOVERY & REST",
    title: "Regeneration & Deep Recovery",
    subtitle: "Systemic Resilience",
    description: "Our recovery protocol balances deep regenerative rest with controlled environmental stress to repair your cellular architecture, build systemic resilience, and decelerate biological aging.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "long_pillar_3",
    kicker: "03. NEURO-REGULATION",
    title: "Psychological Coherence & Brain Longevity",
    subtitle: "Autonomic Regulation",
    description: "By discharging chronic stress and actively balancing your nervous system, we halt stress-induced aging and protect your lifelong brain health through a calm, regulated mind.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "long_pillar_4",
    kicker: "04. PURPOSE & ECOLOGY",
    title: "Socio-Environmental Connection",
    subtitle: "Healthy Healthspan",
    description: "Our longevity lifestyle extends your healthspan by removing isolation-induced aging through deep community connection, clear life goals and alignment with clean, natural environments.",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800",
  },
];

export const LongevityPage = () => {
  const dispatch = useDispatch();
  const { pillars: apiPillars } = useSelector((state) => state.pillar);
  const { articles: apiArticles } = useSelector((state) => state.journal);
  const { pagesMap } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchPillars());
    dispatch(fetchArticles());
    dispatch(fetchPageBySlug("longevity"));
  }, [dispatch]);

  const longevityCmsPage = pagesMap?.longevity;
  const dbPillar = apiPillars.find(
    (p) => p.slug === "longevity" || p.name?.toLowerCase() === "longevity"
  );
  const fallbackPillar = staticPillars.find((p) => p.id === "longevity") || staticPillars[3];

  const heroSubtitle = longevityCmsPage?.hero?.subtitle || "Longevity Architecture";
  const heroTitle = longevityCmsPage?.hero?.title || "Cellular Restoration & Bio-Energetic Resilience";
  const heroDescription =
    longevityCmsPage?.hero?.description ||
    dbPillar?.description ||
    fallbackPillar.longDescription;
  const heroMedia =
    longevityCmsPage?.hero?.mediaUrl || longevityCmsPage?.hero?.media?.url || fallbackPillar.heroImage;

  // "Longevity Architecture" Rich Content Section (styled with Midnight Blue #0A2342 background)
  const richContentSection = longevityCmsPage?.sections?.find(
    (s) => s.type === "rich_content" || s.sectionId === "sec_longevity_body"
  );

  // The 4 Longevity Pillars (sec_longevity_pillars)
  const longevityPillarsSection = longevityCmsPage?.sections?.find(
    (s) => (s.sectionId === "sec_longevity_pillars" || s.type === "cards") && s.isVisible !== false
  );

  const displayPillars =
    longevityPillarsSection?.items && longevityPillarsSection.items.length > 0
      ? longevityPillarsSection.items.filter((item) => item.isVisible !== false)
      : DEFAULT_LONGEVITY_PILLARS;

  // Real published Longevity journal articles
  const longevityArticles = (apiArticles && apiArticles.length > 0 ? apiArticles : staticArticles)
    .filter((a) => {
      const cat = typeof a.category === "object" ? a.category?.name : a.category;
      const catLower = (cat || "").toLowerCase();
      const tags = (a.tags || []).map((t) => (t || "").toLowerCase());
      return (
        catLower === "longevity" ||
        tags.includes("longevity") ||
        catLower.includes("longevity")
      );
    })
    .map((a) => ({
      ...a,
      id: a._id || a.id,
      category: typeof a.category === "object" ? a.category?.name || "Longevity" : a.category || "Longevity",
      image: a.coverImage || a.image || a.featuredImage || "/assets/images/longevity-forest.svg",
    }));

  const displayArticles =
    longevityArticles.length > 0
      ? longevityArticles
      : (apiArticles && apiArticles.length > 0 ? apiArticles : staticArticles).slice(0, 3).map((a) => ({
          ...a,
          id: a._id || a.id,
          category: typeof a.category === "object" ? a.category?.name || "Longevity" : a.category || "Longevity",
          image: a.coverImage || a.image || a.featuredImage || "/assets/images/longevity-forest.svg",
        }));

  return (
    <PageContainer>
      {/* Editorial Hero */}
      <section className="relative py-14 sm:py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#B87333] font-semibold block">
              {heroSubtitle}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[72px] text-[#0A2342] leading-tight font-medium">
              {heroTitle}
            </h1>
            <p className="text-base sm:text-lg text-[#0A2342]/85 font-light leading-relaxed">
              {heroDescription}
            </p>
            <div className="pt-2">
              <Button to={longevityCmsPage?.hero?.ctaLink || "/contact"} variant="primary" icon>
                {longevityCmsPage?.hero?.ctaText || "Explore Longevity Protocol"}
              </Button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="aspect-[4/3] rounded-xs overflow-hidden border border-[#B87333]/30 shadow-xs bg-[#FAF9F6]">
              <img
                src={heroMedia}
                alt="Timeless forest longevity landscape"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Longevity Architecture Section — Midnight Blue (#0A2342) */}
      <section className="py-16 bg-[#0A2342] text-white my-12 border-y border-[#B87333]/30">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-medium block">
            {richContentSection?.kicker || "HEALTHSPAN MAXIMIZATION"}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F5F3EF] font-medium leading-tight">
            {richContentSection?.title || "The Tejova Longevity Architecture"}
          </h2>
          <div
            className="font-serif text-lg sm:text-2xl leading-relaxed italic text-[#FAF9F6]/90 max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                richContentSection?.content ||
                  "<p>The ultimate goal is not merely lifespan extension, but the absolute maximization of your disease-free healthspan. We focus on unified natural protocols that actively resist cellular decay and unlock human potential.</p>"
              ),
            }}
          />
          <span className="text-xs tracking-widest uppercase text-[#FAF9F6]/60 block font-light">
            — TEJOVA Research & Practice Group
          </span>
        </div>
      </section>

      {/* The 4 Keys to Cellular Longevity (CMS sec_longevity_pillars) */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle={longevityPillarsSection?.subtitle || "LONGEVITY FOUNDATIONS"}
          title={longevityPillarsSection?.title || "The 4 Keys to Cellular Longevity"}
          description={longevityPillarsSection?.kicker || "Proactively defending against cellular decay, metabolic exhaustion, and environmental friction."}
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

      {/* Biological Resilience Keys (Preserved Longevity Highlights) */}
      <section className="py-16 sm:py-20 bg-[#FAF9F6] border-y border-[#B87333]/30 my-12 sm:my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Biological Resilience"
            title="Keys to Cellular Longevity"
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
                    <RefreshCw className="w-5 h-5" />
                  ) : idx === 1 ? (
                    <Feather className="w-5 h-5" />
                  ) : (
                    <Shield className="w-5 h-5" />
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
          title="Epigenetics, Autophagy & Longevity Research"
          description="Exploring biological age biomarkers, sirtuin activation, and natural living principles."
        />
        <ArticleGrid articles={displayArticles} />
      </section>
    </PageContainer>
  );
};
