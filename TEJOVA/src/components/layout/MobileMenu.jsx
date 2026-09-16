import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon, LinkedinIcon } from '../common/SocialIcons';
import { navLinks, secondaryNavLinks } from '../../data/navigation';
import { Button } from '../common/Button';

export const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-[#1F4D3B] text-white flex flex-col justify-between p-6 sm:p-10 md:hidden overflow-y-auto"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <Link to="/" onClick={onClose} className="text-left">
              <span className="font-serif text-2xl tracking-wider uppercase block">TEJOVA</span>
              <span className="text-[9px] tracking-[0.25em] text-[#A7B99F] uppercase block -mt-1 font-light">
                Expand Your Light
              </span>
            </Link>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Links */}
          <div className="my-auto py-8 space-y-6">
            <nav className="space-y-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Link
                      to={link.path}
                      onClick={onClose}
                      className={`block font-serif text-3xl transition-colors ${
                        isActive ? 'text-[#A7B99F]' : 'text-white/90 hover:text-white'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <hr className="border-white/15 my-6" />

            {/* Secondary Links */}
            <div className="flex space-x-6 text-sm text-white/80">
              {secondaryNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={onClose}
                  className="hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-4">
              <Button to="/products" variant="light" size="lg" className="w-full text-center" onClick={onClose}>
                Begin Your Journey
              </Button>
            </div>
          </div>

          {/* Footer Socials */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-white/60 text-xs">
            <span>&copy; {new Date().getFullYear()} TEJOVA</span>
            <div className="flex space-x-4">
              <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-white transition-colors">
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Youtube" className="hover:text-white transition-colors">
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-white transition-colors">
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
