import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { products } from '../data/products';
import { ProductGrid } from '../components/products/ProductGrid';
import { Button } from '../components/common/Button';
import { Star, CheckCircle2, ShieldCheck, Leaf, Truck, RefreshCw } from 'lucide-react';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug) || products[0];

  const [selectedImage, setSelectedImage] = useState(product.gallery ? product.gallery[0] : product.image);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('benefits'); // 'benefits' | 'ingredients' | 'howToUse' | 'story'

  const relatedProducts = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-gray-500 mb-8 flex items-center space-x-2 font-light">
          <Link to="/" className="hover:text-[#1F4D3B]">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#1F4D3B]">Products</Link>
          <span>/</span>
          <span className="text-[#1F4D3B] font-medium">{product.name}</span>
        </nav>

        {/* Product Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Gallery Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xs bg-[#FAF8F3] border border-gray-200/80 p-8 flex items-center justify-center">
              {product.badge && (
                <span className="absolute top-6 left-6 z-10 text-xs font-semibold uppercase tracking-wider bg-[#1F4D3B] text-white px-3 py-1 rounded-xs">
                  {product.badge}
                </span>
              )}
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>

            {/* Thumbnails */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex space-x-4">
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-xs overflow-hidden border-2 transition-all p-1 bg-[#FAF8F3] ${
                      selectedImage === img ? 'border-[#1F4D3B]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#668F6B]">
                  {product.category}
                </span>
                {product.rating && (
                  <div className="flex items-center text-amber-600 text-xs font-medium">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    <span>{product.rating} ({product.reviewsCount} verified reviews)</span>
                  </div>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl text-[#1F4D3B] leading-tight mb-2">
                {product.name}
              </h1>
              <p className="text-sm sm:text-base text-[#668F6B] font-serif italic mb-4">
                {product.subtitle}
              </p>

              <div className="text-3xl font-medium text-[#1F4D3B] mb-6">
                ₹{product.price} <span className="text-xs font-light text-gray-400 font-sans">USD</span>
              </div>

              <p className="text-sm text-[#687280] font-light leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            {/* Quantity & CTA */}
            <div className="pt-6 border-t border-gray-200/80 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-xs bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-[#1F4D3B]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <Button variant="primary" size="lg" className="flex-1 text-center">
                  Explore Formulation (₹{product.price * quantity})
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-600 font-light">
                <div className="flex flex-col items-center">
                  <Leaf className="w-5 h-5 text-[#668F6B] mb-1" />
                  <span>100% Organic</span>
                </div>
                <div className="flex flex-col items-center">
                  <Truck className="w-5 h-5 text-[#668F6B] mb-1" />
                  <span>Eco Delivery</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-5 h-5 text-[#668F6B] mb-1" />
                  <span>Purity Tested</span>
                </div>
              </div>
            </div>

            {/* Accordion / Tabs Section */}
            <div className="pt-8 border-t border-gray-200/80">
              <div className="flex space-x-6 border-b border-gray-200 pb-3 text-sm font-medium">
                <button
                  onClick={() => setActiveTab('benefits')}
                  className={`pb-3 -mb-3 transition-colors ${
                    activeTab === 'benefits' ? 'border-b-2 border-[#1F4D3B] text-[#1F4D3B]' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Key Benefits
                </button>
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`pb-3 -mb-3 transition-colors ${
                    activeTab === 'ingredients' ? 'border-b-2 border-[#1F4D3B] text-[#1F4D3B]' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Ingredients
                </button>
                <button
                  onClick={() => setActiveTab('howToUse')}
                  className={`pb-3 -mb-3 transition-colors ${
                    activeTab === 'howToUse' ? 'border-b-2 border-[#1F4D3B] text-[#1F4D3B]' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  How To Use
                </button>
                <button
                  onClick={() => setActiveTab('story')}
                  className={`pb-3 -mb-3 transition-colors ${
                    activeTab === 'story' ? 'border-b-2 border-[#1F4D3B] text-[#1F4D3B]' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Botanical Story
                </button>
              </div>

              <div className="py-6 text-sm text-[#687280] leading-relaxed font-light">
                {activeTab === 'benefits' && (
                  <ul className="space-y-3">
                    {product.benefits?.map((b, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-[#668F6B] mr-2 mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'ingredients' && (
                  <p className="bg-[#FAF8F3] p-4 rounded-xs border border-gray-200/60">
                    {product.ingredients}
                  </p>
                )}

                {activeTab === 'howToUse' && (
                  <p>{product.howToUse}</p>
                )}

                {activeTab === 'story' && (
                  <p className="italic font-serif text-base text-[#1F4D3B]">
                    "{product.story}"
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Related Products */}
        <section className="mt-24 pt-16 border-t border-gray-200">
          <div className="mb-10 text-center">
            <span className="text-xs uppercase tracking-widest text-[#668F6B] font-semibold block mb-2">Curated Formulations</span>
            <h3 className="font-serif text-3xl text-[#1F4D3B]">Complementary Products</h3>
          </div>

          <ProductGrid products={relatedProducts} columns={3} />
        </section>

      </div>
    </PageContainer>
  );
};
