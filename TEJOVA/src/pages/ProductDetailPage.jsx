import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PageContainer } from '../components/layout/PageContainer';
import { ProductGrid } from '../components/products/ProductGrid';
import { Button } from '../components/common/Button';
import { Star, CheckCircle2, ShieldCheck, Leaf, Truck, RefreshCw } from 'lucide-react';
import { fetchProductBySlug, fetchRelatedProducts } from '../Redux/slices/productSlice';
import { products as staticProducts } from '../data/products';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: apiProduct, detailLoading: loading, detailError: error, relatedProducts: apiRelated } = useSelector((state) => state.product);

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }
  }, [dispatch, slug]);

  const fallbackProduct = staticProducts.find((p) => p.slug === slug) || staticProducts[0];
  const rawProduct = apiProduct || fallbackProduct;

  // Normalize product structure
  const product = {
    ...rawProduct,
    id: rawProduct._id || rawProduct.id,
    image: rawProduct.image || (rawProduct.images && rawProduct.images[0]?.url ? rawProduct.images[0].url : rawProduct.images?.[0]) || "/assets/images/product-vitality-tonic.svg",
    gallery: rawProduct.gallery || (Array.isArray(rawProduct.images) ? rawProduct.images.map(i => typeof i === 'object' ? i.url : i) : [rawProduct.image || "/assets/images/product-vitality-tonic.svg"]),
    category: typeof rawProduct.category === 'object' ? rawProduct.category?.name : rawProduct.category || "Wellness",
    rating: rawProduct.rating || 4.9,
    reviewsCount: rawProduct.reviewsCount || 128,
    benefits: rawProduct.benefits || ["Promotes physical and mental cellular vitality", "Supports natural restorative circadian rhythms", "100% sustainably wildcrafted ingredients"],
    ingredients: rawProduct.ingredients || "Pure wildcrafted organic adaptogens and botanical extract.",
    howToUse: rawProduct.howToUse || "Take 1-2 droppers daily in warm water or herbal infusion.",
    story: rawProduct.story || "Harvested with reverence from pristine Himalayan valleys.",
  };

  useEffect(() => {
    if (product.category) {
      dispatch(fetchRelatedProducts(product.category));
    }
  }, [dispatch, product.category]);

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('benefits');

  useEffect(() => {
    if (product.image) {
      setSelectedImage(product.image);
    }
  }, [product.image]);

  const displayRelated = apiRelated && apiRelated.length > 0
    ? apiRelated.filter(p => p.slug !== slug).slice(0, 3).map(p => ({
        ...p,
        id: p._id || p.id,
        image: p.image || (p.images && p.images[0]?.url ? p.images[0].url : p.images?.[0]) || "/assets/images/product-vitality-tonic.svg",
        category: typeof p.category === 'object' ? p.category?.name : p.category || "Wellness",
      }))
    : staticProducts.filter(p => p.slug !== slug).slice(0, 3);

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-[#0A2342]/70 mb-8 flex flex-wrap items-center space-x-2 font-light">
          <Link to="/" className="hover:text-[#B87333] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#B87333] transition-colors">Products</Link>
          <span>/</span>
          <span className="text-[#0A2342] font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        {loading && (
          <div className="py-16 text-center">
            <RefreshCw className="w-10 h-10 text-[#D4AF37] animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium text-[#0A2342]">Loading product details...</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-4 mb-8 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium rounded-xl text-center">
            <span>⚠️ {error}</span>
            <button
              onClick={() => dispatch(fetchProductBySlug(slug))}
              className="ml-4 underline font-bold hover:text-red-900 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* Left Column: Product Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square max-h-[520px] w-full overflow-hidden rounded-xs bg-[#FAF9F6] border border-[#B87333]/30 p-6 sm:p-8 flex items-center justify-center shadow-xs">
                {product.badge && (
                  <span className="absolute top-5 left-5 z-10 text-xs font-semibold uppercase tracking-wider bg-[#D4AF37] text-[#0A2342] px-3 py-1.5 rounded-xs shadow-xs">
                    {product.badge}
                  </span>
                )}
                <img
                  src={selectedImage || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-300 rounded-xs"
                />
              </div>

              {/* Gallery Thumbnails */}
              {product.gallery && product.gallery.length > 1 && (
                <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2">
                  {product.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      aria-label={`Select product image ${idx + 1}`}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xs overflow-hidden border-2 transition-all p-0.5 bg-[#FAF9F6] shrink-0 cursor-pointer ${
                        selectedImage === img ? 'border-[#B87333]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover rounded-xs" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Specs & Actions */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm uppercase tracking-[0.25em] font-semibold text-[#B87333]">
                    {product.category}
                  </span>
                  {product.rating && (
                    <div className="flex items-center text-[#B87333] text-xs font-medium">
                      <Star className="w-4 h-4 fill-current mr-1 text-[#D4AF37]" />
                      <span>{product.rating} ({product.reviewsCount} verified reviews)</span>
                    </div>
                  )}
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] text-[#0A2342] leading-tight font-medium mb-2">
                  {product.name}
                </h1>

                {product.subtitle && (
                  <p className="text-base sm:text-lg text-[#B87333] font-serif italic mb-4">
                    {product.subtitle}
                  </p>
                )}

                <div className="flex items-baseline space-x-3 mb-6">
                  {product.originalPrice && (
                    <span className="text-lg text-[#0A2342]/50 line-through font-light">
                      ₹{product.originalPrice}
                    </span>
                  )}
                  <span className="text-2xl sm:text-3xl font-medium text-[#0A2342]">
                    ₹{product.price}
                  </span>
                  <span className="text-xs font-light text-[#0A2342]/70 font-sans uppercase">INR</span>
                </div>

                <p className="text-base sm:text-lg text-[#0A2342]/85 font-light leading-relaxed mb-6">
                  {product.description}
                </p>
              </div>

              {/* Quantity UI & Primary/Secondary CTAs */}
              <div className="pt-6 border-t border-[#B87333]/30 space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <div className="flex items-center justify-between border border-[#B87333]/30 rounded-xs bg-[#FAF9F6] px-2 py-1 w-full sm:w-auto">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Decrease quantity"
                      className="px-3 py-1.5 text-lg font-medium text-[#0A2342] hover:bg-[#F5F3EF] transition-colors rounded-xs focus:outline-none cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-sm font-semibold text-[#0A2342] min-w-[2rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="Increase quantity"
                      className="px-3 py-1.5 text-lg font-medium text-[#0A2342] hover:bg-[#F5F3EF] transition-colors rounded-xs focus:outline-none cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <Button variant="primary" size="lg" className="w-full sm:w-auto flex-1 text-center">
                    Begin Journey (₹{product.price * quantity})
                  </Button>

                  <Button variant="secondary" size="lg" className="w-full sm:w-auto text-center">
                    Inquire
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-5 border-t border-[#B87333]/20 text-center text-xs text-[#0A2342]/80 font-light">
                  <div className="flex flex-col items-center">
                    <Leaf className="w-5 h-5 text-[#B87333] mb-1.5" />
                    <span>100% Organic</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Truck className="w-5 h-5 text-[#B87333] mb-1.5" />
                    <span>Eco Shipping</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <ShieldCheck className="w-5 h-5 text-[#B87333] mb-1.5" />
                    <span>Purity Tested</span>
                  </div>
                </div>
              </div>

              {/* Product Details Tabs Section */}
              <div className="pt-8 border-t border-[#B87333]/30">
                <div className="flex space-x-4 sm:space-x-6 border-b border-[#B87333]/20 pb-3 text-xs sm:text-sm font-medium overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('benefits')}
                    className={`pb-3 -mb-3 transition-colors shrink-0 cursor-pointer ${
                      activeTab === 'benefits' ? 'border-b-2 border-[#B87333] text-[#0A2342] font-semibold' : 'text-[#0A2342]/70 hover:text-[#0A2342]'
                    }`}
                  >
                    Key Benefits
                  </button>
                  <button
                    onClick={() => setActiveTab('ingredients')}
                    className={`pb-3 -mb-3 transition-colors shrink-0 cursor-pointer ${
                      activeTab === 'ingredients' ? 'border-b-2 border-[#B87333] text-[#0A2342] font-semibold' : 'text-[#0A2342]/70 hover:text-[#0A2342]'
                    }`}
                  >
                    Ingredients
                  </button>
                  <button
                    onClick={() => setActiveTab('howToUse')}
                    className={`pb-3 -mb-3 transition-colors shrink-0 cursor-pointer ${
                      activeTab === 'howToUse' ? 'border-b-2 border-[#B87333] text-[#0A2342] font-semibold' : 'text-[#0A2342]/70 hover:text-[#0A2342]'
                    }`}
                  >
                    How To Use
                  </button>
                  <button
                    onClick={() => setActiveTab('story')}
                    className={`pb-3 -mb-3 transition-colors shrink-0 cursor-pointer ${
                      activeTab === 'story' ? 'border-b-2 border-[#B87333] text-[#0A2342] font-semibold' : 'text-[#0A2342]/70 hover:text-[#0A2342]'
                    }`}
                  >
                    Botanical Story
                  </button>
                </div>

                <div className="py-6 text-sm text-[#0A2342]/85 leading-relaxed font-light">
                  {activeTab === 'benefits' && (
                    <ul className="space-y-3">
                      {product.benefits?.map((b, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-[#B87333] mr-2.5 mt-0.5 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === 'ingredients' && (
                    <p className="bg-[#FAF9F6] p-4 rounded-xs border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20">
                      {product.ingredients}
                    </p>
                  )}

                  {activeTab === 'howToUse' && (
                    <p>{product.howToUse}</p>
                  )}

                  {activeTab === 'story' && (
                    <p className="italic font-serif text-base text-[#0A2342]">
                      "{product.story}"
                    </p>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Complementary Products Section */}
        <section className="mt-20 sm:mt-24 pt-14 border-t border-[#B87333]/30">
          <div className="mb-10 text-center">
            <span className="text-xs uppercase tracking-widest text-[#B87333] font-semibold block mb-2">
              Curated Formulations
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#0A2342]">
              Complementary Products
            </h3>
          </div>

          <ProductGrid products={displayRelated} columns={3} />
        </section>

      </div>
    </PageContainer>
  );
};
