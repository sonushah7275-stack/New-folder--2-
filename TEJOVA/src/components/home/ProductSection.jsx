import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { products as staticProducts } from "../../data/products";
import { ProductGrid } from "../products/ProductGrid";
import { SectionHeading } from "../common/SectionHeading";
import { Button } from "../common/Button";
import { fetchProducts } from "../../Redux/slices/productSlice";

export const ProductSection = () => {
  const dispatch = useDispatch();
  const { products: apiProducts } = useSelector((state) => state.product);
  const { pagesMap } = useSelector((state) => state.content);
  const homePage = pagesMap?.home;
  const sec = homePage?.sections?.find(
    (s) => s.sectionId === "sec_products" || s.type === "products"
  );

  if (sec && sec.isVisible === false) {
    return null;
  }

  const limit = (sec?.settings && sec.settings.limit) ? Number(sec.settings.limit) : 4;
  const subtitle = sec?.subtitle || sec?.kicker || "Featured Formulations";
  const title = sec?.title || "Our Products";
  const description =
    sec?.content ||
    "Ethically harvested, scientifically formulated botanicals for a healthier, more vibrant life.";
  const ctaText = sec?.cta?.text || "Explore All Formulations";
  const ctaUrl = sec?.cta?.url || "/products";

  useEffect(() => {
    dispatch(fetchProducts({ limit }));
  }, [dispatch, limit]);

  const featuredProducts =
    apiProducts && apiProducts.length > 0
      ? apiProducts.slice(0, limit).map((p) => ({
          ...p,
          id: p._id || p.id,
          image: p.image || (p.images && p.images[0]?.url ? p.images[0].url : p.images?.[0]) || "/assets/images/product-vitality-tonic.svg",
          category: typeof p.category === "object" ? p.category?.name || "Vitality" : p.category || "Vitality",
        }))
      : staticProducts.slice(0, limit);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F3EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle={subtitle}
          title={title}
          description={description}
        />

        <ProductGrid products={featuredProducts} columns={4} />

        <div className="mt-12 sm:mt-16 text-center">
          <Button to={ctaUrl} variant="primary" size="lg" icon>
            {ctaText}
          </Button>
        </div>
      </div>
    </section>
  );
};
