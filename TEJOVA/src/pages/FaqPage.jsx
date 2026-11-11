import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { FaqAccordion } from "../components/common/FaqAccordion";
import { fetchPageBySlug } from "../Redux/slices/contentSlice";
import { ArrowRight, HelpCircle } from "lucide-react";

export const FaqPage = () => {
  const dispatch = useDispatch();
  const { pagesMap, loading, error } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchPageBySlug("faqs"));
  }, [dispatch]);

  const faqsCms = pagesMap?.faqs;
  const heroSubtitle = faqsCms?.hero?.subtitle || "BIOLOGICAL SOVEREIGNTY & PRACTICE INSIGHTS";
  const heroTitle = faqsCms?.hero?.title || "Frequently Asked Questions";
  const heroDescription =
    faqsCms?.hero?.description ||
    "Clear guidance on the Tejova Protocols, nutritional laws, private consultations, and sovereign performance living.";

  // Retrieve FAQ items from CMS sections
  const faqSection = (faqsCms?.sections || []).find(
    (s) => s.sectionId === "sec_faqs_list" || s.type === "cards" || (s.items && s.items.length > 0)
  );

  const rawItems = faqSection?.items || [];
  const activeFaqs = rawItems.filter((i) => i.isVisible !== false);

  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-[#B87333] font-semibold block mb-4">
          {heroSubtitle}
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[72px] text-[#0A2342] leading-tight max-w-4xl mx-auto mb-6 font-medium">
          {heroTitle}
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-[#0A2342]/85 font-light max-w-2xl mx-auto leading-relaxed">
          {heroDescription}
        </p>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B87333]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B87333]" />
          <span>{activeFaqs.length} Authoritative Inquiries</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#B87333]" />
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading && !faqsCms ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-3 border-[#0A2342] border-t-[#D4AF37] rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#B87333] uppercase tracking-widest font-medium">
              Loading Verified Insights...
            </p>
          </div>
        ) : error && !faqsCms ? (
          <div className="p-8 bg-red-50 border border-red-200 rounded-xs text-center space-y-3">
            <HelpCircle className="w-8 h-8 text-red-600 mx-auto" />
            <p className="text-sm font-semibold text-red-800">
              Unable to load inquiries at this moment.
            </p>
            <button
              type="button"
              onClick={() => dispatch(fetchPageBySlug("faqs"))}
              className="px-4 py-2 bg-[#0A2342] text-white text-xs font-bold rounded-xs cursor-pointer hover:bg-[#B87333]"
            >
              Retry Loading
            </button>
          </div>
        ) : (
          <FaqAccordion items={activeFaqs} />
        )}

        {/* Private Consultation Inquiry Box */}
        <div className="mt-16 p-8 sm:p-10 bg-[#FAF9F6] border border-[#B87333]/30 rounded-xs text-center space-y-4 shadow-xs">
          <span className="text-xs uppercase tracking-widest text-[#B87333] font-semibold block">
            Personal Health Architecture
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#0A2342] font-medium">
            Have a specific clinical or biological inquiry?
          </h2>
          <p className="text-sm sm:text-base text-[#0A2342]/80 font-light max-w-xl mx-auto leading-relaxed">
            Our private practice conducts tailored bio-energetic reviews and lifestyle alignment protocols for sovereign clients globally.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0A2342] text-white hover:bg-[#B87333] transition-colors text-xs uppercase tracking-widest font-semibold rounded-xs shadow-xs"
            >
              <span>Speak with Our Concierge</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageContainer>
  );
};

export default FaqPage;
