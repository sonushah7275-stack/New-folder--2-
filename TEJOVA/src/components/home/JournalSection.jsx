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

  useEffect(() => {
    dispatch(fetchArticles({ limit: 3 }));
  }, [dispatch]);

  const homeArticles =
    apiArticles && apiArticles.length > 0
      ? apiArticles.slice(0, 3).map((a) => ({
          ...a,
          id: a._id || a.id,
          category: a.category || a.tags?.[0] || "Conscious Living",
          image: a.image || a.featuredImage || "/assets/images/lifestyle-meditation.svg",
        }))
      : staticArticles.slice(0, 3);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Editorial & Philosophy"
          title="From Our Journal"
          description="Insights, research, and reflections for a more conscious, vibrant life."
        />

        <ArticleGrid articles={homeArticles} />

        <div className="mt-12 sm:mt-16 text-center">
          <Button to="/journal" variant="secondary" icon>
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
};
