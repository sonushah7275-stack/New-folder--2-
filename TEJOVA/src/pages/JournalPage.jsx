import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageContainer } from "../components/layout/PageContainer";
import { ArticleCard } from "../components/journal/ArticleCard";
import { ArticleGrid } from "../components/journal/ArticleGrid";
import { SectionHeading } from "../components/common/SectionHeading";
import { fetchArticles } from "../Redux/slices/journalSlice";
import { articles as staticArticles } from "../data/articles";

const categories = ["All", "Vitality", "Nourishment", "Lifestyle", "Longevity", "Conscious Living"];

export const JournalPage = () => {
  const dispatch = useDispatch();
  const { articles: apiArticles, loading, error } = useSelector((state) => state.journal);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const params = selectedCategory !== "All" ? { tag: selectedCategory } : {};
    dispatch(fetchArticles(params));
  }, [dispatch, selectedCategory]);

  const displayArticles =
    apiArticles && apiArticles.length > 0
      ? apiArticles.map((a) => ({
          ...a,
          id: a._id || a.id,
          category: a.category || a.tags?.[0] || "Conscious Living",
          image: a.image || a.featuredImage || "/assets/images/lifestyle-meditation.svg",
          date: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : a.date || "Recently Published",
          readTime: a.readTime || "5 min read",
          author: typeof a.author === "object" ? a.author?.name || "TEJOVA Editorial" : a.author || "TEJOVA Editorial",
          authorRole: "Wellness Researcher",
        }))
      : !loading && !error
      ? []
      : staticArticles;

  const featuredArticle = displayArticles.find((a) => a.featured) || displayArticles[0];

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        <SectionHeading
          subtitle="Conscious Living Journal"
          title="Essays & Insights"
          description="Reflections on biological vitality, clean nourishment, daily mindfulness and long-term health span."
        />

        {/* API States */}
        {loading && (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium text-[#0A2342]">Loading journal from MongoDB...</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-4 mb-8 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium rounded-xl text-center">
            <span>⚠️ {error}</span>
            <button
              onClick={() => dispatch(fetchArticles())}
              className="ml-4 underline font-bold hover:text-red-900 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && featuredArticle && (
          <ArticleCard article={featuredArticle} featured />
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-12 sm:mb-16">
          {categories.map((cat) => (
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

        {!loading && !error && displayArticles.length === 0 && (
          <div className="py-16 text-center bg-[#FAF9F6] rounded-xl border border-[#B87333]/20">
            <p className="text-base font-serif font-medium text-[#0A2342]">No journal articles found.</p>
          </div>
        )}

        {/* Article Grid */}
        {!loading && displayArticles.length > 0 && (
          <ArticleGrid articles={displayArticles} />
        )}
      </div>
    </PageContainer>
  );
};
