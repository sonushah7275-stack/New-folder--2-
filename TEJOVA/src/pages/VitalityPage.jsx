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
import { Zap, Sun, Activity, ShieldCheck } from "lucide-react";
import { fetchPillars } from "../Redux/slices/pillarSlice";
import { fetchProducts } from "../Redux/slices/productSlice";
import { fetchArticles } from "../Redux/slices/journalSlice";

export const VitalityPage = () => {
  const dispatch = useDispatch();
  const { pillars: apiPillars } = useSelector((state) => state.pillar);
  const { products: apiProducts } = useSelector((state) => state.product);
  const { articles: apiArticles } = useSelector((state) => state.journal);

  useEffect(() => {
    dispatch(fetchPillars());
    dispatch(fetchProducts());
    dispatch(fetchArticles());
  }, [dispatch]);

  const dbPillar = apiPillars.find(
    (p) => p.slug === "vitality" || p.name?.toLowerCase() === "vitality"
  );
  const fallbackPillar = staticPillars.find((p) => p.id === "vitality") || staticPillars[0];

  const vitalityData = {
    ...fallbackPillar,
    longDescription: dbPillar?.description || fallbackPillar.longDescription,
  };

  const relatedProducts =
    apiProducts && apiProducts.length > 0
      ? apiProducts.map((p) => ({
          ...p,
          id: p._id || p.id,
          image: p.image || (p.images && p.images[0]?.url ? p.images[0].url : p.images?.[0]) || "/assets/images/product-vitality-tonic.svg",
          category: typeof p.category === "object" ? p.category?.name : p.category || "Wellness",
        })).slice(0, 3)
      : staticProducts.filter(
          (p) => p.category === "Vitality" || p.slug === "vitality-tonic"
        );

  const relatedArticles =
    apiArticles && apiArticles.length > 0
      ? apiArticles.map((a) => ({
          ...a,
          id: a._id || a.id,
          category: a.category || a.tags?.[0] || "Vitality",
          image: a.image || a.featuredImage || "/assets/images/lifestyle-meditation.svg",
        })).slice(0, 2)
      : staticArticles.filter(
          (a) => a.category === "Nourishment" || a.category === "Vitality"
        ).slice(0, 2);

  return (
    <PageContainer>
      {/* Editorial Hero */}
      <section className="relative py-14 sm:py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#B87333] font-semibold block">
              Vitality
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[72px] text-[#0A2342] leading-tight font-medium">
              Natural Energy. <br />
              Peak Vigor.
            </h1>
            <p className="text-base sm:text-lg text-[#0A2342]/85 font-light leading-relaxed">
              {vitalityData.longDescription}
            </p>
            <div className="pt-2">
              <Button to="/products/vitality-tonic" variant="primary" icon>
                Explore Vitality Tonic
              </Button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="aspect-[4/3] rounded-xs overflow-hidden border border-[#B87333]/30 shadow-xs bg-[#FAF9F6]">
              <img
                src={vitalityData.heroImage}
                alt="Indoor biological architecture yoga studio visual"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles Grid */}
      <section className="py-16 sm:py-20 bg-[#FAF9F6] border-y border-[#B87333]/30 my-12 sm:my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Biological Foundation"
            title="The 3 Pillars of Vitality"
            description="How adaptogenic botanicals and circadian light restore innate biological stamina."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {vitalityData.highlights.map((item, idx) => (
              <TextReveal
                key={item.title}
                delay={idx * 0.1}
                className="bg-[#FAF9F6] p-7 sm:p-8 rounded-xs border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 space-y-4 shadow-xs"
              >
                <div className="w-10 h-10 rounded-full bg-[#0A2342] text-[#D4AF37] flex items-center justify-center shrink-0">
                  {idx === 0 ? (
                    <Zap className="w-5 h-5" />
                  ) : idx === 1 ? (
                    <Activity className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
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

      {/* Daily Practices Section */}
      <section className="py-14 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Daily Protocols"
          title="Recommended Rituals"
          description="Simple routines to integrate into your morning and afternoon."
        />

        <div className="space-y-6 max-w-4xl mx-auto">
          {vitalityData.practices.map((practice, idx) => (
            <TextReveal
              key={practice.title}
              delay={idx * 0.1}
              className="bg-[#FAF9F6] p-6 sm:p-8 rounded-xs border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
            >
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#B87333]">
                  {practice.time}
                </span>
                <h4 className="font-serif text-xl sm:text-2xl text-[#0A2342]">
                  {practice.title}
                </h4>
                <p className="text-sm text-[#0A2342]/75 font-light max-w-xl leading-relaxed">
                  {practice.desc}
                </p>
              </div>
              <ShieldCheck className="w-8 h-8 text-[#B87333]/60 shrink-0" />
            </TextReveal>
          ))}
        </div>
      </section>

      {/* Related Formulations */}
      <section className="py-16 sm:py-20 bg-[#FAF9F6] border-t border-[#B87333]/30 my-12 sm:my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Targeted Botanical Support"
            title="Formulations for Vitality"
          />
          <ProductGrid products={relatedProducts} columns={3} />
        </div>
      </section>

      {/* Journal Feature */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="From The Journal"
          title="Further Reading on Vitality"
        />
        <ArticleGrid articles={relatedArticles} />
      </section>
    </PageContainer>
  );
};
