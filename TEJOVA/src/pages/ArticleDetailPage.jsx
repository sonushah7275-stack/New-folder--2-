import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { articles } from '../data/articles';
import { ArticleGrid } from '../components/journal/ArticleGrid';
import { Clock, Calendar, ArrowLeft } from 'lucide-react';

export const ArticleDetailPage = () => {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug) || articles[0];
  const relatedArticles = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <PageContainer>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        
        {/* Back Link */}
        <Link to="/journal" className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[#B87333] hover:text-[#0A2342] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Journal
        </Link>

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
          className="prose prose-lg max-w-none text-[#0A2342]/85 font-light leading-relaxed space-y-6 text-base sm:text-lg"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Author Bio Box with 4px Copper Left Border */}
        <div className="mt-16 p-6 sm:p-8 bg-[#FAF9F6] rounded-xs border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#0A2342] text-[#D4AF37] font-serif text-2xl flex items-center justify-center shrink-0">
            {article.author[0]}
          </div>
          <div className="text-center sm:text-left">
            <h4 className="font-serif text-xl text-[#0A2342]">{article.author}</h4>
            <p className="text-xs text-[#B87333] font-semibold uppercase tracking-wider mb-2">{article.authorRole}</p>
            <p className="text-xs sm:text-sm text-[#0A2342]/75 font-light leading-relaxed">
              Contributing editorial researcher on botanical adaptogens, natural movement, and conscious living practices.
            </p>
          </div>
        </div>

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
