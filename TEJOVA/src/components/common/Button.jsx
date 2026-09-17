import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const Button = ({
  children,
  to,
  href,
  variant = 'primary', // 'primary' | 'secondary' | 'light' | 'text'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon = false,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xs tracking-wide focus:outline-none';

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const variantStyles = {
    primary: 'bg-[#D4AF37] text-[#0A2342] hover:bg-[#B87333] hover:text-[#0A2342] hover:-translate-y-0.5',
    secondary: 'border border-[#0A2342] text-[#0A2342] bg-transparent hover:bg-[#0A2342] hover:text-[#F5F3EF] hover:-translate-y-0.5',
    light: 'bg-[#FAF9F6] text-[#0A2342] border border-[#B87333]/40 hover:bg-[#0A2342] hover:text-[#F5F3EF] hover:border-[#0A2342] hover:-translate-y-0.5',
    text: 'text-[#0A2342] bg-transparent p-0 hover:text-[#B87333] group',
  };

  const combinedClasses = `${baseStyles} ${variant !== 'text' ? sizeStyles[size] : ''} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <ArrowRight className={`ml-2 w-4 h-4 transition-transform duration-300 ${variant === 'text' ? 'group-hover:translate-x-1' : ''}`} />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses} onClick={onClick}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClasses} onClick={onClick} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={combinedClasses} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
};
