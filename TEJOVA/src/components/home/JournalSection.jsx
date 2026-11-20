import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { articles as staticArticles } from "../../data/articles";
import { ArticleGrid } from "../journal/ArticleGrid";
import { SectionHeading } from "../common/SectionHeading";
import { Button } from "../common/Button";
import { fetchArticles } from "../../Redux/slices/journalSlice";

export const JournalSection = () => {
  const dispatch = useDispatch();
  const { articles: apiArticles } = useSelector((state) => state.journal);
  const { pagesMap } = useSelector((state) => state.content);
  const homePage = pagesMap?.home;
  const sec = homePage?.sections?.find(
    (s) => s.sectionId === "sec_journal" || s.type === "journal"
  );

  if (sec && sec.isVisible === false) {
    return null;
  }

  const limit = (sec?.settings && sec.settings.limit) ? Number(sec.settings.limit) : 3;
  const subtitle = sec?.subtitle || sec?.kicker || "Editorial & Philosophy";
  const title = sec?.title || "From Our Journal";
  const description =
    sec?.content ||
    "Insights, research, and reflections for a more conscious, vibrant life.";
  const ctaText = sec?.cta?.text || "View All Articles";
  const ctaUrl = sec?.cta?.url || "/journal";

  useEffect(() => {
    dispatch(fetchArticles({ limit }));
  }, [dispatch, limit]);

  const homeArticles =
    apiArticles && apiArticles.length > 0
      ? apiArticles.slice(0, limit).map((a) => ({
          ...a,
          id: a._id || a.id,
          category: typeof a.category === "object" ? a.category?.name || "Vitality" : a.category || a.tags?.[0] || "Vitality",
          image: a.coverImage || a.image || a.featuredImage || "/assets/images/lifestyle-meditation.svg",
        }))
      : staticArticles.slice(0, limit);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle={subtitle}
          title={title}
          description={description}
        />

        <ArticleGrid articles={homeArticles} />

        <div className="mt-12 sm:mt-16 text-center">
          <Button to={ctaUrl} variant="secondary" icon>
            {ctaText}
          </Button>
        </div>
      </div>
    </section>
  );
};
