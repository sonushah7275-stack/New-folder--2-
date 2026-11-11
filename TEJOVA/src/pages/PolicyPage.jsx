import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { PageContainer } from "../components/layout/PageContainer";
import { fetchPageBySlug } from "../Redux/slices/contentSlice";
import { ShieldCheck, Calendar, ArrowLeft, Mail, AlertCircle } from "lucide-react";

/**
 * Maps any route alias to its canonical CMS page slug
 */
const resolveSlugFromPath = (pathname, propSlug) => {
  if (propSlug) return propSlug;
  const clean = (pathname || "").toLowerCase().replace(/^\/|\/$/g, "");
  if (clean.includes("privacy")) return "privacy-policy";
  if (clean.includes("terms")) return "terms-and-conditions";
  if (clean.includes("shipping") || clean.includes("refund") || clean.includes("returns")) {
    return "shipping-policy";
  }
  return clean || "privacy-policy";
};

export const PolicyPage = ({ slug: propSlug }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { pagesMap, loading, error } = useSelector((state) => state.content);

  const activeSlug = useMemo(
    () => resolveSlugFromPath(location.pathname, propSlug),
    [location.pathname, propSlug]
  );

  useEffect(() => {
    if (activeSlug) {
      dispatch(fetchPageBySlug(activeSlug));
    }
  }, [activeSlug, dispatch]);

  const pageData = pagesMap?.[activeSlug];

  // Extract Hero details
  const heroTitle = pageData?.hero?.title || pageData?.title || "Legal Policy";
  const heroSubtitle = pageData?.hero?.subtitle || pageData?.subtitle || "LEGAL NOTICE & REGULATORY PROVISIONS";
  const heroDescription = pageData?.hero?.description || "";

  // Extract Effective Date from subtitle or content
  const effectiveDateLabel = useMemo(() => {
    if (pageData?.subtitle && pageData.subtitle.toLowerCase().includes("effective")) {
      return pageData.subtitle;
    }
    return "Effective Date: 07.11.2026 | Tejova Life";
  }, [pageData]);

  // Combine and sanitize rich text content from sections
  const sanitizedContent = useMemo(() => {
    const sections = pageData?.sections || [];
    const richSection = sections.find(
      (s) => s.type === "rich_content" || Boolean(s.content)
    );
    const rawHtml = richSection?.content || pageData?.content || "";

    if (!rawHtml) return "";

    return DOMPurify.sanitize(rawHtml, {
      USE_PROFILES: { html: true },
      ADD_TAGS: ["table", "thead", "tbody", "tr", "th", "td", "caption"],
      ADD_ATTR: ["target", "rel", "class", "style", "id"],
    });
  }, [pageData]);

  return (
    <PageContainer>
      {/* Policy Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-8 border-b border-[#B87333]/20">
        {/* Back Link / Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#B87333] mb-6">
          <Link to="/" className="hover:text-[#0A2342] transition-colors flex items-center gap-1 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span className="text-[#0A2342]/40">/</span>
          <span className="text-[#0A2342]/70 font-medium">Legal Provisions</span>
          <span className="text-[#0A2342]/40">/</span>
          <span className="text-[#0A2342] font-semibold">{heroTitle.replace(" — TEJOVA", "")}</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 bg-[#B87333]/15 text-[#B87333] rounded-xs text-[11px] font-semibold tracking-wider uppercase inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Policy Document</span>
          </span>
          <span className="text-xs text-[#0A2342]/60 hidden sm:inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#B87333]" />
            <span>{effectiveDateLabel}</span>
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#0A2342] leading-tight font-medium mb-4">
          {heroTitle.replace(" — TEJOVA", "")}
        </h1>

        <p className="text-xs sm:text-sm text-[#B87333] uppercase tracking-widest font-semibold mb-4">
          {heroSubtitle}
        </p>

        {heroDescription && (
          <p className="text-base sm:text-lg text-[#0A2342]/85 font-light leading-relaxed max-w-3xl">
            {heroDescription}
          </p>
        )}
      </section>

      {/* Policy Body */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {loading && !pageData ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-3 border-[#0A2342] border-t-[#D4AF37] rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#B87333] uppercase tracking-widest font-medium">
              Loading Verified Policy Terms...
            </p>
          </div>
        ) : error && !pageData ? (
          <div className="p-8 bg-red-50 border border-red-200 rounded-xs text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
            <p className="text-sm font-semibold text-red-800">
              Unable to load policy content at this time.
            </p>
            <button
              type="button"
              onClick={() => dispatch(fetchPageBySlug(activeSlug))}
              className="px-4 py-2 bg-[#0A2342] text-white text-xs font-bold rounded-xs cursor-pointer hover:bg-[#B87333]"
            >
              Retry Loading
            </button>
          </div>
        ) : sanitizedContent ? (
          <div className="space-y-6">
            <div
              className="policy-content font-sans text-[#0A2342]/85 leading-relaxed text-sm sm:text-base space-y-4"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </div>
        ) : (
          <div className="py-16 text-center text-[#0A2342]/60 font-light">
            This policy document is currently undergoing routine legal revision. Please check back shortly.
          </div>
        )}

        {/* Legal Concierge Inquiry Box */}
        <div className="mt-16 p-8 bg-[#FAF9F6] border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 rounded-xs shadow-xs space-y-3">
          <h3 className="font-serif text-xl sm:text-2xl text-[#0A2342] font-medium">
            Legal & Data Protection Inquiries
          </h3>
          <p className="text-sm text-[#0A2342]/80 font-light leading-relaxed">
            For biological sovereignty notices, rights enforcement under DPDPA / GDPR / CCPA, or legal clarifications, contact our designated Data Protection Officer and Concierge.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
            <a
              href="mailto:concierge@tejova.com"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0A2342] text-white hover:bg-[#B87333] transition-colors rounded-xs uppercase tracking-wider"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>concierge@tejova.com</span>
            </a>
            <Link
              to="/contact"
              className="text-[#B87333] hover:text-[#0A2342] underline underline-offset-4"
            >
              Official Contact & Registered Office Details →
            </Link>
          </div>
        </div>
      </section>

      {/* Embedded CSS for responsive typography and mobile-friendly tables */}
      <style>{`
        .policy-content h3 {
          font-family: var(--font-serif, "DM Serif Display", serif);
          font-size: 1.5rem;
          color: #0A2342;
          font-weight: 500;
          margin-top: 2.25rem;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid rgba(184, 115, 51, 0.25);
          padding-bottom: 0.35rem;
        }
        .policy-content h4 {
          font-family: var(--font-serif, "DM Serif Display", serif);
          font-size: 1.25rem;
          color: #0A2342;
          font-weight: 500;
          margin-top: 1.75rem;
          margin-bottom: 0.5rem;
        }
        .policy-content p {
          margin-bottom: 1rem;
          line-height: 1.8;
          color: rgba(10, 35, 66, 0.85);
        }
        .policy-content ul, .policy-content ol {
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
          line-height: 1.75;
        }
        .policy-content ul {
          list-style-type: disc;
        }
        .policy-content ol {
          list-style-type: decimal;
        }
        .policy-content li {
          margin-bottom: 0.4rem;
        }
        .policy-content strong {
          color: #0A2342;
          font-weight: 600;
        }
        .policy-content a {
          color: #B87333;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.15s ease;
        }
        .policy-content a:hover {
          color: #0A2342;
        }
        .policy-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          display: block;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .policy-content th {
          background-color: #FAF9F6;
          color: #0A2342;
          font-family: var(--font-serif, "DM Serif Display", serif);
          font-weight: 600;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(184, 115, 51, 0.25);
          text-align: left;
          white-space: nowrap;
        }
        .policy-content td {
          padding: 0.75rem 1rem;
          border: 1px solid rgba(184, 115, 51, 0.2);
          color: rgba(10, 35, 66, 0.85);
          background-color: #ffffff;
        }
      `}</style>
    </PageContainer>
  );
};

export default PolicyPage;
