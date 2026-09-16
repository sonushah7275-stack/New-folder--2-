import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, User } from 'lucide-react';
import { navLinks, secondaryNavLinks } from '../../data/navigation';
import { MobileMenu } from './MobileMenu';
import { Button } from '../common/Button';

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Header background class logic
  const headerBgClass = isHome && !scrolled
    ? 'bg-gradient-to-b from-black/50 via-black/20 to-transparent text-white'
    : 'bg-[#F7F3E9]/95 backdrop-blur-md border-b border-[#1F4D3B]/10 text-[#1F1F1F] shadow-xs';

  const logoColorClass = isHome && !scrolled ? 'text-white' : 'text-[#1F4D3B]';
  const taglineColorClass = isHome && !scrolled ? 'text-white/80' : 'text-[#668F6B]';
  const navLinkColorClass = isHome && !scrolled ? 'text-white/90 hover:text-white' : 'text-[#1F1F1F] hover:text-[#1F4D3B]';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${headerBgClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            
            {/* Left: Brand Logo & Tagline */}
            <Link to="/" className="flex flex-col group focus:outline-none">
              <span className={`font-serif text-2xl sm:text-3xl tracking-[0.15em] font-medium uppercase transition-colors ${logoColorClass}`}>
                TEJOVA
              </span>
              <span className={`text-[9px] sm:text-[10px] tracking-[0.25em] font-medium uppercase -mt-1 transition-colors ${taglineColorClass}`}>
                Expand Your Light
              </span>
            </Link>

            {/* Center: Primary Navigation (Desktop) */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm tracking-wide transition-colors relative py-1 font-medium ${navLinkColorClass} ${
                      isActive ? 'font-semibold' : ''
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F4D3B] rounded-full transition-all" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions: Secondary links, Auth icon, CTA */}
            <div className="hidden lg:flex items-center space-x-6">
              {secondaryNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs tracking-wider uppercase font-medium transition-colors ${navLinkColorClass}`}
                >
                  {link.name}
                </Link>
              ))}

              <Link
                to="/login"
                aria-label="User Account"
                className={`p-2 rounded-full transition-colors ${navLinkColorClass}`}
              >
                <User className="w-5 h-5" />
              </Link>

              <Button
                to="/products"
                variant={isHome && !scrolled ? 'light' : 'primary'}
                size="sm"
              >
                Begin Journey
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-4 lg:hidden">
              <Link
                to="/login"
                aria-label="User Account"
                className={`p-1.5 transition-colors ${navLinkColorClass}`}
              >
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open Navigation Menu"
                className={`p-2 focus:outline-none transition-colors ${navLinkColorClass}`}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};
