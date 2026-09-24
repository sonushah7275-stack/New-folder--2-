import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DOMPurify from "dompurify";
import { PageContainer } from "../components/layout/PageContainer";
import { ArticleGrid } from "../components/journal/ArticleGrid";
import { Clock, Calendar, ArrowLeft, RefreshCw } from "lucide-react";
import { fetchArticleBySlug } from "../Redux/slices/journalSlice";
import { articles as staticArticles } from "../data/articles";

/**
 * TEJOVA Article Font Style Class Mapping
 * Note on Font Sources:
 * - "Serif Old Style": Google Fonts ('DM Serif Display' / 'Cormorant Garamond')
 * - "Technology Variable": Uses public Google Font replacement 'Share Tech Mono'
 * - "Feeling Vintage": Google Fonts ('Cormorant Garamond' Italic)
 * - "Feeling Sincere": Google Fonts ('Inter')
 * - "Feeling Rugged": Uses public Google Font replacement 'Rokkitt' (Slab Serif)
 * - "DM Sans Regular": Google Fonts ('DM Sans', weight 400)
 */
const fontStyleClasses = {
  "serif-old-style": "font-serif text-[#0A2342]/90 leading-relaxed text-base sm:text-lg space-y-6",
  "technology-variable": "[font-family:'Share_Tech_Mono',monospace] text-[#0A2342]/90 leading-relaxed text-base sm:text-lg space-y-6 tracking-wide",
  "feeling-vintage": "font-serif italic text-[#0A2342]/90 leading-relaxed text-base sm:text-lg space-y-6",
  "feeling-sincere": "font-sans text-[#0A2342]/85 leading-loose text-base sm:text-lg space-y-6",
  "feeling-rugged": "[font-family:'Rokkitt',serif] font-semibold text-[#0A2342] leading-snug text-base sm:text-lg space-y-6 uppercase tracking-tight",
  "dm-sans": "[font-family:'DM_Sans',sans-serif] font-normal text-[#0A2342]/90 leading-normal text-base sm:text-md space-y-5",
  "tejova-editorial": "font-serif text-[#0A2342]/90 leading-relaxed text-base sm:text-lg space-y-6",
  "modern-editorial": "font-sans text-[#0A2342]/85 leading-loose text-base sm:text-lg space-y-6",
  "classic-serif": "font-serif text-[#0A2342] leading-relaxed text-base sm:text-lg space-y-6",
  "clean-sans": "font-sans text-[#0A2342]/85 leading-normal text-base sm:text-md space-y-5",
};

