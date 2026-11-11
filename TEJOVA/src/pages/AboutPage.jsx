import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { SectionHeading } from "../components/common/SectionHeading";
import { Button } from "../components/common/Button";
import { TextReveal } from "../components/common/TextReveal";
import { pillars as fallbackPillars } from "../data/pillars";
import { fetchPageBySlug } from "../Redux/slices/contentSlice";
import { ArrowRight, UserCheck } from "lucide-react";
import heroLandscape from "../assets/images/hero-landscape.svg";
import DOMPurify from "dompurify";

export const AboutPage = () => {
  const dispatch = useDispatch();
  const { pagesMap } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchPageBySlug("about"));
  }, [dispatch]);

  const aboutCmsPage = pagesMap?.about;

  // Dynamic Hero
  const heroSubtitle = aboutCmsPage?.hero?.subtitle || "ABOUT TEJOVA";
  const heroTitle = aboutCmsPage?.hero?.title || "Expand Your Light. Rule Your Life.";
  const heroDescription =
    aboutCmsPage?.hero?.description ||
    "Tejova the Architecture of Biological Sovereignty: Architect your ultimate healthspan through our exact pillars of Vitality, Nourishment, Lifestyle, and Longevity with evidence-based, time-efficient nutritional systems designed by experts to fit the demanding schedules of elite leaders.";
  const heroMedia =
    aboutCmsPage?.hero?.mediaUrl ||
    aboutCmsPage?.hero?.media?.url ||
    heroLandscape;
  const heroCtaText = aboutCmsPage?.hero?.ctaText || "Explore Vitality Protocol";
  const heroCtaLink = aboutCmsPage?.hero?.ctaLink || "/vitality";

  // Dynamic CMS Sections
  const sections = aboutCmsPage?.sections || [];

  const philosophySection = sections.find(
    (s) => (s.sectionId === "sec_about_philosophy" || s.type === "brand_philosophy") && s.isVisible !== false
  );

  const commitmentsSection = sections.find(
    (s) => (s.sectionId === "sec_about_commitments" || s.type === "rich_content") && s.isVisible !== false
  );

  const pillarsSection = sections.find(
    (s) => (s.sectionId === "sec_about_pillars" || s.type === "cards") && s.isVisible !== false
  );

  // Additional rich content if added via CMS (e.g. sec_1794271169058)
  const additionalRichSections = sections.filter(
    (s) =>
      s.sectionId !== "sec_about_philosophy" &&
      s.sectionId !== "sec_about_commitments" &&
      s.sectionId !== "sec_about_pillars" &&
      s.isVisible !== false &&
      s.content
  );

  const displayPillars =
    pillarsSection?.items && pillarsSection.items.length > 0
      ? pillarsSection.items.filter((item) => item.isVisible !== false)
      : fallbackPillars;

  return (
    <PageContainer>
      {/* Editorial Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-[#B87333] font-semibold block mb-4">
          {heroSubtitle}
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[72px] text-[#0A2342] leading-tight max-w-4xl mx-auto mb-6 font-medium">
          {heroTitle}
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-[#0A2342]/85 font-light max-w-3xl mx-auto leading-relaxed whitespace-pre-line">
          {heroDescription}
        </p>
        <div className="pt-6 flex justify-center gap-4">
          <Button to={heroCtaLink} variant="primary" icon>
            {heroCtaText}
          </Button>
          <Button to="/blog" variant="secondary">
            Read The Journal
          </Button>
        </div>
      </section>

      {/* Hero Media Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="aspect-[21/9] rounded-xs overflow-hidden border border-[#B87333]/30 shadow-xs bg-[#FAF9F6]">
          <img
            src={heroMedia}
            alt={aboutCmsPage?.hero?.alt || "Sunrise over pristine wilderness"}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Additional Rich Content Sections from CMS (if enabled) */}
      {additionalRichSections.map((sec) => (
        <section key={sec.sectionId} className="py-12 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-[#FAF9F6] p-8 sm:p-12 rounded-xs border border-[#B87333]/30 shadow-xs space-y-4">
            {sec.title && (
              <h2 className="font-serif text-2xl sm:text-3xl text-[#0A2342] font-medium">
                {sec.title}
              </h2>
            )}
            <div
              className="prose max-w-none text-base text-[#0A2342]/85 font-light leading-relaxed"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(sec.content) }}
            />
          </div>
        </section>
      ))}

      {/* Philosophy Section (CMS sec_about_philosophy & sec_about_commitments) */}
      <section className="py-16 sm:py-20 bg-[#FAF9F6] border-y border-[#B87333]/30 my-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* Left: Brand Philosophy */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#B87333] font-semibold block">
                {philosophySection?.subtitle || "THE PHILOSOPHY"}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] text-[#0A2342] leading-tight font-medium">
                {philosophySection?.title || "Expand Your Light"}
              </h2>
              {philosophySection?.content ? (
                <div
                  className="text-base sm:text-lg text-[#0A2342]/85 font-light leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(philosophySection.content) }}
                />
              ) : (
                <>
                  <p className="text-base sm:text-lg text-[#0A2342]/85 font-light leading-relaxed">
                    "Tej" in ancient Sanskrit represents inner radiance, biological brilliance, and vital heat. "Ova" signifies origin and continuous growth. Together, <strong>TEJOVA</strong> embodies the expansion of your innate physical and mental radiance.
                  </p>
                  <p className="text-sm sm:text-base text-[#0A2342]/75 font-light leading-relaxed">
                    Every formulation we create, every article we write, and every ritual we share is designed to nurture your light — helping you show up fully for yourself, your loved ones, and the world around you.
                  </p>
                </>
              )}
            </div>

            {/* Right: Core Commitments */}
            <div className="lg:col-span-6">
              <div className="bg-[#FAF9F6] p-8 md:p-10 rounded-xs border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 shadow-xs space-y-6">
                <span className="text-xs uppercase tracking-widest text-[#B87333] font-semibold block">
                  {commitmentsSection?.subtitle || "STANDARDS OF PURITY"}
                </span>
                <h3 className="font-serif text-2xl text-[#0A2342]">
                  {commitmentsSection?.title || "Our Core Commitments"}
                </h3>
                {commitmentsSection?.content ? (
                  <div
                    className="space-y-4 text-sm sm:text-base text-[#0A2342]/80 font-light leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(commitmentsSection.content) }}
                  />
                ) : (
                  <ul className="space-y-4 text-sm sm:text-base text-[#0A2342]/80 font-light">
                    <li className="flex items-start">
                      <span className="w-2 h-2 rounded-full bg-[#B87333] mt-2 mr-3 shrink-0" />
                      <span><strong>Purity Without Compromise:</strong> Wildcrafted, 100% organic ingredients sourced directly from ethical bio-farms.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 rounded-full bg-[#B87333] mt-2 mr-3 shrink-0" />
                      <span><strong>Biological Synergy:</strong> Formulas designed to complement natural metabolic pathways rather than override them.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 rounded-full bg-[#B87333] mt-2 mr-3 shrink-0" />
                      <span><strong>Mindful Living:</strong> Elevating everyday routines into conscious, grounding daily rituals.</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Advisory Leadership & Practice Group (Archana C Parate) */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A2342] text-[#FAF9F6] p-8 sm:p-12 md:p-16 rounded-xs border-l-4 border-l-[#D4AF37] border-y border-r border-[#B87333]/30 shadow-md">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center space-x-3 text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-medium">
              <UserCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>CLINICAL ADVISORY & PRACTICE GROUP</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#F5F3EF] leading-tight font-medium">
              Restorative Naturopathy & The Tejova Research Group
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-[#FAF9F6]/85 font-light leading-relaxed">
              <p>
                Led by Archana C Parate’s expertise in restorative naturopathy, we believe profound biological shifts come from consistent, natural rhythms, not extreme interventions. While highly targeted supplementation may be utilized for specific deficiencies, our primary mechanism for healing is pure, whole-food nourishment.
              </p>
              <p>
                We translate the theoretical frameworks of nature-based living into practical, daily executive action, prioritizing plant-aligned intelligence over synthetic shortcuts. Archana specializes in translating nature-based living into streamlined, time-efficient systems that integrate seamlessly into a high-pressure executive schedule. You are investing in efficiency—a unified protocol that frees up your decision capital rather than draining it.
              </p>
            </div>

            <div className="pt-4 border-t border-[#B87333]/30 flex flex-wrap items-center justify-between gap-4 text-xs text-[#FAF9F6]/70">
              <span>
                Foundational Center: C-148, Ramana Maroti Nagar, Nagpur, Maharashtra - 440024, India
              </span>
              <Link
                to="/contact"
                className="text-xs uppercase tracking-wider font-semibold text-[#D4AF37] hover:text-[#FAF9F6] inline-flex items-center gap-1.5 transition-colors"
              >
                Inquire for Consultations <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section (CMS sec_about_pillars) */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#B87333]/20">
        <SectionHeading
          subtitle={pillarsSection?.subtitle || "A COMPLETE APPROACH"}
          title={pillarsSection?.title || "Built Upon Five Pillars"}
          description={
            pillarsSection?.content ||
            "We view wellbeing through interconnected dimensions that work together to create a vibrant life."
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {displayPillars.map((p, idx) => (
            <TextReveal
              key={p.id || p.title}
              delay={idx * 0.1}
              className="bg-[#FAF9F6] p-6 rounded-xs border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 space-y-3 shadow-xs hover:shadow-md transition-shadow"
            >
              <span className="text-[10px] uppercase tracking-wider text-[#B87333] font-semibold block">
                {p.subtitle || `PILLAR 0${idx + 1}`}
              </span>
              <h4 className="font-serif text-xl text-[#0A2342] font-medium leading-tight">
                {p.title}
              </h4>
              <p className="text-xs text-[#0A2342]/75 font-light leading-relaxed">
                {p.description || p.tagline}
              </p>
            </TextReveal>
          ))}
        </div>

        {/* Updated CTAs — pointing to existing protocol & journal routes */}
        <div className="mt-14 text-center flex flex-wrap justify-center gap-4">
          <Button to="/vitality" variant="primary" size="lg" icon>
            Explore Vitality Protocol
          </Button>
          <Button to="/blog" variant="secondary" size="lg">
            Explore Brand Stories
          </Button>
        </div>
      </section>
    </PageContainer>
  );
};
