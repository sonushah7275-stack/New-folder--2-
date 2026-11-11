import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageContainer } from "../components/layout/PageContainer";
import { ProductGrid } from "../components/products/ProductGrid";
import { SectionHeading } from "../components/common/SectionHeading";
import { fetchProducts } from "../Redux/slices/productSlice";
import { fetchCategories } from "../Redux/slices/categorySlice";
import { fetchPageBySlug } from "../Redux/slices/contentSlice";
import { products as staticProducts } from "../data/products";

export const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products: apiProducts, loading, error } = useSelector((state) => state.product);
  const { categories: apiCategories } = useSelector((state) => state.category);
  const { pagesMap } = useSelector((state) => state.content);

  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchPageBySlug("products"));
  }, [dispatch]);

  useEffect(() => {
    const params = selectedCategory !== "All" ? { categoryName: selectedCategory } : {};
    dispatch(fetchProducts(params));
  }, [dispatch, selectedCategory]);

  const productsCmsPage = pagesMap?.products;

  // Transform / normalize items for UI compatibility
  const displayProducts =
    apiProducts && apiProducts.length > 0
      ? apiProducts.map((p) => ({
          ...p,
          id: p._id || p.id,
          image: p.image || (p.images && p.images[0]?.url ? p.images[0].url : p.images?.[0]) || "/assets/images/product-vitality-tonic.svg",
          category: typeof p.category === "object" ? p.category?.name || "Vitality" : p.category || "Vitality",
          rating: p.rating || 4.9,
        }))
      : !loading && !error
      ? []
      : staticProducts;

  const categoryNames = [
    "All",
    ...(apiCategories && apiCategories.length > 0
      ? apiCategories.map((c) => (typeof c === "object" ? c.name || "" : c)).filter(Boolean)
      : ["Vitality", "Nourishment", "Lifestyle", "Longevity"]),
  ];

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        <SectionHeading
          subtitle={productsCmsPage?.hero?.subtitle || "Organic Botanical Formulations"}
          title={productsCmsPage?.hero?.title || "The TEJOVA Collection"}
          description={
            productsCmsPage?.hero?.description ||
            "Ethically harvested, bio-available botanicals designed to restore your natural state of physical, mental and cellular vitality."
          }
        />

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-12 sm:mb-16">
          {categoryNames.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 focus:outline-none cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#D4AF37] text-[#0A2342] shadow-xs"
                  : "bg-[#FAF9F6] text-[#0A2342] border border-[#B87333]/30 hover:border-[#0A2342] hover:text-[#B87333]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Catalog Display (Preserved independent catalog) */}
        <ProductGrid
          products={displayProducts}
          loading={loading}
          error={error}
        />
      </div>
    </PageContainer>
  );
};
