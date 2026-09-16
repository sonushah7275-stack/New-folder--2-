import React from 'react';
import { products } from '../../data/products';
import { ProductGrid } from '../products/ProductGrid';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';

export const ProductSection = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <section className="py-20 md:py-28 bg-[#FAF8F3] border-t border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          subtitle="Featured Formulations"
          title="Our Products"
          description="Ethically harvested, scientifically formulated botanicals for a healthier, more vibrant life."
        />

        <ProductGrid products={featuredProducts} columns={4} />

        <div className="mt-14 text-center">
          <Button to="/products" variant="primary" size="lg" icon>
            Explore All Formulations
          </Button>
        </div>

      </div>
    </section>
  );
};
