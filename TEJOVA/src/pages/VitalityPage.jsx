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
import { ShieldCheck, ArrowRight } from "lucide-react";
import { fetchPillars } from "../Redux/slices/pillarSlice";
import { fetchArticles } from "../Redux/slices/journalSlice";
import { fetchPageBySlug } from "../Redux/slices/contentSlice";

const DEFAULT_VITALITY_DISCIPLINES = [
  {
    id: "vit_pillar_1",
    kicker: "1. YOGA",
    title: "Sovereign Yoga",
    subtitle: "Structural Alignment",
    description: "Decompress the spine and unlock structural mobility to reverse daily sedentary wear.",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "vit_pillar_2",
    kicker: "2. BREATH",
    title: "Autonomic Breath",
    subtitle: "Nervous System Command",
    description: "Regulate your nervous system to instantly clear stress and restore focus.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "vit_pillar_3",
    kicker: "3. HEALTH",
    title: "Cellular Health",
    subtitle: "Metabolic Repair",
    description: "Fuel natural cellular repair and metabolic rest to maximize your disease-free years.",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "vit_pillar_4",
    kicker: "4. FITNESS",
    title: "Adaptive Fitness",
    subtitle: "Physical Resilience",
    description: "Build muscle, bone density, and vital stamina to ensure lifelong independence.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800",
  },
];

