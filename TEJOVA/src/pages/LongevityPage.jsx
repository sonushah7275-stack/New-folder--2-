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
import { Shield, RefreshCw, Feather } from "lucide-react";
import { fetchPillars } from "../Redux/slices/pillarSlice";
import { fetchProducts } from "../Redux/slices/productSlice";
import { fetchArticles } from "../Redux/slices/journalSlice";

export const LongevityPage = () => {
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
    (p) => p.slug === "longevity" || p.name?.toLowerCase() === "longevity"
  );
  const fallbackPillar = staticPillars.find((p) => p.id === "longevity") || staticPillars[3];

  const longevityData = {
    ...fallbackPillar,
    longDescription: dbPillar?.description || fallbackPillar.longDescription,
  };

  const relatedProducts =
    apiProducts && apiProducts.length > 0
      ? apiProducts.map((p) => ({
          ...p,
          id: p._id || p.id,
          image: p.image || (p.images && p.images[0]?.url ? p.images[0].url : p.images?.[0]) || "/assets/images/product-restore-renew.svg",
          category: typeof p.category === "object" ? p.category?.name : p.category || "Longevity",
        })).slice(0, 2)
      : staticProducts.filter(
          (p) =>
            p.category === "Longevity" ||
            p.slug === "restore-and-renew" ||
            p.slug === "cellular-youth-capsules"
        );

  const relatedArticles =
    apiArticles && apiArticles.length > 0
      ? apiArticles.map((a) => ({
          ...a,
          id: a._id || a.id,
          category: a.category || a.tags?.[0] || "Longevity",
          image: a.image || a.featuredImage || "/assets/images/longevity-forest.svg",
        })).slice(0, 2)
      : staticArticles.filter((a) => a.category === "Longevity").slice(0, 2);

  return (
    <PageContainer>
      {/* Editorial Hero */}
      <section className="relative py-14 sm:py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#B87333] font-semibold block">
              Longevity
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[72px] text-[#0A2342] leading-tight font-medium">
              Longer Life. <br />
              Cellular Protection.
            </h1>
            <p className="text-base sm:text-lg text-[#0A2342]/85 font-light leading-relaxed">
              {longevityData.longDescription}
            </p>
            <div className="pt-2">
              <Button to="/products/restore-and-renew" variant="primary" icon>
                Explore Sleep & Renewal Formulations
              </Button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="aspect-[4/3] rounded-xs overflow-hidden border border-[#B87333]/30 shadow-xs bg-[#FAF9F6]">
              <img
                src={longevityData.heroImage}
                alt="Timeless forest longevity landscape"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Longevity Pillars */}
      <section className="py-16 sm:py-20 bg-[#FAF9F6] border-y border-[#B87333]/30 my-12 sm:my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Biological Resilience"
            title="Keys to Cellular Longevity"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {longevityData.highlights.map((item, idx) => (
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

      {/* Product Showcase */}
      <section className="py-16 sm:py-20 bg-[#FAF9F6] border-b border-[#B87333]/30 my-12 sm:my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Cellular & Restorative Science"
            title="Longevity Formulations"
          />
          <ProductGrid products={relatedProducts} columns={2} />
        </div>
      </section>

      {/* Articles */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Epigenetics & Healthspan"
          title="Longevity Research"
        />
        <ArticleGrid articles={relatedArticles} />
      </section>
    </PageContainer>
  );
};
