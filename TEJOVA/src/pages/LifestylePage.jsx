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
import { Compass, Wind, Moon } from "lucide-react";
import { fetchPillars } from "../Redux/slices/pillarSlice";
import { fetchProducts } from "../Redux/slices/productSlice";
import { fetchArticles } from "../Redux/slices/journalSlice";

export const LifestylePage = () => {
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
    (p) => p.slug === "lifestyle" || p.name?.toLowerCase() === "lifestyle"
  );
  const fallbackPillar = staticPillars.find((p) => p.id === "lifestyle") || staticPillars[2];

  const lifestyleData = {
    ...fallbackPillar,
    longDescription: dbPillar?.description || fallbackPillar.longDescription,
  };

  const relatedProducts =
    apiProducts && apiProducts.length > 0
      ? apiProducts.map((p) => ({
          ...p,
          id: p._id || p.id,
          image: p.image || (p.images && p.images[0]?.url ? p.images[0].url : p.images?.[0]) || "/assets/images/lifestyle-meditation.svg",
          category: typeof p.category === "object" ? p.category?.name : p.category || "Lifestyle",
        })).slice(0, 3)
      : staticProducts.filter(
          (p) => p.category === "Lifestyle" || p.slug === "mindful-clarity-elixir"
        );

  const relatedArticles =
    apiArticles && apiArticles.length > 0
      ? apiArticles.map((a) => ({
          ...a,
          id: a._id || a.id,
          category: a.category || a.tags?.[0] || "Conscious Living",
          image: a.image || a.featuredImage || "/assets/images/lifestyle-meditation.svg",
        })).slice(0, 2)
      : staticArticles.filter(
          (a) => a.category === "Conscious Living" || a.category === "Personal Growth"
        ).slice(0, 2);

  return (
    <PageContainer>
      {/* Editorial Header */}
      <section className="relative py-14 sm:py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#B87333] font-semibold block">
            Lifestyle
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[72px] text-[#0A2342] leading-tight font-medium">
            Awareness. Growth. Human Potential.
          </h1>
          <p className="text-base sm:text-lg text-[#0A2342]/85 font-light leading-relaxed">
            {lifestyleData.longDescription}
          </p>
          <div className="pt-4 flex justify-center">
            <Button
              to="/products/mindful-clarity-elixir"
              variant="primary"
              icon
            >
              Explore Nootropic Clarity Elixir
            </Button>
          </div>
        </div>

        <div className="mt-14 rounded-xs overflow-hidden border border-[#B87333]/30 shadow-xs aspect-[21/9] max-w-5xl mx-auto bg-[#FAF9F6]">
          <img
            src={lifestyleData.heroImage}
            alt="Conscious lifestyle sunrise in mountains"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 3 Pillars of Living */}
      <section className="py-16 sm:py-20 bg-[#FAF9F6] border-y border-[#B87333]/30 my-12 sm:my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Inner Alignment"
            title="The 3 Rituals of Conscious Living"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {lifestyleData.highlights.map((item, idx) => (
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

      {/* Featured Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 sm:py-20 bg-[#FAF9F6] border-b border-[#B87333]/30 my-12 sm:my-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              subtitle="Nootropics & Clarity"
              title="Products for Lifestyle Support"
            />
            <ProductGrid products={relatedProducts} columns={3} />
          </div>
        </section>
      )}

      {/* Articles */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Mindfulness & Growth"
          title="Journal Entries"
        />
        <ArticleGrid articles={relatedArticles} />
      </section>
    </PageContainer>
  );
};
