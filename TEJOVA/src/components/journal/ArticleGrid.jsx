import React from 'react';
import { ArticleCard } from './ArticleCard';
import { TextReveal } from '../common/TextReveal';

export const ArticleGrid = ({ articles }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article, idx) => (
        <TextReveal key={article.id} delay={idx * 0.1}>
          <ArticleCard article={article} />
        </TextReveal>
      ))}
    </div>
  );
};
