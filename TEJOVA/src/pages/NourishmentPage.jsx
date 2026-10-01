import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageContainer } from "../components/layout/PageContainer";
import { pillars as staticPillars } from "../data/pillars";
import { products as staticProducts } from "../data/products";
import { articles as staticArticles } from "../data/articles";
import { SectionHeading } from "../components/common/SectionHeading";
import { ProductGrid } from "../components/products/ProductGrid";
import { ArticleGrid } from "../components/journal/ArticleGrid";
import { TextReveal } from "../components/common/TextReveal";
import { Button } from "../components/common/Button";
import { Heart, Sparkles, Utensils, Droplets, Flame, Wind } from "lucide-react";
import { fetchPillars } from "../Redux/slices/pillarSlice";
import { fetchProducts } from "../Redux/slices/productSlice";
import { fetchArticles } from "../Redux/slices/journalSlice";
import { fetchPageBySlug } from "../Redux/slices/contentSlice";

export const NourishmentPage = () => {
  const dispatch = useDispatch();
  const { pillars: apiPillars } = useSelector((state) => state.pillar);
  const { products: apiProducts } = useSelector((state) => state.product);
  const { articles: apiArticles } = useSelector((state) => state.journal);
  const { pagesMap } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchPillars());
    dispatch(fetchProducts());
    dispatch(fetchArticles());
    dispatch(fetchPageBySlug("nourishment"));
  }, [dispatch]);

  const nourishmentCmsPage = pagesMap?.nourishment;
  const dbPillar = apiPillars.find(
    (p) => p.slug === "nourishment" || p.name?.toLowerCase() === "nourishment"
  );
  const fallbackPillar = staticPillars.find((p) => p.id === "nourishment") || staticPillars[1];

  const heroSubtitle = nourishmentCmsPage?.hero?.subtitle || "Nourishment";
  const heroTitle = nourishmentCmsPage?.hero?.title || "Real Food. Cellular Renewal.";
  const heroDescription =
    nourishmentCmsPage?.hero?.description ||
    dbPillar?.description ||
    fallbackPillar.longDescription;
  const heroMedia =
    nourishmentCmsPage?.hero?.mediaUrl || nourishmentCmsPage?.hero?.media?.url || fallbackPillar.heroImage;

  // Quote Section
  const quoteSection = nourishmentCmsPage?.sections?.find(
    (s) => s.type === "quote" || s.sectionId === "sec_nourishment_quote"
  );
  const quoteBadge = quoteSection?.badge || "The Nourishment Ethos";
  const quoteContent =
    quoteSection?.content ||
    '"Nourishment is not merely calories in a bowl; it is an active dialogue with your microbiome and cellular health."';

  // Cards / Elemental Section
  const cardsSection = nourishmentCmsPage?.sections?.find(
    (s) => s.type === "cards" || s.sectionId === "sec_elemental_nourishment"
  );
  const elementalItems = cardsSection?.items || [];

  const relatedProducts =
    apiProducts && apiProducts.length > 0
      ? apiProducts
          .map((p) => ({
            ...p,
            id: p._id || p.id,
            image:
              p.image ||
              (p.images && p.images[0]?.url ? p.images[0].url : p.images?.[0]) ||
              "/assets/images/product-earth-serum.svg",
            category: typeof p.category === "object" ? p.category?.name : p.category || "Nourishment",
          }))
          .slice(0, 2)
      : staticProducts.filter(
          (p) => p.category === "Nourishment" || p.slug === "earth-ritual-serum"
        );

  const relatedArticles =
    apiArticles && apiArticles.length > 0
      ? apiArticles
          .map((a) => ({
            ...a,
            id: a._id || a.id,
            category: a.category || a.tags?.[0] || "Nourishment",
            image: a.image || a.featuredImage || "/assets/images/nourishment-bowl.svg",
          }))
          .slice(0, 2)
      : staticArticles.filter((a) => a.category === "Nourishment").slice(0, 2);

  return (
    <PageContainer>
      {/* Editorial Layout for Nourishment */}
      <section className="relative py-14 sm:py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="aspect-[4/3] rounded-xs overflow-hidden shadow-xs border border-[#B87333]/30 bg-[#FAF9F6]">
              <img
                src={heroMedia}
                alt="Conscious nourishment whole food"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
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
              <Button to="/products/earth-ritual-serum" variant="primary" icon>
                {nourishmentCmsPage?.hero?.ctaText || "Discover Botanical Formulations"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Callout Quote */}
      <section className="py-16 bg-[#0A2342] text-white my-12 border-y border-[#B87333]/30">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-medium">
            {quoteBadge}
          </span>
          <blockquote className="font-serif text-2xl sm:text-4xl leading-relaxed italic text-[#F5F3EF]">
            {quoteContent.replace(/<[^>]*>?/gm, '')}
          </blockquote>
          <span className="text-xs tracking-widest uppercase text-white/70 block font-light">
            — TEJOVA Research Group
          </span>
        </div>
      </section>

      {/* Highlights / Elemental Nourishment Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle={cardsSection?.subtitle || "Microbiome & Whole Foods"}
          title={cardsSection?.title || "The 4 Pillars of Elemental Nourishment"}
          description={cardsSection?.content}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {elementalItems.length > 0
            ? elementalItems.map((item, idx) => (
                <TextReveal
                  key={item.id || idx}
                  delay={idx * 0.1}
                  className="bg-[#FAF9F6] p-6 rounded-xs border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 space-y-4 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-full bg-[#0A2342] text-[#D4AF37] flex items-center justify-center shrink-0">
                    {idx === 0 ? (
                      <Droplets className="w-5 h-5" />
                    ) : idx === 1 ? (
                      <Utensils className="w-5 h-5" />
                    ) : idx === 2 ? (
                      <Flame className="w-5 h-5" />
                    ) : (
                      <Wind className="w-5 h-5" />
                    )}
                  </div>
                  <h3 className="font-serif text-xl text-[#0A2342] font-medium">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#0A2342]/75 font-light leading-relaxed">
                    {item.description}
                  </p>
                </TextReveal>
              ))
            : fallbackPillar.highlights.map((item, idx) => (
                <TextReveal
                  key={item.title}
                  delay={idx * 0.1}
                  className="bg-[#FAF9F6] p-7 sm:p-8 rounded-xs border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 space-y-4 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-full bg-[#0A2342] text-[#D4AF37] flex items-center justify-center shrink-0">
                    {idx === 0 ? (
                      <Utensils className="w-5 h-5" />
                    ) : idx === 1 ? (
                      <Heart className="w-5 h-5" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
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
      </section>

      {/* Formulations Grid */}
      <section className="py-16 sm:py-20 bg-[#FAF9F6] border-t border-[#B87333]/30 my-12 sm:my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Whole-Food Formulations"
            title="Supplements & Botanicals"
          />
          <ProductGrid products={relatedProducts} columns={2} />
        </div>
      </section>

      {/* Articles */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Nourishment Stories"
          title="Insights & Articles"
        />
        <ArticleGrid articles={relatedArticles} />
      </section>
    </PageContainer>
  );
};
