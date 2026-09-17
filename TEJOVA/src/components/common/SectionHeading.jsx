import React from 'react';

export const SectionHeading = ({
  title,
  subtitle,
  description,
  align = 'center', // 'center' | 'left'
  className = '',
  serifTitle = true,
}) => {
  const alignStyles = {
    center: 'text-center mx-auto max-w-2xl',
    left: 'text-left max-w-2xl',
  };

  return (
    <div className={`mb-12 md:mb-16 ${alignStyles[align]} ${className}`}>
      {subtitle && (
        <span className="block text-xs uppercase tracking-[0.25em] text-[#B87333] font-semibold mb-3">
          {subtitle}
        </span>
      )}
      <h2
        className={`text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-medium text-[#0A2342] tracking-tight leading-tight ${
          serifTitle ? 'font-serif' : ''
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base sm:text-lg text-[#0A2342]/80 leading-relaxed font-light">
          {description}
        </p>
      )}
    </div>
  );
};
