import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const PageContainer = ({ children, className = '' }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={`min-h-screen pt-24 md:pt-28 pb-16 bg-[#F7F3E9] ${className}`}>
      {children}
    </div>
  );
};
