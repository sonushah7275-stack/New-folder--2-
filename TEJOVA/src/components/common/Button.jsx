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
    primary: 'bg-[#1F4D3B] text-white hover:bg-[#16382A] shadow-sm hover:shadow-md hover:-translate-y-0.5',
    secondary: 'border border-[#1F4D3B] text-[#1F4D3B] bg-transparent hover:bg-[#1F4D3B] hover:text-white hover:-translate-y-0.5',
    light: 'bg-white text-[#1F4D3B] border border-gray-200 hover:border-[#1F4D3B] hover:shadow-sm hover:-translate-y-0.5',
    text: 'text-[#1F4D3B] bg-transparent p-0 hover:text-[#668F6B] group',
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
