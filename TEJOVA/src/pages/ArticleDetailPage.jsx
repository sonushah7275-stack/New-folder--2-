import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PageContainer } from "../components/layout/PageContainer";
import { ArticleGrid } from "../components/journal/ArticleGrid";
import { Clock, Calendar, ArrowLeft, RefreshCw } from "lucide-react";
import { fetchArticleBySlug } from "../Redux/slices/journalSlice";
import { articles as staticArticles } from "../data/articles";

const fontStyleClasses = {
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
    fontStyle: rawArticle.fontStyle || "tejova-editorial",
  };

  const currentFontStyleClass = fontStyleClasses[article.fontStyle] || fontStyleClasses["tejova-editorial"];

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
            <div
              className={`prose prose-lg max-w-none ${currentFontStyleClass}`}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

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
