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
        <span className="block text-xs uppercase tracking-[0.2em] text-[#668F6B] font-semibold mb-3">
          {subtitle}
        </span>
      )}
      <h2
        className={`text-3xl sm:text-4xl md:text-5xl font-medium text-[#1F4D3B] tracking-tight leading-tight ${
          serifTitle ? 'font-serif' : ''
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-sm sm:text-base text-[#687280] leading-relaxed font-light">
          {description}
        </p>
      )}
    </div>
  );
};
