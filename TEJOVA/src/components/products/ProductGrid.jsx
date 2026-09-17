import React from 'react';
import { ProductCard } from './ProductCard';
import { TextReveal } from '../common/TextReveal';

export const ProductGrid = ({ products, columns = 4 }) => {
  const colClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${colClasses[columns]} gap-6 md:gap-8`}>
      {products.map((product, idx) => (
        <TextReveal key={product.id} delay={idx * 0.05}>
          <ProductCard product={product} />
        </TextReveal>
      ))}
    </div>
  );
};