export const VitalityPage = () => {
  const dispatch = useDispatch();
  const { pillars: apiPillars } = useSelector((state) => state.pillar);
  const { articles: apiArticles } = useSelector((state) => state.journal);
  const { pagesMap } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchPillars());
    dispatch(fetchArticles());
    dispatch(fetchPageBySlug("vitality"));
  }, [dispatch]);

  const vitalityCmsPage = pagesMap?.vitality;
  const dbPillar = apiPillars.find(
    (p) => p.slug === "vitality" || p.name?.toLowerCase() === "vitality"
  );
  const fallbackPillar = staticPillars.find((p) => p.id === "vitality") || staticPillars[0];

  const heroSubtitle = vitalityCmsPage?.hero?.subtitle || "Vitality Protocol";
  const heroTitle = vitalityCmsPage?.hero?.title || "Master Your Physical Sovereignty. Unleash Your Vitality.";
  const heroDescription =
    vitalityCmsPage?.hero?.description ||
    dbPillar?.description ||
    fallbackPillar.longDescription;
  const heroMedia =
    vitalityCmsPage?.hero?.mediaUrl || vitalityCmsPage?.hero?.media?.url || fallbackPillar.heroImage;

  // Extract CMS foundations section (The 4 Sovereign Disciplines)
  const foundationsSection = vitalityCmsPage?.sections?.find(
    (s) => (s.sectionId === "sec_vitality_foundations" || s.type === "cards") && s.isVisible !== false
  );

  const displayDisciplines =
    foundationsSection?.items && foundationsSection.items.length > 0
      ? foundationsSection.items.filter((item) => item.isVisible !== false)
      : DEFAULT_VITALITY_DISCIPLINES;

  // Extract CMS protocol_cards section items (Daily Protocols)
  const protocolCardsSection = vitalityCmsPage?.sections?.find(
    (s) => (s.type === "protocol_cards" || s.sectionId === "sec_vitality_protocols") && s.isVisible !== false
  );

  const displayProtocols =
    protocolCardsSection?.items && protocolCardsSection.items.length > 0
      ? protocolCardsSection.items.filter((item) => item.isVisible !== false).map((item) => ({
          time: item.kicker || item.tag || "DAILY",
          title: item.title,
          desc: item.description || item.subtitle,
          image: item.image,
        }))
      : fallbackPillar.practices;

  // Real published Vitality journal articles
  const vitalityArticles = (apiArticles && apiArticles.length > 0 ? apiArticles : staticArticles)
    .filter((a) => {
      const cat = typeof a.category === "object" ? a.category?.name : a.category;
      const catLower = (cat || "").toLowerCase();
      const tags = (a.tags || []).map((t) => (t || "").toLowerCase());
      return (
        catLower === "vitality" ||
        tags.includes("vitality") ||
        catLower.includes("vitality")
      );
    })
    .map((a) => ({
      ...a,
      id: a._id || a.id,
      category: typeof a.category === "object" ? a.category?.name || "Vitality" : a.category || "Vitality",
      image: a.coverImage || a.image || a.featuredImage || "/assets/images/lifestyle-meditation.svg",
    }));

  const displayArticles =
    vitalityArticles.length > 0
      ? vitalityArticles
      : (apiArticles && apiArticles.length > 0 ? apiArticles : staticArticles).slice(0, 3).map((a) => ({
          ...a,
          id: a._id || a.id,
          category: typeof a.category === "object" ? a.category?.name || "Vitality" : a.category || "Vitality",
          image: a.coverImage || a.image || a.featuredImage || "/assets/images/lifestyle-meditation.svg",
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
              <Button to={vitalityCmsPage?.hero?.ctaLink || "/contact"} variant="primary" icon>
                {vitalityCmsPage?.hero?.ctaText || "Explore Vitality Protocol"}
              </Button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="aspect-[4/3] rounded-xs overflow-hidden border border-[#B87333]/30 shadow-xs bg-[#FAF9F6]">
              <img
                src={heroMedia}
                alt="Vitality Hero visual"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Sovereign Disciplines (CMS sec_vitality_foundations) */}
      <section className="py-16 sm:py-20 bg-[#FAF9F6] border-y border-[#B87333]/30 my-12 sm:my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle={foundationsSection?.subtitle || "BIOLOGICAL FOUNDATION"}
            title={foundationsSection?.title || "The 4 Sovereign Disciplines"}
            description={
              foundationsSection?.content ||
              "Integrate the four essential disciplines—Yoga, Breath, Health, and Fitness—for a definitive performance protocol built for longevity."
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayDisciplines.map((item, idx) => (
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
                      {item.kicker || `0${idx + 1}. DISCIPLINE`}
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
        </div>
      </section>

      {/* Daily Protocols Section (Preserved sec_vitality_protocols) */}
      <section className="py-14 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle={protocolCardsSection?.kicker || "Daily Protocols"}
          title={protocolCardsSection?.title || "Recommended Rituals"}
          description={protocolCardsSection?.subtitle || "Simple routines to integrate into your morning and afternoon."}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {displayProtocols.map((practice, idx) => (
            <TextReveal
              key={practice.title}
              delay={idx * 0.1}
              className="bg-[#FAF9F6] p-6 sm:p-8 rounded-xs border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 flex flex-col justify-between gap-4 shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#B87333]">
                    {practice.time}
                  </span>
                  <ShieldCheck className="w-6 h-6 text-[#B87333]/60" />
                </div>
                <h4 className="font-serif text-xl sm:text-2xl text-[#0A2342]">
                  {practice.title}
                </h4>
                <p className="text-sm text-[#0A2342]/75 font-light leading-relaxed">
                  {practice.desc}
                </p>
              </div>
              {practice.image && (
                <div className="mt-2 aspect-[16/9] rounded-xs overflow-hidden border border-[#B87333]/20">
                  <img src={practice.image} alt={practice.title} className="w-full h-full object-cover" />
                </div>
              )}
            </TextReveal>
          ))}
        </div>
      </section>

      {/* Expanded Journal Editorial Feature (No ProductGrid) */}
      <section className="py-16 sm:py-20 border-t border-[#B87333]/20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="From The Journal"
          title="Further Reading on Vitality & Human Stamina"
          description="Evidence-based editorial guidance, circadian habits, and biological sovereign protocols."
        />
        <ArticleGrid articles={displayArticles} />
      </section>
    </PageContainer>
  );
};
