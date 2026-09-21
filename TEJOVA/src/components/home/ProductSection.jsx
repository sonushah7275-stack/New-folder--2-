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

  useEffect(() => {
    dispatch(fetchProducts({ limit: 4 }));
  }, [dispatch]);

  const featuredProducts =
    apiProducts && apiProducts.length > 0
      ? apiProducts.slice(0, 4).map((p) => ({
          ...p,
          id: p._id || p.id,
          image: p.image || (p.images && p.images[0]?.url ? p.images[0].url : p.images?.[0]) || "/assets/images/product-vitality-tonic.svg",
          category: typeof p.category === "object" ? p.category?.name : p.category || "Wellness",
        }))
      : staticProducts.slice(0, 4);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F3EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Featured Formulations"
          title="Our Products"
          description="Ethically harvested, scientifically formulated botanicals for a healthier, more vibrant life."
        />

        <ProductGrid products={featuredProducts} columns={4} />

        <div className="mt-12 sm:mt-16 text-center">
          <Button to="/products" variant="primary" size="lg" icon>
            Explore All Formulations
          </Button>
        </div>
      </div>
    </section>
  );
};
