import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageContainer } from "../components/layout/PageContainer";
import { ProductGrid } from "../components/products/ProductGrid";
import { SectionHeading } from "../components/common/SectionHeading";
import { fetchProducts } from "../Redux/slices/productSlice";
import { fetchCategories } from "../Redux/slices/categorySlice";
import { products as staticProducts } from "../data/products";

export const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products: apiProducts, loading, error } = useSelector((state) => state.product);
  const { categories: apiCategories } = useSelector((state) => state.category);

  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = selectedCategory !== "All" ? { categoryName: selectedCategory } : {};
    dispatch(fetchProducts(params));
  }, [dispatch, selectedCategory]);

  // Transform / normalize items for UI compatibility
  const displayProducts =
    apiProducts && apiProducts.length > 0
      ? apiProducts.map((p) => ({
          ...p,
          id: p._id || p.id,
          image: p.image || (p.images && p.images[0]?.url ? p.images[0].url : p.images?.[0]) || "/assets/images/product-vitality-tonic.svg",
          category: typeof p.category === "object" ? p.category?.name : p.category || "Wellness",
          rating: p.rating || 4.9,
        }))
      : !loading && !error
      ? []
      : staticProducts;

  const categoryNames = [
    "All",
    ...(apiCategories && apiCategories.length > 0
      ? apiCategories.map((c) => c.name)
      : ["Vitality", "Nourishment", "Lifestyle", "Longevity"]),
  ];

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        <SectionHeading
          subtitle="Organic Botanical Formulations"
          title="The TEJOVA Collection"
          description="Ethically harvested, bio-available botanicals designed to restore your natural state of physical, mental and cellular vitality."
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

        {/* API States */}
        {loading && (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium text-[#0A2342]">Loading collection from MongoDB...</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-4 mb-8 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium rounded-xl text-center">
            <span>⚠️ {error}</span>
            <button
              onClick={() => dispatch(fetchProducts())}
              className="ml-4 underline font-bold hover:text-red-900 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && displayProducts.length === 0 && (
          <div className="py-16 text-center bg-[#FAF9F6] rounded-xl border border-[#B87333]/20">
            <p className="text-base font-serif font-medium text-[#0A2342]">No products found in this category.</p>
            <p className="text-xs text-gray-500 mt-1">Try selecting another category or clear filters.</p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && displayProducts.length > 0 && (
          <ProductGrid products={displayProducts} columns={3} />
        )}
      </div>
    </PageContainer>
  );
};