export const ArticleDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { selectedArticle: apiArticle, detailLoading: loading, detailError: error, articles: allArticles } = useSelector((state) => state.journal);

  useEffect(() => {
    if (slug) {
      dispatch(fetchArticleBySlug(slug));
    }
  }, [dispatch, slug]);

  const fallbackArticle = staticArticles.find((a) => a.slug === slug) || staticArticles[0];
  const rawArticle = apiArticle || fallbackArticle;

  const article = {
    ...rawArticle,
    id: rawArticle._id || rawArticle.id,
    category: rawArticle.category || rawArticle.tags?.[0] || "Conscious Living",
    image: rawArticle.coverImage || rawArticle.image || rawArticle.featuredImage || "/assets/images/lifestyle-meditation.svg",
    date: rawArticle.publishedAt ? new Date(rawArticle.publishedAt).toLocaleDateString() : rawArticle.date || "Recently Published",
    readTime: rawArticle.readTime || "5 min read",
    author: typeof rawArticle.author === "object" ? rawArticle.author?.name || "TEJOVA Editorial" : rawArticle.author || "TEJOVA Editorial",
    authorRole: "Wellness Researcher",
    content: rawArticle.content || "<p>Detailed article content loading...</p>",
    fontStyle: rawArticle.fontStyle || "serif-old-style",
  };

  const currentFontStyleClass = fontStyleClasses[article.fontStyle] || fontStyleClasses["serif-old-style"];

  const relatedArticles = allArticles && allArticles.length > 0
    ? allArticles.filter(a => a.slug !== slug).slice(0, 3)
    : staticArticles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <PageContainer>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        {/* Back Link */}
        <Link
          to="/journal"
          className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[#B87333] hover:text-[#0A2342] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Journal
        </Link>

        {loading && (
          <div className="py-16 text-center">
            <RefreshCw className="w-10 h-10 text-[#D4AF37] animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium text-[#0A2342]">Loading article...</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-4 mb-8 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium rounded-xl text-center">
            <span>⚠️ {error}</span>
            <button
              onClick={() => dispatch(fetchArticleBySlug(slug))}
              className="ml-4 underline font-bold hover:text-red-900 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && (
          <>
            {/* Category & Title */}
            <div className="space-y-4 text-center max-w-3xl mx-auto mb-10">
              <span className="inline-block px-3.5 py-1 bg-[#FAF9F6] text-[#B87333] text-xs uppercase tracking-widest font-semibold rounded-xs border border-[#B87333]/30">
                {article.category}
              </span>

              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#0A2342] leading-tight font-medium">
                {article.title}
              </h1>

              <div className="flex items-center justify-center space-x-6 text-xs text-[#0A2342]/70 font-light pt-2">
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#B87333]" /> {article.date}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-[#B87333]" /> {article.readTime}
                </span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="aspect-[16/9] rounded-xs overflow-hidden shadow-xs mb-12 bg-[#FAF9F6] border border-[#B87333]/30">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            </div>

            {/* Content Body */}
            <div className="overflow-x-auto">
              <div
                className={`prose prose-lg max-w-none ${currentFontStyleClass} [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-[#0A2342] [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#0A2342] [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#0A2342] [&_h3]:mt-4 [&_h3]:mb-2 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-[#0A2342] [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-[#B87333] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_img]:rounded-lg [&_img]:max-w-full [&_img]:my-4 [&_img]:shadow-xs [&_img]:mx-auto [&_figcaption]:text-xs [&_figcaption]:text-gray-500 [&_figcaption]:text-center [&_figcaption]:italic [&_figcaption]:mt-1 [&_a]:text-[#B87333] [&_a]:underline [&_a]:hover:text-[#0A2342] [&_hr]:my-8 [&_hr]:max-w-full [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:border [&_table]:border-[#0A2342]/20 [&_table]:text-xs sm:[&_table]:text-sm [&_th]:bg-[#FAF9F6] [&_th]:border [&_th]:border-[#0A2342]/20 [&_th]:px-3 sm:[&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-serif [&_th]:font-bold [&_th]:text-[#0A2342] [&_td]:border [&_td]:border-[#0A2342]/15 [&_td]:px-3 sm:[&_td]:px-4 [&_td]:py-2.5 [&_td]:text-[#0A2342] [&_tr:hover]:bg-[#FAF9F6]/50 [&_aside]:bg-[#FAF9F6] [&_aside]:border-l-4 [&_aside]:border-[#B87333] [&_aside]:p-5 [&_aside]:my-6 [&_aside]:rounded-r-xl [&_aside]:text-[#0A2342] [&_aside]:shadow-2xs [&_.tejova-highlight-box]:bg-[#FAF9F6] [&_.tejova-highlight-box]:border-l-4 [&_.tejova-highlight-box]:border-[#B87333] [&_.tejova-highlight-box]:p-5 [&_.tejova-highlight-box]:my-6 [&_.tejova-highlight-box]:rounded-r-xl [&_.tejova-highlight-box]:text-[#0A2342] [&_.tejova-highlight-box]:shadow-2xs`}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(article.content || "", {
                    ADD_TAGS: ["aside", "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td", "hr"],
                    ADD_ATTR: ["target", "rel", "style", "colspan", "rowspan", "src", "alt", "title", "class", "data-color", "data-type"],
                    ALLOWED_STYLE_PROPERTIES: [
                      "color",
                      "background-color",
                      "font-size",
                      "line-height",
                      "text-align",
                      "border",
                      "border-top",
                      "border-color",
                      "border-top-color",
                      "margin",
                      "opacity",
                    ],
                  }),
                }}
              />
            </div>

            {/* Author Bio Box */}
            <div className="mt-16 p-6 sm:p-8 bg-[#FAF9F6] rounded-xs border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#0A2342] text-[#D4AF37] font-serif text-2xl flex items-center justify-center shrink-0">
                {article.author ? article.author[0] : "T"}
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-serif text-xl text-[#0A2342]">{article.author}</h4>
                <p className="text-xs text-[#B87333] font-semibold uppercase tracking-wider mb-2">{article.authorRole}</p>
                <p className="text-xs sm:text-sm text-[#0A2342]/75 font-light leading-relaxed">
                  Contributing editorial researcher on botanical adaptogens, natural movement, and conscious living practices.
                </p>
              </div>
            </div>
          </>
        )}
      </article>

      {/* Related Stories */}
      <section className="mt-20 py-16 bg-[#FAF9F6] border-t border-[#B87333]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="text-xs uppercase tracking-widest text-[#B87333] font-semibold block mb-2">Editorial Journal</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#0A2342]">Related Articles</h3>
          </div>
          <ArticleGrid articles={relatedArticles} />
        </div>
      </section>
    </PageContainer>
  );
};
